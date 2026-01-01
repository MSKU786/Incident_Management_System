import './App.css';
import {Routes, Route, Navigate, useLocation} from 'react-router-dom';
import Navbar from './Component/Navbar';
import LoginPage from './Pages/LoginPage';
import ProtectedRoute from './Component/ProtectedRoute';
import IncidentPage from './Pages/IncidentPage';
import ProjectPage from './Pages/ProjectPage';
import {useAuth} from './contexts/AuthContext';

function Dashboard() {
  return (
    <div className="container mt-4">
      <h2>Dashboard</h2>
      <p>Welcome to the Incident Management Dashboard</p>
      {/* Add dashboard content here */}
    </div>
  );
}

function CreateProject() {
  return (
    <div className="container mt-4">
      <h2>Create Project</h2>
      {/* Add create project component here */}
    </div>
  );
}

function UsersManagement() {
  return (
    <div className="container mt-4">
      <h2>Users Management</h2>
      {/* Add users management component here */}
    </div>
  );
}

function UserProfile() {
  return (
    <div className="container mt-4">
      <h2>User Profile</h2>
      {/* Add profile component here */}
    </div>
  );
}

function App() {
  const {isAuthenticated, loading} = useAuth();
  const location = useLocation();

  // Show loading state while checking auth
  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div
          className="spinner-border text-primary"
          role="status"
        >
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  // Determine if current route requires authentication
  const isAuthRoute = location.pathname === '/login';
  const shouldShowNavbar = isAuthenticated() && !isAuthRoute;

  return (
    <div className="App">
      {/* Show Navbar when authenticated and not on login page */}
      {shouldShowNavbar && <Navbar />}

      <Routes>
        {/* Public Routes */}
        <Route
          path="/login"
          element={
            isAuthenticated() ? (
              <Navigate
                to="/dashboard"
                replace
              />
            ) : (
              <LoginPage />
            )
          }
        />

        {/* Protected Routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/incidents"
          element={
            <ProtectedRoute>
              <IncidentPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/projects"
          element={
            <ProtectedRoute>
              <ProjectPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/create-project"
          element={
            <ProtectedRoute>
              <CreateProject />
            </ProtectedRoute>
          }
        />

        <Route
          path="/users"
          element={
            <ProtectedRoute>
              <UsersManagement />
            </ProtectedRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <UserProfile />
            </ProtectedRoute>
          }
        />

        {/* Default redirect */}
        <Route
          path="/"
          element={
            <Navigate
              to={isAuthenticated() ? '/dashboard' : '/login'}
              replace
            />
          }
        />

        {/* 404 - redirect to dashboard or login */}
        <Route
          path="*"
          element={
            <Navigate
              to={isAuthenticated() ? '/dashboard' : '/login'}
              replace
            />
          }
        />
      </Routes>
    </div>
  );
}

export default App;
