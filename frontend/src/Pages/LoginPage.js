import { useState } from 'react';
import { api } from '../Api/api';
import './LoginPage.css';

export default function LoginPage({ setToken, setPage }) {
  // Login state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [loginErrors, setLoginErrors] = useState({});

  // Signup state
  const [signupName, setSignupName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupConfirmPassword, setSignupConfirmPassword] = useState('');
  const [signupRole, setSignupRole] = useState('reporter');
  const [showSignupPassword, setShowSignupPassword] = useState(false);
  const [showSignupConfirmPassword, setShowSignupConfirmPassword] =
    useState(false);
  const [signupLoading, setSignupLoading] = useState(false);
  const [signupError, setSignupError] = useState('');
  const [signupErrors, setSignupErrors] = useState({});

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateLoginForm = () => {
    const newErrors = {};

    if (!email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setLoginErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateSignupForm = () => {
    const newErrors = {};

    if (!signupName.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!signupEmail.trim()) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(signupEmail)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!signupPassword) {
      newErrors.password = 'Password is required';
    } else if (signupPassword.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (!signupConfirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (signupPassword !== signupConfirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setSignupErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const login = async (e) => {
    e?.preventDefault();
    setLoginError('');
    setLoginErrors({});

    if (!validateLoginForm()) {
      return;
    }

    setLoginLoading(true);

    try {
      const res = await api.login(email, password);

      const { token, refreshToken, user } = res.data;

      // Store tokens securely
      localStorage.setItem('token', token);
      localStorage.setItem('refreshToken', refreshToken);
      if (user) {
        localStorage.setItem('user', JSON.stringify(user));
      }

      setToken(token);
      setPage('create');
    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        'Invalid credentials. Please try again.';
      setLoginError(errorMessage);
    } finally {
      setLoginLoading(false);
    }
  };

  const signup = async (e) => {
    e?.preventDefault();
    setSignupError('');
    setSignupErrors({});

    if (!validateSignupForm()) {
      return;
    }

    setSignupLoading(true);

    try {
      const res = await api.register(
        signupEmail,
        signupPassword,
        signupName,
        signupRole
      );

      const { token, refreshToken, user } = res.data;

      // Store tokens securely
      localStorage.setItem('token', token);
      localStorage.setItem('refreshToken', refreshToken);
      if (user) {
        localStorage.setItem('user', JSON.stringify(user));
      }

      setToken(token);
      setPage('create');
    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        'Registration failed. Please try again.';
      setSignupError(errorMessage);

      // Handle field-specific errors from backend
      if (err.response?.data?.errors) {
        setSignupErrors(err.response.data.errors);
      }
    } finally {
      setSignupLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-wrapper">
        {/* Login Form */}
        <div className="auth-card login-card">
          <h2 className="auth-title">Sign In</h2>
          <p className="auth-subtitle">
            Enter your credentials to access your account
          </p>

          {loginError && (
            <div
              className="error-message"
              role="alert"
            >
              {loginError}
            </div>
          )}

          <form
            onSubmit={login}
            className="auth-form"
          >
            <div className="form-group">
              <label
                htmlFor="login-email"
                className="form-label"
              >
                Email Address
              </label>
              <input
                id="login-email"
                type="email"
                className={`form-input ${
                  loginErrors.email ? 'form-input-error' : ''
                }`}
                placeholder="Enter your email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (loginErrors.email) {
                    setLoginErrors({ ...loginErrors, email: '' });
                  }
                }}
                disabled={loginLoading}
                autoComplete="email"
              />
              {loginErrors.email && (
                <span className="error-text">{loginErrors.email}</span>
              )}
            </div>

            <div className="form-group">
              <label
                htmlFor="login-password"
                className="form-label"
              >
                Password
              </label>
              <div className="password-input-wrapper">
                <input
                  id="login-password"
                  type={showPassword ? 'text' : 'password'}
                  className={`form-input ${
                    loginErrors.password ? 'form-input-error' : ''
                  }`}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (loginErrors.password) {
                      setLoginErrors({ ...loginErrors, password: '' });
                    }
                  }}
                  disabled={loginLoading}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? '👁️' : '👁️‍🗨️'}
                </button>
              </div>
              {loginErrors.password && (
                <span className="error-text">{loginErrors.password}</span>
              )}
            </div>

            <button
              type="submit"
              className="auth-button"
              disabled={loginLoading}
            >
              {loginLoading ? (
                <>
                  <span className="spinner"></span>
                  Signing in...
                </>
              ) : (
                'Sign In'
              )}
            </button>
          </form>
        </div>

        {/* Signup Form */}
        <div className="auth-card signup-card">
          <h2 className="auth-title">Sign Up</h2>
          <p className="auth-subtitle">Create a new account to get started</p>

          {signupError && (
            <div
              className="error-message"
              role="alert"
            >
              {signupError}
            </div>
          )}

          <form
            onSubmit={signup}
            className="auth-form"
          >
            <div className="form-group">
              <label
                htmlFor="signup-name"
                className="form-label"
              >
                Full Name
              </label>
              <input
                id="signup-name"
                type="text"
                className={`form-input ${
                  signupErrors.name ? 'form-input-error' : ''
                }`}
                placeholder="Enter your full name"
                value={signupName}
                onChange={(e) => {
                  setSignupName(e.target.value);
                  if (signupErrors.name) {
                    setSignupErrors({ ...signupErrors, name: '' });
                  }
                }}
                disabled={signupLoading}
                autoComplete="name"
              />
              {signupErrors.name && (
                <span className="error-text">{signupErrors.name}</span>
              )}
            </div>

            <div className="form-group">
              <label
                htmlFor="signup-email"
                className="form-label"
              >
                Email Address
              </label>
              <input
                id="signup-email"
                type="email"
                className={`form-input ${
                  signupErrors.email ? 'form-input-error' : ''
                }`}
                placeholder="Enter your email"
                value={signupEmail}
                onChange={(e) => {
                  setSignupEmail(e.target.value);
                  if (signupErrors.email) {
                    setSignupErrors({ ...signupErrors, email: '' });
                  }
                }}
                disabled={signupLoading}
                autoComplete="email"
              />
              {signupErrors.email && (
                <span className="error-text">{signupErrors.email}</span>
              )}
            </div>

            <div className="form-group">
              <label
                htmlFor="signup-password"
                className="form-label"
              >
                Password
              </label>
              <div className="password-input-wrapper">
                <input
                  id="signup-password"
                  type={showSignupPassword ? 'text' : 'password'}
                  className={`form-input ${
                    signupErrors.password ? 'form-input-error' : ''
                  }`}
                  placeholder="Enter your password"
                  value={signupPassword}
                  onChange={(e) => {
                    setSignupPassword(e.target.value);
                    if (signupErrors.password) {
                      setSignupErrors({ ...signupErrors, password: '' });
                    }
                  }}
                  disabled={signupLoading}
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowSignupPassword(!showSignupPassword)}
                  aria-label={
                    showSignupPassword ? 'Hide password' : 'Show password'
                  }
                >
                  {showSignupPassword ? '👁️' : '👁️‍🗨️'}
                </button>
              </div>
              {signupErrors.password && (
                <span className="error-text">{signupErrors.password}</span>
              )}
            </div>

            <div className="form-group">
              <label
                htmlFor="signup-confirm-password"
                className="form-label"
              >
                Confirm Password
              </label>
              <div className="password-input-wrapper">
                <input
                  id="signup-confirm-password"
                  type={showSignupConfirmPassword ? 'text' : 'password'}
                  className={`form-input ${
                    signupErrors.confirmPassword ? 'form-input-error' : ''
                  }`}
                  placeholder="Confirm your password"
                  value={signupConfirmPassword}
                  onChange={(e) => {
                    setSignupConfirmPassword(e.target.value);
                    if (signupErrors.confirmPassword) {
                      setSignupErrors({ ...signupErrors, confirmPassword: '' });
                    }
                  }}
                  disabled={signupLoading}
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() =>
                    setShowSignupConfirmPassword(!showSignupConfirmPassword)
                  }
                  aria-label={
                    showSignupConfirmPassword
                      ? 'Hide password'
                      : 'Show password'
                  }
                >
                  {showSignupConfirmPassword ? '👁️' : '👁️‍🗨️'}
                </button>
              </div>
              {signupErrors.confirmPassword && (
                <span className="error-text">
                  {signupErrors.confirmPassword}
                </span>
              )}
            </div>

            <div className="form-group">
              <label
                htmlFor="signup-role"
                className="form-label"
              >
                Role
              </label>
              <select
                id="signup-role"
                className="form-input"
                value={signupRole}
                onChange={(e) => setSignupRole(e.target.value)}
                disabled={signupLoading}
              >
                <option value="reporter">Reporter</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            <button
              type="submit"
              className="auth-button signup-button"
              disabled={signupLoading}
            >
              {signupLoading ? (
                <>
                  <span className="spinner"></span>
                  Creating account...
                </>
              ) : (
                'Sign Up'
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
