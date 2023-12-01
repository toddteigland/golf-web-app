import React, { useEffect, useState } from 'react'
import { useScores } from './scoresContext';

export default function Leaderboard() {
  const [ users, setUsers ] = useState([]);
  const { scores, fetchScores } = useScores();

  const fetchAllUsers = async() => {

    try {
      const response = await fetch (`http://192.168.1.68:3000/getAllUsers`)
      const data = await response.json();
      // console.log('ALL USERS DATA RESULT: ', data);
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
  
      console.log('ALL SCORES results : ', data.rows);
      // const scoresByHole = {};
      // data.forEach(scoreEntry => {
      //   scoresByHole[scoreEntry.hole_id] = scoreEntry.strokes;
      // });
      // console.log('scoresbyhole in fetchScores function::: ', scoresByHole);
      // setScores(scoresByHole)
    } catch (error) {
      console.error('There was an error fetching Scores: ', error)
    }
  };

  useEffect(() => {
    fetchAllUsers();
  },[])

  useEffect(() => {
    fetchAllScores();
    console.log('scores::', scores);
  }, [ ]);

  return(
    <div className='container'>
      <div className='d-flex flex-col justify-content-center'>
        <h1>Leaderboard</h1>
      </div>
      {users.map((user) => {
        return (

          <ul>
            <li key={user.id}>{user.first_name} {user.last_name} - Handicap: {user.handicap}</li>
          </ul>
          )
          })}
          
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
            {/* <tbody>
              {scores.map((score) => {
                return (
                  <tr>
                    <td key={score_id}>{score.user_id} </td>
                  </tr>
                  )
               })} 
            </tbody> */}
          </table>
    </div>
  )
}