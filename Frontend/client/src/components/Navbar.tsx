import { Link, useNavigate } from 'react-router-dom';

export default function Navbar() {
  const navigate = useNavigate();
  const hasToken = !!localStorage.getItem('token');

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <nav className="bg-gray-900 px-6 py-4 flex justify-between items-center shadow-lg">
      <Link to="/properties" className="font-bold text-lg tracking-wider text-purple-400">
        Dream Dwellers
      </Link>
      <div className="flex items-center space-x-6 text-sm font-medium text-white">
        {!hasToken ? (
          <Link to="/login" className="hover:text-purple-400 transition">Login</Link>
        ) : (
          <>
            <Link to="/properties/add" className="hover:text-purple-400 transition">+ Add Property</Link>
            <button
              onClick={handleLogout}
              className="bg-red-600/80 hover:bg-red-600 px-3 py-1 rounded text-xs font-semibold transition"
            >
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
}