import React from 'react';

export default function TournamenRules() {


  return(
    <div className='container mt-3'>
      <div className='d-flex flex-col justify-content-center'>
        <h1>Tournament Rules</h1>
      </div>

      <div>
        <ul>
          <li>Rule #1 - You're not good enough to get mad!</li>
        </ul>
      </div>

      <div>
        <ul>
          <li><strong>OB - White Stakes</strong> - If OB, or thought OB is a possibility, hit provisional (3rd shot). If 1st ball is found (in bounds)
              play as it lies (2nd shot). If 1st ball is in fact OB, play provisional as now 4th shot. If provisional is also OB, then drop at point
              of entry of provisional as now your 5th shot.
          </li>
          <li><strong>OB - Red Stakes</strong> - If OB, or thought OB is a possibility, either hit provisional (3rd shot) or most often, drop two club
              lengths from point of entry, no closer to the hole. *Also with red stakes, if ball is past the stakes but playable, it is 
              still just your 2nd shot.
          </li>
        </ul>
      </div>

    </div>
  );
}