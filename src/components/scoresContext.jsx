import React, { createContext, useState, useContext, useEffect } from 'react';
import { useAuth } from './authContext';

// Create context
const ScoresContext = createContext();

// Provider component
export const ScoresProvider = ({ children }) => {
  
  const [scores, setScores] = useState([]);
  const { user, isLoggedIn } = useAuth();


  const fetchScores = async() => {
    const courseId = 1;
    const userId = user.user_id;
    try{
      const response = await fetch (`http://localhost:3000/getScores?courseId=${courseId}&userId=${userId}`);
      const data = await response.json();
      // console.log('ALL SCORES results : ', data);
      setScores(data)
    } catch (error) {
      console.error('There was an error fetching Scores: ', error)
    }
  };
  


  const handleScoreChange = async (round_Id, user_Id, hole_number, strokes) => {
    const score = { round_Id, user_Id, hole_number, strokes };
    try {
      const response = await fetch('http://localhost:3000/enterScores', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(score),
      });
      setScores(prevScores => {
        const existingScoreIndex = prevScores.findIndex(s => s.hole_number === hole_number && s.user_id === user_Id && s.round_id === round_Id);
        if (existingScoreIndex >= 0) {
          // Update existing score
          const updatedScores = [...prevScores];
          updatedScores[existingScoreIndex] = score;
          return updatedScores;
        } else {
          // Add new score
          return [...prevScores, score];
        }
      });
      await fetchScores();

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      // Handle response
    } catch (error) {
      console.error('There was an error submitting the score: ', error);
    }
  };
 
  return (
    <ScoresContext.Provider value={{ scores, setScores, handleScoreChange, fetchScores }}>
      {children}
    </ScoresContext.Provider>
  );

};

// Hook to use scores context
export const useScores = () => useContext(ScoresContext);
