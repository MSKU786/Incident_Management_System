import logo from './logo.svg';
import './App.css';
import Navbar from './Component/navbar';
import LoginPage from './Pages/LoginPage';
import IncidentCreatePage from './Pages/IncidentCreatePage';
import ProtectedRoute from './Component/ProtectedRoute';
import IncidentPage from './Pages/IncidentPage';
import ProjectPage from './Pages/ProjectPage';
import {useState, useEffect} from 'react';
import {isAuthenticated} from './utils/auth';

function App() {
  const [page, setPage] = useState('login');
  const [token, setToken] = useState(localStorage.getItem('token'));

  // Check authentication on mount and redirect if needed
  useEffect(() => {
    if (isAuthenticated() && token) {
      // If authenticated but on login page, redirect to dashboard
      if (page === 'login') {
        setPage('dashboard');
      }
    } else {
      // If not authenticated, ensure we're on login page
      setPage('login');
    }
  }, [token]);

  const handleSetPage = (newPage) => {
    // Protect routes - if not authenticated, redirect to login
    if (!isAuthenticated() && newPage !== 'login') {
      setPage('login');
      return;
    }
    setPage(newPage);
  };

  return (
    <div className="App">
      <Navbar
        setPage={handleSetPage}
        token={token}
        setToken={setToken}
      />

      {/* Login Page - No protection needed */}
      {page === 'login' && (
        <LoginPage
          setToken={setToken}
          setPage={handleSetPage}
        />
      )}

      {/* Protected Routes */}
      {token && (
        <>
          {page === 'dashboard' && (
            <ProtectedRoute
              token={token}
              setPage={handleSetPage}
            >
              <div className="container mt-4">
                <h2>Dashboard</h2>
                <p>Welcome to the Incident Management Dashboard</p>
                {/* Add dashboard content here */}
              </div>
            </ProtectedRoute>
          )}

          {page === 'create' && (
            <ProtectedRoute
              token={token}
              setPage={handleSetPage}
            >
              <div className="container mt-4">
                <IncidentCreatePage token={token} />
              </div>
            </ProtectedRoute>
          )}

          {page === 'incidents' && (
            <ProtectedRoute
              token={token}
              setPage={handleSetPage}
            >
              <div className="container mt-4">
                <h2>Incidents List</h2>
                {/* Add incidents list component here */}
              </div>
            </ProtectedRoute>
          )}

          {page === 'projects' && (
            <ProtectedRoute
              token={token}
              setPage={handleSetPage}
            >
              <div className="container mt-4">
                <h2>Projects List</h2>
                <ProjectPage token={token} />
              </div>
            </ProtectedRoute>
          )}

          {page === 'create-project' && (
            <ProtectedRoute
              token={token}
              setPage={handleSetPage}
            >
              <div className="container mt-4">
                <h2>Create Project</h2>
                {/* Add create project component here */}
              </div>
            </ProtectedRoute>
          )}

          {page === 'users' && (
            <ProtectedRoute
              token={token}
              setPage={handleSetPage}
            >
              <div className="container mt-4">
                <h2>Users Management</h2>
                {/* Add users management component here */}
              </div>
            </ProtectedRoute>
          )}

          {page === 'profile' && (
            <ProtectedRoute
              token={token}
              setPage={handleSetPage}
            >
              <div className="container mt-4">
                <h2>User Profile</h2>
                {/* Add profile component here */}
              </div>
            </ProtectedRoute>
          )}

          {page === 'incidents' && (
            <ProtectedRoute
              token={token}
              setPage={handleSetPage}
            >
              <div className="container mt-4">
                <IncidentPage token={token} />
              </div>
            </ProtectedRoute>
          )}
        </>
      )}
    </div>
  );
}

export default App;
