import React, { useEffect, useState } from 'react'

export default function Leaderboard() {
  const [ users, setUsers ] = useState([]);

  const fetchAllUsers = async() => {

    try {
      const response = await fetch (`http://192.168.1.68:3000/getAllUsers`)
      const data = await response.json();
      console.log('ALL USERS DATA RESULT: ', data);
      setUsers(data);

    } catch (error) {
      console.error('There was an error fetching All users.', error)
    }
  };

  useEffect(() => {
    fetchAllUsers();
  },[])

  return(
    <div className='container'>
      <h1>Leaderboard</h1>
      {users.map((user) => {
        return (
          <ul>
            <li key={user.id}>{user.first_name} {user.last_name} - Handicap: {user.handicap}</li>
          </ul>
        )
      })}

    </div>
  )
}