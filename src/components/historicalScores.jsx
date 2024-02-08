import React from 'react';
import HistoricalTable from './historicalTable';

export default function HistoricalScores() {

  return (
    <div className="container pt-4">
      <div className="d-flex flex-collumn justify-content-center mb-3"><h1>Historical Scores</h1></div>

      <div className='d-flex flex-collumn justify-content-center mb-3'>
        <ul className='nav nav-pills mb-3' id='pills-tab' role='tablist'>
          <li className="nav-item" role='presentation'>
            <button className="nav-link active" id='pills-2020-tab' data-bs-toggle='pill' data-bs-target='#tab2020' type='button' role='tab' aria-controls='tab2020' aria-selected='true'>2020</button>
          </li>
          <li className="nav-item" role='presentation'>
            <button className="nav-link " id='pills-2021-tab' data-bs-toggle='pill' data-bs-target='#tab2021' type='button' role='tab' aria-controls='tab2021' aria-selected='false'>2021</button>
          </li>
          <li className="nav-item" role='presentation'>
            <button className="nav-link " id='pills-2022-tab' data-bs-toggle='pill' data-bs-target='#tab2022' type='button' role='tab' aria-controls='tab2022' aria-selected='false'>2022</button>
          </li>
          <li className="nav-item" role='presentation'>
            <button className="nav-link " id='pills-2023-tab' data-bs-toggle='pill' data-bs-target='#tab2023' type='button' role='tab' aria-controls='tab2023' aria-selected='false'>2023</button>
          </li>
        </ul>
      </div>

      <div className="tab-content" id='nav-tabContent'>

        <div className="tab-pane fade show active " id='tab2020' role='tabpanel' >
          <div className="d-flex flex-column justify-content-center align-items-center mb-3">
            <h2 style={{textDecoration: 'underline'}}>Osoyoos, BC</h2>
            <h4>Osoyoos Golf and Country Club</h4>
            <h4>Nk'Mip Canyon Desert</h4>
          </div>
            <HistoricalTable fetchYear={2020} />
        </div>

        <div className="tab-pane fade " id='tab2021' role='tabpanel'>
          <div className="d-flex flex-column justify-content-center align-items-center mb-3">
            <h2 style={{textDecoration: 'underline'}}>Kelowna, BC</h2>
            <h4>Sunset Ranch</h4>
            <h4>Black Mountain</h4>
          </div>
            <HistoricalTable fetchYear={2021} />
        </div>

        <div className="tab-pane fade " id='tab2022' role='tabpanel'>
          <div className="d-flex flex-column justify-content-center align-items-center mb-3">
            <h2 style={{textDecoration: 'underline'}}>Revelstoke, BC</h2>
            <h4>Revelstoke Golf Club</h4>
          </div>
            <HistoricalTable fetchYear={2022} />
        </div>

        <div className="tab-pane fade " id='tab2023' role='tabpanel'>
          <div className="d-flex flex-column justify-content-center align-items-center mb-3">
            <h1 style={{textDecoration: 'underline'}}>Kamloops, BC</h1>
            <h4>Big Horn</h4>
            <h4>Tobiano</h4>
          </div>
            <HistoricalTable fetchYear={2023} />
        </div>

      </div>

    </div>
  )
}