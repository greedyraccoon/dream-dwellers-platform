import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Navbar() {
  const navigate = useNavigate();
  const hasToken = !!localStorage.getItem('token');

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <nav className="bg-gray-900 p-4 text-white flex justify-between items-center shadow-lg text-left">
      <div className="font-bold text-lg tracking-wider text-purple-400">
        <Link to="/properties">Dream Dwellers</Link>
      </div>
      <div className="space-x-6 mountaineer text-sm font-medium flex items-center">
        <Link to="/login" className="hover:text-purple-400 transition">Auth Token</Link>
        <Link to="/properties" className="hover:text-purple-400 transition">Dashboard</Link>
        <Link to="/properties/add" className="hover:text-purple-400 transition">+ Add Property</Link>
        
        {hasToken && (
          <button 
            onClick={handleLogout} 
            className="ml-2 bg-red-600/80 hover:bg-red-600 px-3 py-1 rounded text-xs font-semibold transition"
          >
            Logout
          </button>
        )}
      </div>
    </nav>
  );
}