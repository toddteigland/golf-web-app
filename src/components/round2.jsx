import React, { useEffect, useState } from 'react'
import { useScores } from './scoresContext';
import { useAuth } from './authContext';

export default function Round2() {
  const { user, isLoggedIn } = useAuth();
  const [ courseData, setCourseData ] = useState([]);
  const [selectedTee, setSelectedTee] = useState(() => {
    return localStorage.getItem('selectedTee') || '';
  });
  const { scores, handleScoreChange, fetchScores } = useScores();

  const fetchCourse = async() => {
    const courseId = 2;
    try{
      const response = await fetch (`http://localhost:3000/getCourseInfo?courseId=${courseId}`);
      const data = await response.json();

      // console.log('ALL course DATA RESULT: ', data);

      setCourseData(data)
    } catch (error) {
      console.error('There was an error fetching course data!', error)
    }
  };
   
  useEffect(() => {
    fetchCourse();
    fetchScores(2);
  }, []);
  
  //This transforms the scores array of objects, into an object with hole_id as key, and strokes as values
  useEffect(() => {
    // Assuming scores.round1 and scores.round2 are arrays of score objects
    const transformedScores = {
      round1: {},
      round2: {}
    };
    if (scores.round1 && Array.isArray(scores.round1)) {
      scores.round1.forEach(scoreEntry => {
        transformedScores.round1[scoreEntry.hole_number] = scoreEntry.strokes;
      });
    }
    if (scores.round2 && Array.isArray(scores.round2)) {
      scores.round2.forEach(scoreEntry => {
        transformedScores.round2[scoreEntry.hole_number] = scoreEntry.strokes;
      });
    }
  }, [scores]);

  const handleTabClick = (color) => {
    setSelectedTee(color);
    localStorage.setItem('selectedTee', color);
  };
  
  const getTabClassName = (color) => {
    return `nav-link ${selectedTee === color ? 'active' : ''}`;
  };
  
  const handleScoreInput = (holeNumber, value) => {
    const user_Id = user.user_id;// User's ID
    const round_Id = 2;// Current round's ID
    const hole_number = holeNumber;
    const strokes = parseInt(value, 10) || 0;
    handleScoreChange(round_Id, user_Id, hole_number, strokes);
  };
  
  const calculateNetHoleScore = (holeScore, handicap, holeHandicap) => {
    if (handicap >= holeHandicap) {
      // Subtract one stroke if the hole is within the range of the handicap
      return Math.max(0, holeScore - 1);
    }
    return holeScore;
  };
  
  //Adding square or circle for birdies/bogeys
  const getBorderStyle = (holeNumber) => {
    const holeScore = scores[holeNumber];
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
        borderColor: "green",
        borderWidth: 2,
      };
    } else if (holeScore > holeData.par) {
      return {
        borderRadius: 0,
        borderColor: "red",
        borderWidth: 2,
      };
    } else {
      return {
        border: 0,
      };
    }
  };
  
  
    //-------- Function to render the table based on active tee color-------------------------------------------------------
    const renderTeeTable = (color) => {
      // console.log('scores state in RenderTeeTable:: ', scores);
      if (!Array.isArray(courseData)) {
        return <p>Loading data or data format is incorrect...</p>;
      }
      let totalScore = 0;
      let totalPar = 0;
      let totalNetScore = 0;
      const sortedHoles = courseData
        .filter(hole => hole.tee_name.toLowerCase() === color)
        .sort((a, b) => a.handicap - b.handicap); // Sort by difficulty rank

      // Filter the courseData based on tee color and generate the table
      const filteredData = courseData.filter(item => item.tee_name === color);
      return (
        <table className='table table-striped table-hover'>
          <thead>
            <tr>
              <th>Hole</th>
              <th>Yards</th>
              <th>Par</th>
              <th>Score</th>
              <th>Cap</th>
              <th>Net</th>
              <th>+/-</th>
            </tr>

          </thead>
          <tbody>
            {filteredData.map((hole, index) => {
              const holeScore = scores.round2[hole.hole_number] || 0; // Access the score directly using hole_id
              const netHoleScore = calculateNetHoleScore(holeScore, user.handicap, hole.handicap); // index + 1 because difficulty_rank starts at 1
              const overUnderPar = netHoleScore - hole.par;
              totalScore += holeScore;
              totalPar += hole.par;
              totalNetScore += netHoleScore;
              return (
                <tr key={index}>
                  <td>{hole.hole_number}</td>
                  <td>{hole.yardage}</td>
                  <td>{hole.par}</td>
                  <td>
                    <input  
                      className='w-50' 
                      type='number'
                      value={scores.round2[hole.hole_number]}
                      onChange={(e) => handleScoreInput(hole.hole_number, e.target.value)}
                      style={{ ...getBorderStyle(hole.hole_number), textAlign: 'center' }}
                      />
                  </td>
                  <td>{hole.handicap}</td>
                  <td>{netHoleScore}</td>
                  <td>{holeScore ? `(${overUnderPar > 0 ? '+' : ''}${overUnderPar})` : ''}</td>
                </tr>
              );
            })}
            <tr>
              <td colSpan="3" className='fw-bold'>Total</td>
              <td colSpan="3" className='fw-bold'>{`${totalScore} (${totalScore - totalPar > 0 ? '+' : ''}${totalScore - totalPar})`}</td>
              <td colSpan="3" className='fw-bold'>Net:{totalNetScore} </td>
            </tr>
          </tbody>
        </table>
      );
    };
    // End of Table Content ---------------------------------------------------------------------------------------------

    // Start of Page Content --------------------------------------------------------------------------------------------
  return(
    <div className='container'>
      {!isLoggedIn ? <div className='d-flex justify-content-center pt-5'><h2>Please log in to view this page.</h2></div>
      : (  
        <>
          <div className="border border-primary rounded shadow bg-info my-4 d-flex flex-column align-items-center">
            <h1>Round 2</h1>
            <h2>{courseData.length > 0 && (courseData[0].course_name) }</h2>
            <small>{courseData.length > 0 && (courseData[0].address) }</small>
          </div>

          <div className='d-flex flex-column align-items-center gap-3'>
            <h3>Select Tee</h3>
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
            <div className="tab-content" id="pills-tabContent">
              {selectedTee === 'Yellow' && (
                <div className="tab-pane fade show active" id="pills-Yellow" role="tabpanel">
                    {renderTeeTable('Yellow')}
                  </div>
                )}
                {selectedTee === 'Green' && (
                  <div className="tab-pane fade show active" id="pills-Green" role="tabpanel">
                    {renderTeeTable('Green')}
                  </div>
                )}
                {selectedTee === 'Combo' && (
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