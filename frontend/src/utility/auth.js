export const getUser = () => {
  const userStr = localStorage.getItem('user');
  if (!userStr) {
    return null;
  }

  try {
    return JSON.parse(userStr);
  } catch (err) {
    return null;
  }
};

export const getUserRole = () => {
  const user = getUser();
  return user?.role || null;
};

export const getUserName = () => {
  const user = getUser();
  return user?.name || user?.email || 'User';
};

export const hasRole = (...roles) => {
  const userRole = getUserRole();
  return userRole && roles.includes(userRole);
};

export const isAdmin = () => hasRole('admin');
export const isManager = () => hasRole('manager');
export const isReporter = () => hasRole('reporter');
export const isAdminOrManager = () => hasRole('admin', 'manager');

export const isAuthenticated = () => {
  return !!localStorage.getItem('token');
};

export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('refreshToken');
  localStorage.removeItem('user');
};
