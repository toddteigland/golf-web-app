import React, { useEffect, useState } from 'react'
import { useScores } from './scoresContext';
import { useAuth } from './authContext';

export default function Round1() {
  const { user, isLoggedIn } = useAuth();
  const [ courseData, setCourseData ] = useState([]);
  const [selectedTee, setSelectedTee] = useState(() => {
    return localStorage.getItem('selectedTee') || '';
  });
  const { scores, handleScoreChange, fetchScores } = useScores();

  const fetchCourse = async() => {
    const courseId = 1;
    try{
      const response = await fetch (`http://localhost:3000/getCourseInfo?courseId=${courseId}`);
      const data = await response.json();

      // console.log('ALL course DATA RESULT: ', data);

      setCourseData(data)
    } catch (error) {
      console.error('There was an error fetching course data!', error)
    }
  };
  
  useEffect(() => {
    fetchCourse();
  }, []);

  useEffect(() => {
    fetchScores();
  }, [ localStorage.getItem('scores') ]);
  
  const handleTabClick = (color) => {
    setSelectedTee(color);
    localStorage.setItem('selectedTee', color);
  };
  
  const getTabClassName = (color) => {
    return `nav-link ${selectedTee === color ? 'active' : ''}`;
  };
  
  const handleScoreInput = (holeId, value) => {
    const user_Id = user.user_id;// User's ID
    const round_Id = 1;// Current round's ID
    const hole_id = holeId;
    const strokes = value; // Score input by the user
    handleScoreChange(round_Id, user_Id, hole_id, strokes);
  };
  

    // Function to render the table based on active tee color
    const renderTeeTable = (color) => {
      // console.log('scores state in RenderTeeTable:: ', scores);
      if (!Array.isArray(courseData)) {
        return <p>Loading data or data format is incorrect...</p>;
      }
      let totalScore = 0;
      let totalPar = 0;
      // Filter the courseData based on tee color and generate the table
      const filteredData = courseData.filter(item => item.tee_name.toLowerCase() === color);
      return (
        <table className='table table-striped table-hover'>
          {/* Table headers */}
          <tbody>
            {filteredData.map((hole, index) => {
              const score = scores[hole.hole_id] || 0;
              const overUnderPar = score - hole.par;
              totalScore += score;
              totalPar += hole.par;
              // Log the hole object here
              // console.log('Hole object in map:', hole, 'Hole ID:', hole.hole_id);
    
              return (
                <tr key={index}>
                  <td>{hole.hole_number}</td>
                  <td>{hole.yardage}</td>
                  <td>{hole.par}</td>
                  <td>
                    <input
                      className='rounded w-25' 
                      type='number'
                      value={scores[hole.hole_id] || ''}
                      onChange={(e) => handleScoreInput(hole.hole_id, e.target.value)}
                    />
                  </td>
                  <td>{score !== 0 ? `(${overUnderPar > 0 ? '+' : ''}${overUnderPar})` : ''}</td>
                </tr>
              );
            })}
                    <tr>
          <td colSpan="3">Total</td>
          <td>{`${totalScore} (${totalScore - totalPar > 0 ? '+' : ''}${totalScore - totalPar})`}</td>
        </tr>
          </tbody>
        </table>
      );
    };

  return(
    <div className='container'>
      {!isLoggedIn ? <div className='d-flex justify-content-center pt-5'><h2>Please log in to view this page.</h2></div>
      : (  
        <>
          <div className="border border-primary rounded shadow bg-info my-4 d-flex flex-column align-items-center">
            <h1>Round 1</h1>
            <h2>{courseData.length > 0 && (courseData[0].course_name) }</h2>
            <small>{courseData.length > 0 && (courseData[0].address) }</small>
          </div>

          <div className='d-flex flex-column align-items-center gap-3'>
            <h3>Select Tee</h3>
            <ul className="nav nav-pills mb-3" id="pills-tab" role="tablist">
              <li className="nav-item" role="presentation">
                <button className={getTabClassName('black')} onClick={() => handleTabClick('black')} id="pills-black-tab" data-bs-toggle="pill" data-bs-target="#pills-black" type="button" role="tab" aria-controls="pills-black" aria-selected="true">Black</button>
              </li>
              <li className="nav-item" role="presentation">
                <button className={getTabClassName('blue')} onClick={() => handleTabClick('blue')} id="pills-blue-tab" data-bs-toggle="pill" data-bs-target="#pills-blue" type="button" role="tab" aria-controls="pills-blue" aria-selected="false">Blue</button>
              </li>
              <li className="nav-item" role="presentation">
                <button className={getTabClassName('white')} onClick={() => handleTabClick('white')} id="pills-white-tab" data-bs-toggle="pill" data-bs-target="#pills-white" type="button" role="tab" aria-controls="pills-white" aria-selected="false">White</button>
              </li>
            </ul>
            <div className="tab-content" id="pills-tabContent">
              {selectedTee === 'black' && (
                <div className="tab-pane fade show active" id="pills-black" role="tabpanel">
                    {renderTeeTable('black')}
                  </div>
                )}
                {selectedTee === 'blue' && (
                  <div className="tab-pane fade show active" id="pills-blue" role="tabpanel">
                    {renderTeeTable('blue')}
                  </div>
                )}
                {selectedTee === 'white' && (
                  <div className="tab-pane fade show active" id="pills-white" role="tabpanel">
                    {renderTeeTable('white')}
                  </div>
                )}
            </div>
          </div>
        </>
      )}

    </div>
  );
}