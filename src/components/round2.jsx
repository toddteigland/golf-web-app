import React, { useEffect, useState } from 'react'
import { useScores } from './scoresContext';
import { useAuth } from './authContext';

export default function Round2() {
  const { user, isLoggedIn } = useAuth();
  const [ courseData, setCourseData ] = useState([]);
  const [selectedTeeRnd2, setSelectedTeeRnd2] = useState(() => {
    return localStorage.getItem('selectedTeeRnd2') || '';
  });
  const { scores, handleScoreChange, fetchScores, calculateNetHoleScore, leaderboardData } = useScores();

  useEffect(() => {
    const fetchCourse = async() => {
      const courseId = 2;
      try{
        const response = await fetch (`http://localhost:3000/getCourseInfo?courseId=${courseId}`);
        const data = await response.json();

        setCourseData(data)
      } catch (error) {
        console.error('There was an error fetching course data!', error)
      }
    };
    fetchCourse();
    fetchScores();
  }, [selectedTeeRnd2]);

  const handleTabClick = (color) => {
    setSelectedTeeRnd2(color);
    localStorage.setItem('selectedTeeRnd2', color);
  };
  
  const getTabClassName = (color) => {
    return `nav-link ${selectedTeeRnd2 === color ? 'active' : ''}`;
  };
  
  const handleScoreInput = (holeNumber, value) => {
    const strokes = parseInt(value, 10) || 0;
    handleScoreChange(2, user.user_id, holeNumber, strokes);
  };
    
  //Adding square or circle for birdies/bogeys
  const getBorderStyle = (netOverUnderPar, holeScore) => {
    if (netOverUnderPar === -1 || netOverUnderPar === -2 || (netOverUnderPar === -3 && holeScore !== 0) ) {
      return {
        backgroundColor: "lightgreen",
      };
    } else if (netOverUnderPar > 0) {
      return {
        backgroundColor: "salmon"
      };
    } else {
      return {
      };
    }
  };
  
    //-------- Function to render the table based on active tee color-------------------------------------------------------
    const renderTeeTable = (color) => {
      // console.log('scores state in RenderTeeTable:: ', scores);
      if (!Array.isArray(courseData)) {
        return <p>Loading data or data format is incorrect...</p>;
      }
      let front9Total = 0;
      let front9Net = 0;
      let front9OverUnder = 0;
      let back9Total = 0;
      let back9Net = 0; 
      let back9OverUnder = 0;
      let currentScore = 0;

      let totalScore = 0;
      let totalPar = 0;
      let totalNetScore = 0;
      let totalOverUnderPar = 0;
      let totalNetOverUnderPar = 0;

      // Filter the courseData based on tee color and generate the table
      const filteredData = courseData.filter(item => item.tee_name === color);
      return (
        <table className='table table-striped table-hover'>
          <thead>
            <tr>
              <th>Hole</th>
              <th>Yards</th>
              <th>Cap</th>
              <th>Par</th>
              <th>Score</th>
              <th>Net</th>
              <th>+/-</th>
            </tr>

          </thead>
          <tbody>
            {filteredData.map((hole, index) => {
              const holeScore = scores.round2[user.user_id]?.[hole.hole_number] || 0;
              const netHoleScore = calculateNetHoleScore(holeScore, user.handicap, hole.handicap);
              const overUnderPar = netHoleScore - hole.par;
              const netOverUnderPar = netHoleScore - hole.par;
              totalScore += holeScore;
              totalPar += hole.par;
              totalNetScore += netHoleScore;
              if (index < 9) {
                front9Total += holeScore; // Sum up the scores for the front 9
                front9Net += netHoleScore
                front9OverUnder += netOverUnderPar
              } else {
                back9Total += holeScore; 
                back9Net += netHoleScore;  
                back9OverUnder += netOverUnderPar;
              }
              currentScore += holeScore;
              if (holeScore !== 0) { // Only consider played holes
                totalOverUnderPar += overUnderPar;
                totalNetOverUnderPar += netOverUnderPar;
              }
              const holeRows = [
                <tr key={hole.hole_number}>
                  <td>{hole.hole_number}</td>
                  <td>{hole.yardage}</td>
                  <td>{hole.handicap}</td>
                  <td>{hole.par}</td>
                  <td>
                    <input  
                      type='number'
                      value={holeScore}
                      onChange={(e) => handleScoreInput(hole.hole_number, e.target.value)}
                      style={{ textAlign: 'center', maxWidth: '45px' }}
                      />
                  </td>
                  <td style={{...getBorderStyle(netOverUnderPar, holeScore), textAlign: 'center'}}>{netHoleScore}</td>
                  <td>{holeScore ? `(${netOverUnderPar > 0 ? '+' : ''}${netOverUnderPar})` : ''}</td>
                </tr>
              ];

              // Conditionally add "Out" row after 9th hole
              if (index === 8) {
                holeRows.push(
                  <tr key="out">
                    <td colSpan="3"><strong>Out</strong></td>
                    <td colSpan="2"><strong>Total: {front9Total}</strong></td>
                    <td colSpan="2"><strong>Net: {front9Net} ({front9OverUnder})</strong></td>
                     {/* <td colSpan="1"><strong>({front9OverUnder})</strong></td> */}
                  </tr>
                );
              }
                  
              // Conditionally add "In" row after 18th hole
              if (index === filteredData.length - 1) {
                holeRows.push(
                  <tr key="in">
                    <td colSpan="3"><strong>In</strong></td>
                    <td colSpan="2"><strong>Total: {back9Total}</strong></td>
                    <td colSpan="2"><strong>Net: {back9Net} ({back9OverUnder})</strong></td>
                    {/* <td colSpan="1"><strong>({back9OverUnder})</strong></td> */}
                  </tr>
                );
              }
                  
              return holeRows; // Return the array of rows, which could contain 1 or 2 rows
            })}

            <tr style={{ borderTop: '2px solid black' }}>
              <td colSpan="3" className='fw-bold'>Total</td>
              <td colSpan="2" className='fw-bold'>{totalScore}({totalOverUnderPar})</td>
              <td colSpan="2" className='fw-bold'>Net: {totalNetScore} ({totalNetOverUnderPar}) </td>
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
              {selectedTeeRnd2 === 'Yellow' && (
                <div className="tab-pane fade show active" id="pills-Yellow" role="tabpanel">
                    {renderTeeTable('Yellow')}
                  </div>
                )}
                {selectedTeeRnd2 === 'Green' && (
                  <div className="tab-pane fade show active" id="pills-Green" role="tabpanel">
                    {renderTeeTable('Green')}
                  </div>
                )}
                {selectedTeeRnd2 === 'Combo' && (
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