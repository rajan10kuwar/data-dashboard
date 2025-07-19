import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Sidebar from './Sidebar';
import { Line, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const Dashboard = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cityName, setCityName] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [tempFilter, setTempFilter] = useState('');
  const [tempRange, setTempRange] = useState([40, 100]);
  const [showCharts, setShowCharts] = useState(true); // Toggle visibility
  const [chartType, setChartType] = useState('temperature'); // Toggle between chart types

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

  const totalItems = data.length;
  const averageTemp = data.reduce((sum, item) => sum + item.temp, 0) / totalItems;
  const tempRangeStats = `${Math.min(...data.map(item => item.temp))}°F - ${Math.max(...data.map(item => item.temp))}°F`;

  const filteredData = data.filter(item =>
    item.datetime.toLowerCase().includes(searchQuery.toLowerCase()) &&
    (tempFilter === '' || 
     (tempFilter === 'warm' && item.temp >= 70) ||
     (tempFilter === 'cool' && item.temp < 70)) &&
    item.temp >= tempRange[0] && item.temp <= tempRange[1]
  );

  // Chart Data for Temperature Trend
  const tempChartData = {
    labels: filteredData.map(item => item.datetime),
    datasets: [{
      label: 'Temperature (°F)',
      data: filteredData.map(item => item.temp),
      borderColor: '#ffcc00',
      backgroundColor: 'rgba(255, 204, 0, 0.2)',
      fill: true,
      tension: 0.4,
    }],
  };

  const tempChartOptions = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      title: { display: true, text: 'Temperature Trend Over 15 Days' },
    },
  };

  // Chart Data for Humidity Levels
  const humidityChartData = {
    labels: filteredData.map(item => item.datetime),
    datasets: [{
      label: 'Humidity (%)',
      data: filteredData.map(item => item.rh),
      backgroundColor: 'rgba(0, 191, 255, 0.6)',
      borderColor: 'rgba(0, 191, 255, 1)',
      borderWidth: 1,
    }],
  };

  const humidityChartOptions = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      title: { display: true, text: 'Humidity Levels Over 15 Days' },
    },
    scales: {
      y: { beginAtZero: true, max: 100 },
    },
  };

  return (
    <div>
      <Sidebar />
      <div style={{ marginLeft: '220px' }}>
        <h1>{cityName} Data Dashboard</h1>
        <div>
          <input
            type="text"
            placeholder="Search by Date"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ padding: '8px', marginBottom: '10px', width: '200px' }}
          />
          <select
            value={tempFilter}
            onChange={(e) => setTempFilter(e.target.value)}
            style={{ padding: '8px', marginLeft: '10px', width: '150px' }}
          >
            <option value="">All Temperatures</option>
            <option value="warm">Warm (70°F+)</option>
            <option value="cool">Cool (70°F)</option>
          </select>
          <div style={{ marginLeft: '10px', display: 'inline-block' }}>
            <label>Temperature Range: {tempRange[0]}°F - {tempRange[1]}°F</label>
            <input
              type="range"
              min="40"
              max="100"
              value={tempRange[0]}
              onChange={(e) => setTempRange([parseInt(e.target.value), tempRange[1]])}
              style={{ width: '100px', margin: '0 10px' }}
            />
            <input
              type="range"
              min="40"
              max="100"
              value={tempRange[1]}
              onChange={(e) => setTempRange([tempRange[0], parseInt(e.target.value)])}
              style={{ width: '100px' }}
            />
          </div>
        </div>
        <div>
          <p>Total Items: {totalItems}</p>
          <p>Average Temperature: {averageTemp.toFixed(1)}°F</p>
          <p>Temperature Range: {tempRangeStats}</p>
        </div>
        <div style={{ marginTop: '20px' }}>
          <button
            onClick={() => {
              setShowCharts(!showCharts);
              if (!showCharts) setChartType(chartType === 'temperature' ? 'humidity' : 'temperature');
            }}
            style={{ padding: '8px 16px', background: '#ffcc00', color: '#1a0033', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
          >
            {showCharts ? 'Hide Charts' : 'Show Charts'}
          </button>
          {showCharts && (
            chartType === 'temperature' ? (
              <Line data={tempChartData} options={tempChartOptions} />
            ) : (
              <Bar data={humidityChartData} options={humidityChartOptions} />
            )
          )}
        </div>
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Temperature (°F)</th>
              <th>Details</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((item, index) => (
              <tr key={index}>
                <td>{item.datetime}</td>
                <td>{item.temp}</td>
                <td><Link to={`/detail/${item.datetime}`} style={{ color: '#ffcc00', textDecoration: 'none' }}>🔗</Link></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Dashboard;