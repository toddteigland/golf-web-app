import React, { useState } from 'react';
import tigerMugshot from '../assets/tigerMugshot.jpg';
import { useAuth } from './authContext';
import { useNavigate } from 'react-router-dom';

export default function DashboardUser() {
  const { isLoggedIn, user, updateUser } = useAuth();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [editedHandicap, setEditedHandicap] = useState(user?.handicap);


   // Redirect to login page if not logged in
   React.useEffect(() => {
    if (!isLoggedIn) {
      navigate('/login');
    }
  }, [isLoggedIn, navigate]);

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleHandicapChange = (event) => {
    setEditedHandicap(event.target.value);
  };

  const handleSaveClick = async () => {
    try {
      const response = await fetch(`http://localhost:3000/editProfile?handicap=${editedHandicap}&userId=${user.user_id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ handicap: editedHandicap, user_id: user.user_id}),
      });
      setIsEditing(false);
      if (response.ok) {
        console.log('Successfully Edited Handicap');
        // Update user context with new handicap value
        updateUser({ ...user, handicap: editedHandicap });
      }
      // Update user context or state here with new handicap value
    } catch (error) {
      console.error('There was an error Editing handicap: ', error);
    }
  };

  if (!user) {
    // Return a loader or null while user data is being fetched or if user is not logged in
    return <div>Loading...</div>; // or return null;
  }

  return(
    <div className='container d-flex flex-column pt-4 align-items-center'>
      <h1>User Dashboard</h1>
      <div>
        <div style={{ width: '200px', height: '200px', overflow: 'hidden' }}>
          <img src={tigerMugshot} className="rounded-circle" style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="Tiger Mugshot" />
        </div>
      </div>
      <div className='pt-3 d-flex flex-column align-items-center'>
        <p>{user.first_name}</p>
        <p>{user.last_name}</p>
        <p>{user.email}</p>
        {isEditing ? (
                  <>
                  <div className='input-group'>
                    
                    <input 
                      type="number" 
                      value={editedHandicap} 
                      onChange={handleHandicapChange}
                      className='form-control'
                      />
                    <button className='btn btn-outline-primary' type='button' onClick={handleSaveClick}>Save</button>
                  </div>
                  </>
                ) : (
                  <>
                  <div className='input-group'>
                     <p className='px-5'>{user.handicap}</p>
                    <button className='btn btn-outline-primary' type='button' onClick={handleEditClick}>Edit</button>
                  </div>
                  </>
                )}    
          </div>
    </div>
  );
}
