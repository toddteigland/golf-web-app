import React, { useEffect, useState } from 'react'
import { useScores } from './scoresContext';
import { io } from 'socket.io-client';
import tableStyles from '../styles/tables.module.css';
import ScrambleGraph from './scrambleGraph';


export default function Leaderboard() {
  const { courseData, users, scores, teamScores, fetchScores, calculateHolesPlayedForUser, calculateNetScores, leaderboardData, setLeaderboardData } = useScores();
  const [ activeGolfer, setActiveGolfer] = useState(null);
  const socket = io('http://localhost:3000');


  useEffect(() => {
    socket.on('scoreUpdated', () => {
      // Re-fetch scores when an update is received
      fetchScores();
      console.log('Leaderbaord data  on "score updated"', leaderboardData);
    });
    return () => {
      // Clean up when the component unmounts
      socket.off('scoreUpdated');
    };
  }, [socket]);
    
  useEffect(() => {
    console.log('Team Scores:', teamScores);
  },[teamScores])
 
  useEffect(() => {
    if (users.length > 0 && scores) {
      setLeaderboardData(calculateNetScores(courseData));
    }
  }, [users, scores]);

  const handleGolferClick = golferId => {
    setActiveGolfer(golferId);
  };
  
  //this is to render a - instead of a score if one doesn't exist
  const renderHoleScores = (userScores, roundNumber) => {
    let holeScores = [];
    for (let i = 1; i <= 18; i++) {
      holeScores.push(
        <td key={roundNumber + "-" + i}>{userScores[i] !== undefined ? userScores[i] : '-'}</td>
      );
    }
    // console.log('Leaderboard Data update:', leaderboardData);
    return holeScores;
  };
  
  return(
    <div className='container mt-3'>

      <div className='d-flex flex-col justify-content-center'>
        <h1>Leaderboard</h1>
      </div>

      <div className='d-flex flex-column align-items-center justify-content-center gap-3 mt-3'>
        <ul className="nav nav-pills mb-3" id="pills-tab" role="tablist">
          <li className="nav-item" role="presentation">
            <button className="nav-link active" id="pills-individual-tab" data-bs-toggle="pill" data-bs-target="#pills-individual" type="button" role="tab" aria-controls="pills-individual" aria-selected="true">Individual</button>
          </li>
          <li className="nav-item" role="presentation">
            <button className="nav-link" id="pills-scramble-tab" data-bs-toggle="pill" data-bs-target="#pills-scramble" type="button" role="tab" aria-controls="pills-scramble" aria-selected="false">Scramble</button>
          </li>
        </ul>

        <div className="tab-content" id="pills-tabcontent">

          {/* Individual Pane ----------------------------------------------------------------------------------------------------------------------------- */}
          <div className="tab-pane fade show active" id="pills-individual" role="tabpanel">
            <div className='d-flex flex-col justify-content-center'>
              <table className='table table-striped table-hover'>
                <thead>
                  <tr>
                    <th>Name</th>
                    {/* <th>Cap</th> */}
                    <th>R-1</th>
                    <th>R-2</th>
                    <th>Total</th>
                    <th>Net</th>
                  </tr>
                </thead>
                <tbody className='table-group-divider'>
                  {leaderboardData.map(user => (
                    <React.Fragment key={user.user_id}>
                          <tr onClick={() => handleGolferClick(user.user_id)} data-bs-toggle="collapse" data-bs-target={`#collapse${user.user_id}`} aria-expanded="false" aria-controls={`collapse${user.user_id}`}>
                            <td>{user.first_name} {user.last_name} ({user.handicap})</td>
                            <td>{user.round1score}<sup>{user.holesPlayedRound1 < 18 ? user.holesPlayedRound1 : '\u2713'}</sup></td>
                            <td>{user.round2score} <sup>{user.holesPlayedRound2 < 18 ? user.holesPlayedRound2 : '\u2713'}</sup></td>
                            <td>{user.round1score + user.round2score}</td>
                            <td> {user.netScoreToPar > 0 ? `+${user.netScoreToPar}` : user.netScoreToPar}</td>                      
                          </tr>

                        {/* Drop down hole scores----------------------------------------------------------------------------------------------    */}
                      {activeGolfer === user.user_id && (
                        
                        <tr className='container'>
                          <td colSpan="20">
                            <div id={`collapse${user.user_id}`} className={`collapse ${activeGolfer === user.user_id ? 'show' : ''}`} >
                              <div className="accordion-body " style={{ overflowX: 'auto'}}>
                                <table className='table table-striped table-success border' style={{ width: '200%', tableLayout: 'fixed', overflow: 'scroll'}}>
                                  <thead>
                                    <tr>
                                      {/* <th></th> */}
                                      {/* <th></th> */}
                                      <th>1</th>
                                      <th>2</th>
                                      <th>3</th>
                                      <th>4</th>
                                      <th>5</th>
                                      <th>6</th>
                                      <th>7</th>
                                      <th>8</th>
                                      <th>9</th>
                                      <th>10</th>
                                      <th>11</th>
                                      <th>12</th>
                                      <th>13</th>
                                      <th>14</th>
                                      <th>15</th>
                                      <th>16</th>
                                      <th>17</th>
                                      <th>18</th>
                                      <th>Total</th>
                                    </tr>
                                  </thead>
                                  <tbody>

                                    <tr>
                                    {/* <td>Round1</td> */}
                                      {renderHoleScores(user.detailedScores.round1, "round1")}
                                      <td>{user.round1score}</td>
                                    </tr>
                                    <tr>
                                      {/* <td>Round2</td> */}
                                      {renderHoleScores(user.detailedScores.round2, "round2")}
                                      <td>{user.round2score}</td>
                                    </tr>
                                  </tbody>
                                </table>
                                </div>
                            </div>
                          </td>
                        </tr>
                      )}

                    </React.Fragment>
                  ))}
                </tbody>
                
              </table>
            </div>
          </div>

          {/* Scramble Pane ----------------------------------------------------------------------------------------------------------------------------- */}
          <div className="tab-pane fade" id="pills-scramble" role="tabpanel" style={{ height: '600px', width: '380px'}}>
            <div className="d-flex justify-content-center mb-3">
              <ul className='nav nav-pills'>
                <li className="nav-item">
                  <a className="nav-link active" data-bs-toggle="pill" href="#graph-tab">Graph</a>
                </li>
                <li className="nav-item"></li>
                  <a className="nav-link" data-bs-toggle="pill" href="#table-tab">Table</a>
              </ul>
            </div>

            <div className='tab-content'>

              <div className="tab-pane fade show active" id="graph-tab">
                <ScrambleGraph teamScores={teamScores} />
              </div>
              
              <div className="tab-pane fade" id="table-tab">
                <div className='d-flex flex-col justify-content-center'>
                  </div>
                  <div className='pb-4'>
                  <table className='table table-striped table-hover table-bordered'>
                    <thead>
                      <tr>
                        <th>Hole</th>
                        <th colSpan="2" style={{ textAlign: 'center' }}>Team 1</th>
                        <th colSpan="2" style={{ textAlign: 'center' }}>Team 2</th>
                        <th colSpan="2" style={{ textAlign: 'center' }}>Team 3</th>
                      </tr>
                    </thead>
                    <tbody className='table-group-divider'>
                      {Array.from({ length: 18 }, (_, holeIndex) => (
                        <tr key={holeIndex}>
                          <td><strong>{holeIndex + 1}</strong></td>
                          {Object.keys(teamScores).map(teamId => {
                            const holeData = teamScores[teamId][holeIndex + 1] || {};
                            return (
                              <>
                                <td style={{ textAlign: 'end' }}>{holeData.strokes || '-'}</td>
                                <td style={{ textAlign: 'start' }}>{holeData.drive_used || '-'}</td>
                              </>
                            );
                          })}
                        </tr>
                      ))}
                      <tr>
                        <td>Total</td>
                        {Object.keys(teamScores).map(teamId => {
                          const teamData = teamScores[teamId];
                          const totalStrokes = Object.values(teamData).reduce((sum, hole) => sum + (hole.strokes || 0), 0);
                          // Calculate total over/under par here if you have par data available
                          return (
                            <td colSpan="2">{totalStrokes}</td>
                            );
                          })}
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>








          </div>

        </div>
      </div>
    </div>
  )
}