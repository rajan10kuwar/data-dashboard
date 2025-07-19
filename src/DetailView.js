import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';
import Sidebar from './Sidebar';

const DetailView = () => {
  const { date } = useParams();
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetailData = async () => {
      try {
        const response = await axios.get('https://api.weatherbit.io/v2.0/forecast/daily', {
          params: {
            key: process.env.REACT_APP_API_KEY,
            lat: '35.7721',      // Raleigh, NC
            lon: '-78.63861',
            days: 10,
            units: 'I'
          }
        });
        const item = response.data.data.find(d => d.datetime === date);
        setDetails(item || { temp: 'N/A', weather: { description: 'No details available' }, rh: 'N/A', wind_spd: 'N/A' });
        setLoading(false);
      } catch (error) {
        console.error('Error fetching detail data:', error);
        setLoading(false);
      }
    };

    fetchDetailData();
  }, [date]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <Sidebar />
      <div style={{ padding: '20px', marginLeft: '220px' }}>
        <h2>{date}</h2>
        <p><strong>Temperature:</strong> {details.temp}°F</p>
        <Link to="/" style={{ color: '#ffcc00', textDecoration: 'none', display: 'block', marginTop: '10px' }}>🔗 Back to Dashboard</Link>
        <div style={{ marginTop: '20px' }}>
          <p><strong>Description:</strong> {details.weather.description}</p>
          <p><strong>Humidity:</strong> {details.rh}%</p>
          <p><strong>Wind Speed:</strong> {details.wind_spd} mph</p>
        </div>
      </div>
    </div>
  );
};

export default DetailView;