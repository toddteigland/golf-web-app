import React, { createContext, useState, useContext, useEffect } from 'react';
import { useAuth } from './authContext';
import { io } from 'socket.io-client';

// Create context
const ScoresContext = createContext();

// Provider component
export const ScoresProvider = ({ children }) => {
  
  const [scores, setScores] = useState({ round1: {}, round2: {} });
  const [teamScores, setTeamScores] = useState({});
  const { user, isLoggedIn } = useAuth();
  const [ users, setUsers ] = useState([]);
  const [ leaderboardData, setLeaderboardData] = useState([]);
  const [courseData, setCourseData] = useState({});

  const socket = io('http://localhost:3000');

  const fetchCourseData = async (courseId) => {
    try {
      const response = await fetch(`http://localhost:3000/getCourseInfo?courseId=${courseId}`);
      const data = await response.json();
      setCourseData(prevData => ({ ...prevData, [courseId]: data }));
    } catch (error) {
      console.error('Error fetching course data for course ID:', courseId, error);
    }
  };

  useEffect(() => {
    // Assuming you have course IDs available. Fetch data for each course.
    const courseIds = [1, 2]; // Example course IDs
    courseIds.forEach(fetchCourseData);
  }, []);

  useEffect(() => {
    socket.on('scoreUpdated', (updatedScore) => {
      // Trigger a re-fetch of scores for the updated round
      fetchScores(updatedScore.round_id);
    });
    return () => socket.off('scoreUpdated');
  }, [socket]);
  
  useEffect(() => {
    socket.on('teamScoreUpdated', ( updatedTeamScores) => {
      // Trigger a re-fetch of scores for the updated round
      // console.log('TeamScore Socket triggered');
      fetchTeamScores(updatedTeamScores);
    });
    return () => socket.off('teamScoreUpdated');
  }, [socket]);

  useEffect(() => {
    socket.on('teamDriveUpdated', ( updatedTeamScores) => {
      // console.log('TeamDrive Socket triggered');
      // Trigger a re-fetch of scores for the updated round
      fetchTeamScores(updatedTeamScores);
    });
    return () => socket.off('teamDriveUpdated');
  }, [socket]);

  useEffect(() => {
    const fetchAllUsers = async() => {
      try {
        const response = await fetch (`http://localhost:3000/getAllUsers`)
        const data = await response.json();
        // console.log('ALL USERS DATA RESULT: ', data)
        setUsers(data);
      } catch (error) {
        console.error('There was an error fetching All users.', error)
      }
    };
    fetchAllUsers();
    fetchScores();
    fetchTeamScores(); 
  }, [ ]);

  // Assuming your API can return scores for both rounds in a single request
  const fetchScores = async () => {
    try {
      const response = await fetch(`http://localhost:3000/getAllScores`);
      const data = await response.json();
      const updatedScores = { round1: {}, round2: {} };
      data.forEach(score => {
        const roundKey = `round${score.round_id}`;
        updatedScores[roundKey][score.user_id] = updatedScores[roundKey][score.user_id] || {};
        updatedScores[roundKey][score.user_id][score.hole_number] = score.strokes;
      });
      // console.log('Fetch scores Result:: ', data);
      setScores(updatedScores);
    } catch (error) {
      console.error('There was an error fetching Scores:', error);
    }
  };
  
  const fetchTeamScores = async () => {
    try {
      const response = await fetch(`http://localhost:3000/getTeamScores`);
      const data = await response.json();
      const updatedTeamScores = {};
      data.forEach(score => {
        const { team_id, hole_number, strokes, drive_used } = score;
  
        if (!updatedTeamScores[team_id]) {
          updatedTeamScores[team_id] = {};
        }
        updatedTeamScores[team_id][hole_number] = {
          strokes: strokes,
          drive_used: drive_used
        };
      });
      setTeamScores(updatedTeamScores);    
      // console.log('TEAM SCORES from Context: ', teamScores);
    } catch (error) {
      console.error('There was an error fetching Team Scores:', error);
    }
  };

  const handleScoreChange = async (round_Id, user_Id, hole_number, strokes) => {
    const score = { round_Id, user_Id, hole_number, strokes };
    console.log('Leaderboard data on score change: ', leaderboardData);
    try {
      const response = await fetch('http://localhost:3000/enterScores', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(score),
      });
    } catch (error) {
      console.error('There was an error submitting the score: ', error);
    }
  };
  
  const handleTeamScoreChange = async (round_Id, team_Id, hole_number, strokes) => {
    const score = { round_Id, team_Id, hole_number, strokes };
    try {
      const response = await fetch('http://localhost:3000/enterTeamScores', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(score),
      });  
      console.log('team scores updated!', teamScores);
    } catch (error) {
      console.error('There was an error submitting the team score: ', error);
    }
  };

  const handleTeamDriveChange = async (round_Id, team_Id, hole_number, drive_used) => {
    const score = { round_Id, team_Id, hole_number, drive_used };
    try {
      const response = await fetch('http://localhost:3000/enterTeamDrive', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(score),
      });  
      console.log('Drive entered:', drive_used, ' / Hole Number:', hole_number);
    } catch (error) {
      console.error('There was an error submitting the team Drive: ', error);
    }
  };

  const calculateNetHoleScore = (holeScore, handicap, holeHandicap) => {
    let strokesToSubtract = 0;

    // For handicaps above 18, calculate extra strokes and additional strokes for the hardest holes
    if (handicap > 18) {
        const extraStrokes = Math.floor(handicap / 18);
        const extraHoles = handicap % 18;

        // Add extra strokes for all holes
        strokesToSubtract += extraStrokes;

        // Add an additional stroke for the hardest holes based on the player's handicap
        if (holeHandicap <= extraHoles) {
            strokesToSubtract += 1;
        }
    } else {
        // For handicaps up to 18, a player receives a stroke off on the holes where the hole's handicap ranking is less than or equal to their handicap
        if (holeHandicap <= handicap) {
            strokesToSubtract += 1;
        }
    }

    return Math.max(0, holeScore - strokesToSubtract);
};



const calculateNetScores = () => {
  const participatingUsers = users.filter(user => user.participating);
  return participatingUsers.map(user => {
      
      const userScoresRound1 = scores.round1[user.user_id] || {};
      const userScoresRound2 = scores.round2[user.user_id] || {};
      
      let netScoreToParRound1 = 0;
      let netScoreToParRound2 = 0;
      
      const courseDataRound1 = courseData['1']; // Data for course ID 1
      const courseDataRound2 = courseData['2']; // Data for course ID 2
      
      // Calculate net score to par for each hole in round 1
      Object.entries(userScoresRound1).forEach(([holeNumber, holeScore]) => {
        const holeDetails = courseDataRound1.find(hole => hole.hole_number === parseInt(holeNumber));
        if (holeDetails) {
          const netHoleScore = calculateNetHoleScore(holeScore, user.handicap, holeDetails.handicap);
          netScoreToParRound1 += netHoleScore - holeDetails.par;
        }
      });
      
      // Calculate net score to par for each hole in round 2
      Object.entries(userScoresRound2).forEach(([holeNumber, holeScore]) => {
        const holeDetails = courseDataRound2.find(hole => hole.hole_number === parseInt(holeNumber));
        if (holeDetails) {
          const netHoleScore = calculateNetHoleScore(holeScore, user.handicap, holeDetails.handicap);
          netScoreToParRound2 += netHoleScore - holeDetails.par;
        }
      });
      
      const totalNetScoreToPar = netScoreToParRound1 + netScoreToParRound2;
      
      return {
        ...user,
        round1score: Object.values(userScoresRound1).reduce((acc, stroke) => acc + stroke, 0),
        round2score: Object.values(userScoresRound2).reduce((acc, stroke) => acc + stroke, 0),
        netScoreToPar: totalNetScoreToPar, // Net score relative to par
        holesPlayedRound1: Object.keys(userScoresRound1).length,
        holesPlayedRound2: Object.keys(userScoresRound2).length,
        detailedScores: { round1: userScoresRound1, round2: userScoresRound2 }
      };
    }).sort((a, b) => a.netScoreToPar - b.netScoreToPar);
  };



  


  const calculateHolesPlayedForUser = (roundId, userId) => {
    const userScores = scores[`round${roundId}`]?.[userId];
    console.log('Hit holes played function');
    if (!userScores) return 0;
  
    if (Object.keys(userScores).length < 18) {
      return Object.keys(userScores).length;
    }
    else {
      return `\u2713`;
    }
  };

  return (
    <ScoresContext.Provider value={{ courseData, users, scores, setScores, teamScores, setTeamScores, leaderboardData, setLeaderboardData, handleScoreChange, fetchScores, handleTeamScoreChange, fetchTeamScores, handleTeamDriveChange, calculateNetHoleScore, calculateNetScores, calculateHolesPlayedForUser }}>
      {children}
    </ScoresContext.Provider>
  );

};

// Hook to use scores context
export const useScores = () => useContext(ScoresContext);
