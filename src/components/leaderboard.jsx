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

  useEffect(() => {
    async function loadleaderboardData() {
      const data = users.map(user => {
        const { round1score, round2score } = getScoresbyRound(scores, user.user_id);
        return { ...user, round1score, round2score };
      });
      setLeaderboardData(data);
    }
    loadleaderboardData();
    }, [users, scores]);

  const getScoresbyRound = (scores, golferId) => {
    // Filter scores for the specific golfer
    const golferScores = scores.filter(score => score.user_id === golferId);
    let round1score = 0, round2score = 0;
    // Sum up the strokes
    golferScores.forEach(score => {
      if(score.round_id === 1) {
        round1score += score.strokes;
      } else if(score.round_id === 2) {
        round2score += score.strokes;
      }
    });
    return { round1score, round2score };
  }
  
  const handleGolferClick = golferId => {
    setActiveGolfer(activeGolfer === golferId ? null : golferId)
    fetchScores();
  }

  const renderScoresDropdown = golferId => {
    if (golferId!== activeGolfer) return null;
    // const detailedScores = getDetailedScoresForGolfer(golferId);
    return (
      <>
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
        <td>{/* Render detailed Scores here */}</td>
      </tr>
      </tbody>
      </>
    )
  }

  return(
    <div className='container'>
      <div className='d-flex flex-col justify-content-center'>
        <h1>Leaderboard</h1>
      </div>
          <table className='table table-striped table-hover'>
            <thead>
              <tr>
                <th>Name</th>
                <th>Cap</th>
                <th>Round 1</th>
                <th>Round 2</th>
                <th>Total</th>
                <th>Net Total</th>
              </tr>
            </thead>
            <tbody>
            {leaderboardData.map(({ user_id, first_name, last_name, round1score, round2score, handicap }) => (
          <>
          <tr key={user_id} onClick={() => handleGolferClick(users.user_id)}>
            <td>{first_name} {last_name}</td>
            <td>{handicap}</td>
            <td>{round1score}</td>
            <td>{round2score}</td>
            <td>{round1score + round2score} </td>
          </tr>
          {renderScoresDropdown(users.user_id)}
          </>
        ))}
            </tbody>
          </table>
    </div>
  )
}