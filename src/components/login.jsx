import React, { useState, useEffect } from 'react'
import { useAuth } from './authContext'
import { useNavigate } from 'react-router-dom';

export default function Login() {

  const navigate = useNavigate();
  const { setIsLoggedIn, setUser, user, isLoggedIn } = useAuth();
  const [ formData, setFormData ] = useState({});
  const [loginErrorPopup, setLoginErrorPopup] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch("http://localhost:3000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        // Fetch user data from server
        const userInfoResponse = await fetch(
          `http://localhost:3000/getUserInfo?email=${formData.email}`
        );
        const userInfo = await userInfoResponse.json();

        setIsLoggedIn(true);
        setUser(userInfo);
        // Successful login, you can redirect or handle accordingly
        // navigate("/dashboardUser", { replace: true });
      } else {
        const errorData = await response.json();
        setLoginErrorPopup(true);
        if (errorData.error === "Invalid User credentials") {
          setLoginErrorPopup("Invalid User Credentials")
        } else {
          //Handle other login errors
          console.log("User Login failed");
          
        }
      }
    } catch (error) {
      console.error("Error logging User in:", error);
    }
  }

  useEffect(() => {
    if (isLoggedIn) {
      navigate("/leaderboard", { replace: true });
    }
  }, [isLoggedIn, navigate]);

  return(
  <div className='container d-flex flex-col justify-content-center'>

    <div style={{ backgroundColor: '#rrr845', position: 'fixed', top: 360, width: '90%', }} className='p-2 rounded'>
      <form className='mt-4 mb-4' onSubmit={handleSubmit}>
        <div className="d-flex justify-content-center mb-3">
          <h1>Sandbagger Invitational</h1>
        </div>
        <div className="form-floating mb-3">
          <input type="email" className="form-control" id="floatingInput" name='email' onChange={handleChange} required/>
          <label htmlFor="floatingInput">Email address</label>
        </div>
        <div className="form-floating mb-3">
          <input type="password" className="form-control" id="password1" name='password' onChange={handleChange} required/>
          <label htmlFor="password1">Password</label>
        </div>
        <div className="d-flex justify-content-center">
          <button type="submit" className="btn btn-lg btn-primary">Login</button>
        </div>  
      </form>
    </div>
    
    {loginErrorPopup && (
      <div className="modal show" style={{ display: 'block' }} tabIndex="-1">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Login Error</h5>
              <button type="button" className="btn-close" onClick={() => setLoginErrorPopup('')}></button>
            </div>
            <div className="modal-body">
              <p>{loginErrorPopup}</p>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={() => setLoginErrorPopup('')}>Close</button>
            </div>
          </div>
        </div>
      </div>
    )}
  </div>
  )
}