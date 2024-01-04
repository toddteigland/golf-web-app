import React, { createContext, useState, useContext, useEffect } from 'react';
import { useAuth } from './authContext';
import { io } from 'socket.io-client';

// Create context
const ScoresContext = createContext();

// Provider component
export const ScoresProvider = ({ children }) => {
  
  const [scores, setScores] = useState({ round1: {}, round2: {} });
  const { user, isLoggedIn } = useAuth();
  const socket = io('http://localhost:3000');

  useEffect(() => {
    socket.on('scoreUpdated', (updatedScore) => {
      // Trigger a re-fetch of scores for the updated round
      fetchScores(updatedScore.round_id);
    });
  
    return () => socket.off('scoreUpdated');
  }, [socket]);
  
  // Assuming your API can return scores for both rounds in a single request
  const fetchScores = async () => {
    // const userId = user.user_id;
    try {
      const response = await fetch(`http://localhost:3000/getAllScores`);
      const data = await response.json();
      console.log('DATA FROM fetchScores: ', data);
      const updatedScores = { round1: {}, round2: {} };
      data.forEach(score => {
        const roundKey = `round${score.round_id}`;
        updatedScores[roundKey][score.user_id] = updatedScores[roundKey][score.user_id] || {};
        updatedScores[roundKey][score.user_id][score.hole_number] = score.strokes;
      });
      console.log('updated scores structure: : : ', updatedScores);
      setScores(updatedScores);
    } catch (error) {
      console.error('There was an error fetching Scores:', error);
    }
  };

  const handleScoreChange = async (round_Id, user_Id, hole_number, strokes) => {
    console.log("handleScoreChange - score : ", round_Id, user_Id, hole_number, strokes); // Debugging line

    const score = { round_Id, user_Id, hole_number, strokes };
    try {
      const response = await fetch('http://localhost:3000/enterScores', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(score),
      });
  
      // setScores(prevScores => {
      //   // Update the score in the relevant round
      //   const roundKey = `round${round_Id}`;
      //   const updatedScores = { ...prevScores };
      //   updatedScores[roundKey] = updatedScores[roundKey] || {};
      //   updatedScores[roundKey][hole_number] = strokes;
      //   console.log('updated scores :: ', updatedScores);
        
      //   return updatedScores;
      // });
  
      // if (!response.ok) {
      //   throw new Error('Network response was not ok');
      // }
  
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
