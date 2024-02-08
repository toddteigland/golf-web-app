import React, { useEffect, useState } from 'react';
import { useFetcher } from 'react-router-dom';

export default function HistoricalTable({fetchYear}) {
  const [historicalData, setHistoricalData] = useState();
  useEffect(() => {
    const fetchHistoricalScores = async() => {
      
      try{
        const response = await fetch (`http://localhost:3000/getHistoricalScores?fetchYear=${fetchYear}`);
        const data = await response.json();
        // console.log('Historical Scores::', data);
        setHistoricalData(data);
      }catch (error) {
        console.error('There was an error fetching historical scores', error)
      }
    };
    fetchHistoricalScores();
  }, [])


  return (
  
    <div className="table">
      <table>

        <thead>
          <tr>
            <th>Name</th>
            <th>Round 1</th>
            <th>Round 2</th>
            <th>Total</th>
            <th>Net</th>   
          </tr>
        </thead>

        <tbody>
          {historicalData
            ?.map((data) => ({
              ...data,
              totalScore: data.round1score + data.round2score, // calculate totalScore
              netScore: data.round1score + data.round2score - data.round1handicap - data.round2handicap, // calculate netScore
            }))
            .sort((a, b) => a.netScore - b.netScore) // sort by totalScore
            .map((data) => (
              <tr key={data.user_id}>
                <td>{data.first_name} {data.last_name} ({data.handicap})</td>
                <td style={{ textAlign: 'center'}}>{data.round1score}</td>
                <td style={{ textAlign: 'center'}}>{data.round2score}</td>
                <td>{data.totalScore}</td>
                <td>{data.netScore}</td>
              </tr>
            ))}
        </tbody>


      </table>
    </div>
  
  )

}