import { Link } from 'react-router-dom';

const Navbar = ({ isAdmin, onLogout }) => {
  return (
    <nav className="bg-blue-500 p-4 text-white flex justify-between items-center">
      <h1 className="text-lg font-bold">Attendance Management</h1>
      <div className="space-x-4">
        {isAdmin && <Link to="/dashboard">Dashboard</Link>}
        <Link to="/profile">Profile</Link>
        <Link to="/" onClick={onLogout}>Logout</Link>
      </div>
    </nav>
  );
};

export default Navbar;
