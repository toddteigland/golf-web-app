import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';

export default function CreateUser() {

  let navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    handicap: "",
  });
  const [confirmPassword, setConfirmPassword] = useState("");
  const [registrationError, setRegistrationError] = useState(null);

  const handleChange = (event) => {
    const { name, value } = event.target;
    if (name === 'password2') {
      setConfirmPassword(value);
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    };
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (formData.password !== confirmPassword) {
      setRegistrationError("Passwords do not match.");
      return;
    }
    try {
      const response = await fetch("http://localhost:3000/createUser", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          first_name: formData.firstName,
          last_name: formData.lastName,
          email: formData.email,
          password: formData.password,
          handicap: formData.handicap,
        }),
        
      });
      if (response.ok) {
        // Registration successful, you can redirect or show a success message
        navigate('/login');
      } else {
        const errorData = await response.json();
        if (errorData.error === "Email already in use") {
          setRegistrationError(
            "This email is already in use. Please sign in or use a different email."
          );
        } else {
          // Handle other registration errors
        }
      }
    } catch (error) {
      console.error("Error registering user:", error);
    }
  };

  return(
    <div>

  <form className='container mt-4' onSubmit={handleSubmit}>
    <div className="d-flex justify-content-center mb-3">
      <h1>Create User</h1>
    </div>
    <div className="form-floating mb-3">
      <input type="text" className="form-control" id="floatingInputFirstName" name='firstName' onChange={handleChange} required/>
      <label htmlFor="floatingInput">First Name</label>
    </div>
    <div className="form-floating mb-3">
      <input type="text" className="form-control" id="floatingInputLastName" name='lastName' onChange={handleChange} required/>
      <label htmlFor="floatingInput">Last Name</label>
    </div>
    <div className="form-floating mb-3">
      <input type="email" className="form-control" id="floatingInputEmail" name='email' onChange={handleChange} required/>
      <label htmlFor="floatingInput">Email address</label>
    </div>
    <div className="form-floating mb-3">
      <input type="password" className="form-control" id="password1" name='password' onChange={handleChange} required/>
      <label htmlFor="password1">Password</label>
    </div>
    <div className="form-floating mb-3">
      <input type="password" className="form-control" id="password2" name='password2' onChange={handleChange} required/>
      <label htmlFor="password2">Re-type Password</label>
    </div>
    <div className="form-floating mb-3">
      <input type="text" className="form-control" id="floatingInputHandicap" name='handicap' onChange={handleChange} required/>
      <label htmlFor="floatingInput">Handicap</label>
    </div>
    <div className="mb-3">
      <label htmlFor="formFile" className="form-label">Choose Profile Photo</label>
      <input className="form-control" type="file" id="formFile" />
    </div>
    <div className="d-flex justify-content-center">
      <button type="submit" className="btn btn-lg btn-primary">Submit</button>
    </div>
  </form>

  {registrationError && (
        <div className="modal show" style={{ display: 'block' }} tabIndex="-1">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Registration Error</h5>
                <button type="button" className="btn-close" onClick={() => setRegistrationError('')}></button>
              </div>
              <div className="modal-body">
                <p>{registrationError}</p>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setRegistrationError('')}>Close</button>
              </div>
            </div>
          </div>
        </div>
      )}
      </div>
  )
}