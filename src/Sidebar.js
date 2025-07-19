import React from 'react';
import { Link } from 'react-router-dom';

const Sidebar = () => {
  const handleLinkClick = (e) => {
    // Navigate to dashboard and reload only if not already on dashboard
    if (window.location.pathname !== '/') {
      window.location.href = '/'; // Force navigation to dashboard
    } else {
      window.location.reload(); // Reload if already on dashboard
    }
  };

  return (
    <div style={{ width: '200px', background: 'rgba(0, 0, 0, 0.7)', padding: '20px', position: 'fixed', height: '100%' }}>
      <h3>AstroDash</h3>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        <li><Link to="/" onClick={handleLinkClick} style={{ color: '#ffcc00', textDecoration: 'none' }}>Dashboard</Link></li>
        <li><Link to="/" onClick={handleLinkClick} style={{ color: '#ffcc00', textDecoration: 'none' }}>Search</Link></li>
        <li><Link to="/" onClick={handleLinkClick} style={{ color: '#ffcc00', textDecoration: 'none' }}>About</Link></li>
      </ul>
    </div>
  );
};

export default Sidebar;