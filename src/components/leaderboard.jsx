import React, { useEffect, useState } from 'react'
import { useScores } from './scoresContext';

export default function Leaderboard() {
  const [ users, setUsers ] = useState([]);
  const { scores, setScores, fetchScores } = useScores();
  const [ leaderboardData, setLeaderboardData] = useState([]);
  const [ activeGolfer, setActiveGolfer] = useState(null);

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

  const fetchAllScores = async() => {
    const courseId = 1;
    try{
      const response = await fetch (`http://localhost:3000/getAllScores?courseId=${courseId}`);
      const data = await response.json();
  
      // console.log('ALL SCORES results : ', data);
      setScores(data);
    } catch (error) {
      console.error('There was an error fetching Scores: ', error)
    }
  };

  useEffect(() => {
    fetchAllUsers();
    fetchAllScores();
  }, [ ]);

  
  const getScoresbyRound = (scores, golferId) => {
    // Filter scores for the specific golfer
    const golferScores = scores.filter(score => score.user_id === golferId);
    let round1score = 0, round2score = 0;
    let detailedScores = {round1: [], round2: []};
    // Sum up the strokes
    golferScores.forEach(score => {
      if(score.round_id === 1) {
        round1score += score.strokes;
        detailedScores.round1.push(score);
      } else if(score.round_id === 2) {
        round2score += score.strokes;
        detailedScores.round2.push(score);
      }
    });
    return { round1score, round2score, detailedScores };
  }

  const loadleaderboardData = () => {
    const data = users.map(user => {
      const { round1score, round2score, detailedScores } = getScoresbyRound(scores, user.user_id);
      return { ...user, round1score, round2score, detailedScores };
    });
    setLeaderboardData(data);
  };
  
  useEffect(() => {
    loadleaderboardData();
  }, [users, scores, activeGolfer]);
  
  const handleGolferClick = golferId => {
    setActiveGolfer(golferId)
    const filteredScores = scores.filter(score => score.user_id === golferId);
  }
  
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
                        <td>{
                          (user.round1score ? user.round1score - user.handicap : 0) +
                          (user.round2score ? user.round2score - user.handicap : 0)
                        }</td>                      
                      </tr>
                  {activeGolfer === user.user_id && (
                    <tr>
                      <td colSpan="12">
                        <div id={`collapse${user.user_id}`} className={`collapse ${activeGolfer === user.user_id ? 'show' : ''}`}>
                          <div className="accordion-body">
                            <table className='table table-striped table-success table-hover border'>
                              <thead>
                                <tr>
                                  <th>Round</th>
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
                                  {user.detailedScores.round1.map(score => (
                                    <td key={score.hole_id}>{score.strokes}</td>
                                    ))}
                                  <td>{user.round1score}</td>
                                </tr>
                                <tr>
                                  <td>Round2</td>
                                  {user.detailedScores.round2.map(score => (
                                    <td key={score.hole_id}>{score.strokes}</td>
                                    ))}
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
  )
}