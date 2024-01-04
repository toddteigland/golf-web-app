import React, { useEffect, useState } from 'react'
import { useScores } from './scoresContext';
import { useAuth } from './authContext';

export default function Round1() {
  const { user, isLoggedIn } = useAuth();
  const [ courseData, setCourseData ] = useState([]);
  const [selectedTee, setSelectedTee] = useState(() => {
    return localStorage.getItem('selectedTee') || '';
  });
  const { scores, handleScoreChange, fetchScores } = useScores();

  useEffect(() => {
    const fetchCourse = async() => {
      const courseId = 1;
      try{
        const response = await fetch (`http://localhost:3000/getCourseInfo?courseId=${courseId}`);
        const data = await response.json();

        // console.log('ALL course DATA RESULT: ', data);

        setCourseData(data)
      } catch (error) {
        console.error('There was an error fetching course data!', error)
      }
    };
    fetchCourse();
    fetchScores();
  }, [selectedTee]);

  //This transforms the scores array of objects, into an object with hole_id as key, and strokes as values
  // useEffect(() => {
    // Assuming scores.round1 and scores.round2 are arrays of score objects
  //   const transformedScores = {
  //     round1: {},
  //     round2: {}
  //   };
  //   if (scores.round1 && Array.isArray(scores.round1)) {
  //     scores.round1.forEach(scoreEntry => {
  //       transformedScores.round1[scoreEntry.hole_number] = scoreEntry.strokes;
  //     });
  //   }
    
  //   if (scores.round2 && Array.isArray(scores.round2)) {
  //     scores.round2.forEach(scoreEntry => {
  //       transformedScores.round2[scoreEntry.hole_number] = scoreEntry.strokes;
  //     });
  //   }
  //   console.log('scores :: ', scores);
  // }, [scores]);

  
  const handleTabClick = (color) => {
    setSelectedTee(color);
    localStorage.setItem('selectedTee', color);
  };
  
  const getTabClassName = (color) => {
    return `nav-link ${selectedTee === color ? 'active' : ''}`;
  };
  
  const handleScoreInput = (holeNumber, value) => {
    const strokes = parseInt(value, 10) || 0;
    handleScoreChange(1, user.user_id, holeNumber, strokes);

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
      const filteredData = courseData.filter(item => item.tee_name.toLowerCase() === color);
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
              const holeScore = scores.round1[user.user_id]?.[hole.hole_number] || 0;
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
                      value={scores.round1[user.user_id]?.[hole.hole_number]}
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
            <h1>Round 1</h1>
            <h2>{courseData.length > 0 && (courseData[0].course_name) }</h2>
            <small>{courseData.length > 0 && (courseData[0].address) }</small>
          </div>

          <div className='d-flex flex-column align-items-center gap-3'>
            <h3>Select Tee</h3>
            <ul className="nav nav-pills mb-3" id="pills-tab" role="tablist">
              <li className="nav-item" role="presentation">
                <button className={getTabClassName('black')} onClick={() => handleTabClick('black')} id="pills-black-tab" data-bs-toggle="pill" data-bs-target="#pills-black" type="button" role="tab" aria-controls="pills-black" aria-selected="true">Black</button>
              </li>
              <li className="nav-item" role="presentation">
                <button className={getTabClassName('blue')} onClick={() => handleTabClick('blue')} id="pills-blue-tab" data-bs-toggle="pill" data-bs-target="#pills-blue" type="button" role="tab" aria-controls="pills-blue" aria-selected="false">Blue</button>
              </li>
              <li className="nav-item" role="presentation">
                <button className={getTabClassName('white')} onClick={() => handleTabClick('white')} id="pills-white-tab" data-bs-toggle="pill" data-bs-target="#pills-white" type="button" role="tab" aria-controls="pills-white" aria-selected="false">White</button>
              </li>
            </ul>
            <div className="tab-content" id="pills-tabContent">
              {selectedTee === 'black' && (
                <div className="tab-pane fade show active" id="pills-black" role="tabpanel">
                    {renderTeeTable('black')}
                  </div>
                )}
                {selectedTee === 'blue' && (
                  <div className="tab-pane fade show active" id="pills-blue" role="tabpanel">
                    {renderTeeTable('blue')}
                  </div>
                )}
                {selectedTee === 'white' && (
                  <div className="tab-pane fade show active" id="pills-white" role="tabpanel">
                    {renderTeeTable('white')}
                  </div>
                )}
            </div>
          </div>
        </>
      )}

    </div>
  );
}