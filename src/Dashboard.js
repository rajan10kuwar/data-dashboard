import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Dashboard = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('https://api.weatherbit.io/v2.0/history/daily', {
          params: {
            key: process.env.REACT_APP_API_KEY,
            lat: '35.7721',
            lon: '-78.63861',
            start_date: '2022-09-25',
            end_date: '2022-10-09'
          }
        });
        setData(response.data.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  // Calculate summary statistics
  const totalItems = data.length;
  const averageTemp = data.reduce((sum, item) => sum + item.temp, 0) / totalItems;
  const tempRange = `${Math.min(...data.map(item => item.temp))}°F - ${Math.max(...data.map(item => item.temp))}°F`;

  return (
    <div>
      <h1>Data Dashboard</h1>
      <div>
        <p>Total Items: {totalItems}</p>
        <p>Average Temperature: {averageTemp.toFixed(1)}°F</p>
        <p>Temperature Range: {tempRange}</p>
      </div>
      <table>
        <thead>
          <tr>
            <th>Date</th>
            <th>Temperature (°F)</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <tr key={index}>
              <td>{item.datetime}</td>
              <td>{item.temp}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Dashboard;