import React, { useEffect, useState } from 'react'
import { useScores } from './scoresContext';
import { io } from 'socket.io-client';


export default function Leaderboard() {
  const [ users, setUsers ] = useState([]);
  const { scores, setScores, fetchScores } = useScores();
  const [ leaderboardData, setLeaderboardData] = useState([]);
  const [ activeGolfer, setActiveGolfer] = useState(null);
  const socket = io('http://localhost:3000');


  useEffect(() => {
    socket.on('scoreUpdated', () => {
      // Re-fetch scores when an update is received
      fetchScores();
    });
    return () => {
      // Clean up when the component unmounts
      socket.off('scoreUpdated');
    };
  }, [socket]);
  
  useEffect(() => {
    const fetchAllUsers = async() => {
      try {
        const response = await fetch (`http://localhost:3000/getAllUsers`)
        const data = await response.json();
        // console.log('ALL USERS DATA RESULT: ', data)
        setUsers(data);
      } catch (error) {
        console.error('There was an error fetching All users.', error)
      }
    };
    fetchAllUsers();
    fetchScores();
  }, [ ]);

  
  const calculateNetScores = () => {
    return users.map(user => {
      const userScoresRound1 = scores.round1[user.user_id] || {};
      const userScoresRound2 = scores.round2[user.user_id] || {};
  
      // Calculate total strokes for each round
      const round1score = Object.values(userScoresRound1).reduce((acc, stroke) => acc + stroke, 0);
      const round2score = Object.values(userScoresRound2).reduce((acc, stroke) => acc + stroke, 0);
  
      // Calculate net score
      const netScore = (round1score - user.handicap) + (round2score - user.handicap);
      
      // Return the user's data with their scores
      return { ...user, round1score, round2score, netScore, detailedScores: { round1: userScoresRound1, round2: userScoresRound2 } };
    }).sort((a, b) => a.netScore - b.netScore);
  };
  
  

  useEffect(() => {
    if (users.length > 0 && scores) {
      setLeaderboardData(calculateNetScores());
    }
  }, [users, scores]);

  const handleGolferClick = golferId => {
    setActiveGolfer(golferId);
  };
  
      // Sorting by net score (ascending order, lowest net score first)
    //   const sortedData = dataWithNetScores.sort((a, b) => {
    //     if (a.netScore === 0 && b.netScore === 0) return 0; // Both have net score of 0
    //     if (a.netScore === 0) return 1; // Only A has net score of 0
    //     if (b.netScore === 0) return -1; // Only B has net score of 0
    //     return a.netScore - b.netScore; // Normal sorting by net score
    //   });  
    //   setLeaderboardData(sortedData);
    // };

    //this is to render a - instead of a score if one doesn't exist
    const renderHoleScores = (userScores, roundNumber) => {
      let holeScores = [];
      for (let i = 1; i <= 18; i++) {
        holeScores.push(
          <td key={roundNumber + "-" + i}>{userScores[i] !== undefined ? userScores[i] : '-'}</td>
        );
      }
      return holeScores;
    };
  
  return(
    <div className='container mt-3'>
      <div className='d-flex flex-col justify-content-center'>
        <h1>Leaderboard</h1>
      </div>
          <table className='table table-striped table-hover'>
            <thead>
              <tr>
                <th>Name</th>
                <th>Cap</th>
                <th>R-1</th>
                <th>R-2</th>
                <th>Total</th>
                <th>Net</th>
              </tr>
            </thead>
            <tbody>
              {leaderboardData.map(user => (
                <React.Fragment key={user.user_id}>
                      <tr onClick={() => handleGolferClick(user.user_id)} data-bs-toggle="collapse" data-bs-target={`#collapse${user.user_id}`} aria-expanded="false" aria-controls={`collapse${user.user_id}`}>
                        <td>{user.first_name} {user.last_name}</td>
                        <td>{user.handicap}</td>
                        <td>{user.round1score}</td>
                        <td>{user.round2score}</td>
                        <td>{user.round1score + user.round2score}</td>
                        <td>{user.netScore}</td>                      
                      </tr>
                  {activeGolfer === user.user_id && (
                    
                    <tr>
                      <td colSpan="12">
                        <div id={`collapse${user.user_id}`} className={`collapse ${activeGolfer === user.user_id ? 'show' : ''}`}>
                          <div className="accordion-body">
                            <table className='table table-striped table-success table-hover border'>
                              <thead>
                                <tr>
                                  <th></th>
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
                                  <td>Round1</td>
                                  {renderHoleScores(user.detailedScores.round1, "round1")}
                                  <td>{user.round1score}</td>
                                </tr>
                                <tr>
                                  <td>Round2</td>
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
          <div className='d-flex flex-col justify-content-center'>
            <h1>Scramble</h1>
          </div>
    </div>
  )
}