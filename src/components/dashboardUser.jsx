import React from 'react';
import tigerMugshot from '../assets/tigerMugshot.jpg';
import { useAuth } from './authContext';
import { useNavigate } from 'react-router-dom';

export default function DashboardUser() {
  const { isLoggedIn, user } = useAuth();
  const navigate = useNavigate();

   // Redirect to login page if not logged in
   React.useEffect(() => {
    if (!isLoggedIn) {
      navigate('/login');
    }
  }, [isLoggedIn, navigate]);

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
        <p>{user.handicap}</p>
      </div>
    </div>
  );
}
