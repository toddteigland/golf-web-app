import React, {useState, useEffect} from 'react'
import { useAuth } from './authContext';
import { useScores } from './scoresContext';
import tableStyles from '../styles/tables.module.css';
import { Link } from 'react-router-dom';

export default function Scramble() {
  const { user, isLoggedIn } = useAuth();
  const [ courseData, setCourseData ] = useState([]);
  const [selectedTeeScramble, setSelectedTeeScramble] = useState(() => {
    return localStorage.getItem('selectedTeeScramble') || '';
  });
  const { teamScores, handleTeamScoreChange, fetchScores, fetchTeamScores, handleTeamDriveChange } = useScores();
  const [teamData, setTeamData] = useState([]);

  useEffect(() => {
    // fetchTeamScores();
    // console.log('TEAM SCORES STATE:', teamScores);
    // console.log('TEAM DATA:', teamData);

  },[])

  useEffect(() => {
    const fetchCourse = async() => {
      const courseId = 3;
      try{
        const response = await fetch (`http://localhost:3000/getCourseInfo?courseId=${courseId}`);
        const data = await response.json();
        // console.log('ALL course DATA RESULT: ', data);
        setCourseData(data)
      } catch (error) {
        console.error('There was an error fetching course data!', error)
      }
    };
    const fetchTeams = async() => {
      try{
        const response = await fetch (`http://localhost:3000/getTeamData?userId=${user.user_id}`);
        const data = await response.json();
        // console.log('FetchTeams result: ', data);
        setTeamData(data);
      } catch (error) {
        console.error('There was an error fetching Team Data', error);
      }
    }
    fetchCourse();
    fetchTeams();
    fetchTeamScores();
  }, [selectedTeeScramble]);

  // -----------Tee Selection ---------------------------------------------------------------------------------------------------------------------------------
  const handleTabClick = (color) => {
    setSelectedTeeScramble(color);
    localStorage.setItem('selectedTeeScramble', color);
  };
  
  const getTabClassName = (color) => {
    return `nav-link ${selectedTeeScramble === color ? 'active' : ''}`;
  };

  // -----------Score / Drive Inputting -----------------------------------------------------------------------------------------------------------------------
  const handleScoreInput = (holeNumber, value) => {
    console.log('handlescoreinput hit!');
    const strokes = parseInt(value, 10) || 0;
    handleTeamScoreChange(3, teamData[0].team_id, holeNumber, strokes);
  };
  
    // New function to handle when a drive is used
  const updateDriveUsed = async (holeNumber, driveUsed) => {
      // You will need to update your API to handle updating the drive used separately
    await handleTeamDriveChange(3, teamData[0].team_id, holeNumber, driveUsed);
  };

  
  //---------Adding square or circle for birdies/bogeys -----------------------------------------------------------------------------------------------------
  const getBorderStyle = (holeNumber) => {
    const holeScore = teamScores[teamData[0]?.team_id]?.[holeNumber]?.strokes;
    const holeData = courseData.find(hole => hole.hole_number === holeNumber);
    if (!holeData || holeScore === undefined) {
      return {
        borderRadius: 8,
        borderColor: "gray",
        borderWidth: 1,
      };
    }
    if (holeScore < holeData.par) {
      return {
        borderRadius: 50,
        borderColor: "lightgreen",
        borderWidth: 5,
      };
    } else if (holeScore > holeData.par) {
      return {
        borderRadius: 0,
        borderColor: "red",
        borderWidth: 5,
      };
    } else {
      return {
        borderRadius: 8,
        borderColor: "gray",
        borderWidth: 1,
      };
    }
  };

    //-------- Function to render the table based on active tee color-------------------------------------------------------
    const renderTeeTable = (color) => {
      if (!Array.isArray(courseData)) {
        return <p>Loading data or data format is incorrect...</p>;
      }
      let totalScore = 0;
      let totalPar = 0;
      let overUnderPar = 0;
      // let totalNetScore = 0;
      const sortedHoles = courseData
        .filter(hole => hole.tee_name.toLowerCase() === color)
        .sort((a, b) => a.handicap - b.handicap); // Sort by difficulty rank

      // Filter the courseData based on tee color and generate the table
      const filteredData = courseData.filter(item => item.tee_name === color);
      return (
        <table className={tableStyles.table}>
          <thead className={tableStyles.thead}>
            <tr className={tableStyles.tr}>
              <th className={tableStyles.th} style={{ width: '15%'}}>Hole</th>
              <th className={tableStyles.th} style={{ width: '15%'}}>Yards</th>
              <th className={tableStyles.th} style={{ width: '10%'}}>Par</th>
              <th className={tableStyles.th} style={{ width: '30%'}}>Score</th>
              <th className={tableStyles.th} style={{ width: '30%'}}>Drive Used</th>
              {/* <th>Cap</th> */}
              {/* <th>Net</th> */}
              {/* <th>+/-</th> */}
            </tr>

          </thead>
          <tbody>
            {filteredData.map((hole, index) => {
              const holeScore = teamScores[teamData[0]?.team_id]?.[hole.hole_number]?.strokes || 0;
              const driveUsed = teamScores[teamData[0]?.team_id]?.[hole.hole_number]?.drive_used || "Select";

              totalScore += holeScore;
              totalPar += hole.par;
              overUnderPar += (holeScore - hole.par);
              // totalNetScore += netHoleScore;
              return (
                <tr key={index}>
                  <td>{hole.hole_number}</td>
                  <td>{hole.yardage}</td>
                  <td>{hole.par}</td>
                  <td>
                    <input  
                      className={tableStyles.input} 
                      type='number'
                      value={holeScore}
                      onChange={(e) => handleScoreInput(hole.hole_number, e.target.value)}
                      style={{ ...getBorderStyle(hole.hole_number), textAlign: 'center' }}
                      />
                  </td>
                  <td className={tableStyles.select}>
                  <select 
                    className='form-select'
                    // defaultValue="Select"
                    value={driveUsed}
                    onChange={(e) => updateDriveUsed(hole.hole_number, e.target.value)}
                  >
                    <option value="Select" disabled hidden>Select</option>
                    {teamData.map((member, index) => (
                      <option key={index} value={member.first_name}>
                        {member.first_name}
                      </option>
                    ))}
                  </select>
                  </td>
                  {/* <td>{hole.handicap}</td>
                  <td>{netHoleScore}</td>
                  <td>{holeScore ? `(${overUnderPar > 0 ? '+' : ''}${overUnderPar})` : ''}</td> */}
                </tr>
              );
            })}
            <tr >
              <td colSpan="3" className='fw-bold fs-2'>Total:</td>
              <td colSpan="3" className='fw-bold fs-2'>{`${totalScore} (${totalScore - totalPar > 0 ? '+' : ''}${totalScore - totalPar})`}</td>
              {/* <td colSpan="2" className='fw-bold fs-2'>Net:{totalNetScore} </td> */}
            </tr>
          </tbody>
        </table>
      );
    };



    return(
      <div className='container'>
        {!isLoggedIn ? <div className='d-flex justify-content-center pt-5'><h2>Please log in to view this page.</h2></div>
        : (  
          <>
            <div className="border border-primary rounded shadow bg-info my-3 d-flex flex-column align-items-center">
              <h1>Scramble</h1>
              <h2>{courseData.length > 0 && (courseData[0].course_name) }</h2>
              <small>{courseData.length > 0 && (courseData[0].address) }</small>
            </div>
  
            <div className='d-flex flex-column align-items-center gap-3'>
              
              <div className='border border-secondary rounded shadow bg-warning mb-1 p-1 d-flex flex-column align-items-center'>
                <h2>{teamData.length > 0 ? teamData[0].team_name : 'Loading team...'}</h2>
                <h3>
                  {teamData.map((member, index) => (
                    <span key={index}>{member.first_name}{index < teamData.length - 1 ? ', ' : ''}</span>
                  ))}
                </h3>
                <div>
                  <Link to='/scrambleRules'>
                    <h4>Scramble Rules</h4>
                  </Link>
                </div>
              </div>

              {/* <h3>Select Tee</h3> */}
              <ul className="nav nav-pills mb-3" id="pills-tab" role="tablist">
                <li className="nav-item" role="presentation">
                  <button className={getTabClassName('Yellow')} onClick={() => handleTabClick('Yellow')} id="pills-Yellow-tab" data-bs-toggle="pill" data-bs-target="#pills-Yellow" type="button" role="tab" aria-controls="pills-Yellow" aria-selected="true">Yellow</button>
                </li>
                <li className="nav-item" role="presentation">
                  <button className={getTabClassName('Green')} onClick={() => handleTabClick('Green')} id="pills-Green-tab" data-bs-toggle="pill" data-bs-target="#pills-Green" type="button" role="tab" aria-controls="pills-Green" aria-selected="false">Green</button>
                </li>
                <li className="nav-item" role="presentation">
                  <button className={getTabClassName('Combo')} onClick={() => handleTabClick('Combo')} id="pills-Combo-tab" data-bs-toggle="pill" data-bs-target="#pills-Combo" type="button" role="tab" aria-controls="pills-Combo" aria-selected="false">Combo</button>
                </li>
              </ul>


              <div className="tab-content" style={{width: '100%'}} id="pills-tabContent">
                {selectedTeeScramble === 'Yellow' && (
                  <div className="tab-pane fade show active" id="pills-Yellow" role="tabpanel">
                      {renderTeeTable('Yellow')}
                    </div>
                  )}
                  {selectedTeeScramble === 'Green' && (
                    <div className="tab-pane fade show active" id="pills-Green" role="tabpanel">
                      {renderTeeTable('Green')}
                    </div>
                  )}
                  {selectedTeeScramble === 'Combo' && (
                    <div className="tab-pane fade show active" id="pills-Combo" role="tabpanel">
                      {renderTeeTable('Combo')}
                    </div>
                  )}
              </div>
            </div>
          </>
        )}
  
      </div>
    );
  }