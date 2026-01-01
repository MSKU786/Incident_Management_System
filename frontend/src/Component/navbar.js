import React from 'react';
import {useNavigate, useLocation} from 'react-router-dom';
import {
  getUserName,
  getUserRole,
  isAdmin,
  isAdminOrManager,
} from '../utility/auth';
import {useAuth} from '../contexts/AuthContext';

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const {logout} = useAuth();

  // Get user data safely
  const userRole = getUserRole() || 'User';
  const userName = getUserName() || 'User';
  const canManageProjects = isAdminOrManager();
  const canManageUsers = isAdmin();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const handleNavClick = (e, path) => {
    e.preventDefault();
    navigate(path);
  };

  // Helper to check if a route is active
  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark mb-4">
      <div className="container-fluid">
        <button
          className="navbar-brand btn btn-link text-white p-0"
          onClick={(e) => handleNavClick(e, '/dashboard')}
          style={{
            border: 'none',
            background: 'none',
            textDecoration: 'none',
            fontSize: '1.25rem',
            fontWeight: 'bold',
          }}
        >
          Incident Manager
        </button>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div
          className="collapse navbar-collapse"
          id="navbarNav"
        >
          <ul className="navbar-nav me-auto">
            {/* Dashboard - All authenticated users */}
            <li className="nav-item">
              <button
                className={`nav-link btn btn-link text-white ${
                  isActive('/dashboard') ? 'active' : ''
                }`}
                onClick={(e) => handleNavClick(e, '/dashboard')}
                style={{
                  border: 'none',
                  background: 'none',
                  textDecoration: 'none',
                }}
              >
                Dashboard
              </button>
            </li>

            {/* Incidents - All authenticated users */}
            <li className="nav-item">
              <button
                className={`nav-link btn btn-link text-white ${
                  isActive('/incidents') ? 'active' : ''
                }`}
                onClick={(e) => handleNavClick(e, '/incidents')}
                style={{
                  border: 'none',
                  background: 'none',
                  textDecoration: 'none',
                }}
              >
                Incidents
              </button>
            </li>

            {/* Projects - Admin and Manager only */}
            {canManageProjects && (
              <li className="nav-item">
                <button
                  className={`nav-link btn btn-link text-white ${
                    isActive('/projects') ? 'active' : ''
                  }`}
                  onClick={(e) => handleNavClick(e, '/projects')}
                  style={{
                    border: 'none',
                    background: 'none',
                    textDecoration: 'none',
                  }}
                >
                  Projects
                </button>
              </li>
            )}

            {/* Create Project - Admin and Manager only */}
            {canManageProjects && (
              <li className="nav-item">
                <button
                  className={`nav-link btn btn-link text-white ${
                    isActive('/create-project') ? 'active' : ''
                  }`}
                  onClick={(e) => handleNavClick(e, '/create-project')}
                  style={{
                    border: 'none',
                    background: 'none',
                    textDecoration: 'none',
                  }}
                >
                  Create Project
                </button>
              </li>
            )}

            {/* Users Management - Admin only */}
            {canManageUsers && (
              <li className="nav-item">
                <button
                  className={`nav-link btn btn-link text-white ${
                    isActive('/users') ? 'active' : ''
                  }`}
                  onClick={(e) => handleNavClick(e, '/users')}
                  style={{
                    border: 'none',
                    background: 'none',
                    textDecoration: 'none',
                  }}
                >
                  Users
                </button>
              </li>
            )}
          </ul>

          {/* User Info & Logout */}
          <ul className="navbar-nav">
            <li className="nav-item dropdown">
              <button
                className="nav-link dropdown-toggle btn btn-link text-white"
                id="navbarDropdown"
                type="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
                style={{border: 'none', background: 'none'}}
              >
                {userName} ({userRole})
              </button>
              <ul
                className="dropdown-menu dropdown-menu-end"
                aria-labelledby="navbarDropdown"
              >
                <li>
                  <button
                    className="dropdown-item"
                    onClick={(e) => handleNavClick(e, '/profile')}
                  >
                    Profile
                  </button>
                </li>
                <li>
                  <hr className="dropdown-divider" />
                </li>
                <li>
                  <button
                    className="dropdown-item text-danger"
                    onClick={handleLogout}
                  >
                    Logout
                  </button>
                </li>
              </ul>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}
