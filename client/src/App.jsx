import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import ErrorPage from './pages/ErrorPage';
import AdminDashboard from './pages/AdminDashboard';
import UserDashboard from './pages/UserDashboard';
import Profile from './components/Profile';
import ProtectedRoute from './utils/ProtectedRoute';

function App() {
  const isAuthenticated = !!localStorage.getItem('token');
  const isAdmin = localStorage.getItem('role') === 'admin';

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = '/login';
  };

  return (
    <Router>
    {
      isAuthenticated && <Navbar isAdmin={isAdmin} onLogout={handleLogout} />
    }
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/profile"
          element={<ProtectedRoute isAuthenticated={isAuthenticated} element={<Profile />} />}
        />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated && isAdmin} element={<AdminDashboard />} />
          }
        />
        <Route
          path="/"
          element={<ProtectedRoute isAuthenticated={isAuthenticated && !isAdmin} element={<UserDashboard />} />}
        />
        <Route path="*" element={<ErrorPage />} />
      </Routes>
    </Router>
  );
}

export default App;
