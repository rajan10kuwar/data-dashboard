import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Dashboard = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cityName, setCityName] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('https://api.weatherbit.io/v2.0/forecast/daily', {
          params: {
            key: process.env.REACT_APP_API_KEY,
            lat: '35.7721',      // Raleigh, NC
            lon: '-78.63861',
            days: 15,
            units: 'I'
          }
        });
        setData(response.data.data);
        setCityName(response.data.city_name || 'Unknown City');
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

  // Filter data based on search query
  const filteredData = data.filter(item =>
    item.datetime.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div>
      <h1>{cityName} Data Dashboard</h1>
      <div>
        <input
          type="text"
          placeholder="Search by Date"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{ padding: '8px', marginBottom: '10px', width: '200px' }}
        />
      </div>
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
          {filteredData.map((item, index) => (
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