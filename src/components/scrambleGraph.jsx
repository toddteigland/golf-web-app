import React from 'react';
import { Line } from 'react-chartjs-2';
import 'chart.js/auto';

const ScrambleGraph = ({ teamScores }) => {
  // Assuming teamScores is an object with team IDs as keys and their scores as values
  // Example teamScores: { '1': { '1': { strokes: 4, drive_used: 'Tyson' }, ... }, ... }
  console.log('TeamScores in Graph:', teamScores);
  // Prepare data for each team
  const holePars = [4, 5, 3, 4, 4, 4, 5, 3, 4, 5, 3, 4, 4, 4, 3, 4, 5, 4]; // Update this array based on your course

    // Prepare data for each team
    const teamsData = Object.keys(teamScores).map(teamId => {
      let cumulativeDiff = 0;
    const cumulativeScores = [];
    const driveUsed = [];

    for (let i = 0; i < 18; i++) {
      const holeData = teamScores[teamId][i + 1];
      if (holeData && holeData.strokes !== undefined) {
        cumulativeDiff += (holeData.strokes - holePars[i]);
        cumulativeScores.push(cumulativeDiff); // Push the cumulative score so far
        driveUsed.push(holeData.drive_used); // Push the drive used for this hole
      } else {
        // If there's no score for this hole, push null to stop plotting from this point
        cumulativeScores.push(null);
        driveUsed.push(null);
      }
    }

    return { cumulativeScores, driveUsed };
  });

  // Colors for each team's line
  const teamColors = ['red', 'black', 'gold'];

  const data = {
    labels:  Array.from({ length: 18 }, (_, i) =>  `Hole: ${i + 1}`), // Holes 1-18
    datasets: teamsData.map((team, index) => ({
      label: `Team ${index + 1}`,
      data: team.cumulativeScores, // Replace with score relative to par
      borderColor: teamColors[index],
      backgroundColor: teamColors[index],
      pointRadius: 5,
      pointHoverRadius: 7,
      pointHitRadius: 10,
      pointStyle: 'circle',
      // tension: 0.1,
    })),
  };

  const options = {
    indexAxis: 'y',
    maintainAspectRatio: 'false',
    aspectRatio: .7,
    scales: {
      x: {
        beginAtZero: true,
        min: -15,
        max: 15,
      },
      y: {
        reverse: false,
      }
    },
    plugins: {
      tooltip: {
        callbacks: {
          label: function(context) {
            const teamIndex = context.datasetIndex;
            const holeIndex = context.dataIndex;
            const holePar = holePars[holeIndex];
            const holeScore = teamScores[teamIndex + 1][holeIndex + 1]?.strokes || 'N/A'; // Accessing individual hole score
            const driveUsed = teamsData[teamIndex].driveUsed[holeIndex];
            return `${context.dataset.label}: Par: ${holePar}, Score: ${holeScore}, Drive Used: ${driveUsed}`;
          },
        },
      },
    },
  };

  return (
  <div style={{ height: 'auto', width: '100%' }}>
    <Line data={data} options={options} />
    </div>
    );
};

export default ScrambleGraph;
