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

  return (
    <div>
      <h1>Data Dashboard</h1>
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