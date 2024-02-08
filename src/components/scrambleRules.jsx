import React from 'react';
import { Link } from 'react-router-dom';


export default function ScrambleRules() {


  return(
    <div className='container mt-3'>

      <div className='d-flex flex-col justify-content-center mb-3'>
        <h1>Scramble Rules</h1>
      </div>

      <div className='fs-3'>
        <ul>
          <li>Must use each golfers drive <strong>3</strong> times</li>
          <li>Hole 1 - Teeshots off the fairway - shotgun &#127866; </li>
          <li>Hole 4 - KP ⛳</li>
          <li>Hole 7 - Long Drive 💥</li>
        </ul>
      </div>

      <div>
        <p>*Back to <Link to='/scramble'>Scramble Scorecard</Link>*</p>
      </div>
    </div>
  );
}