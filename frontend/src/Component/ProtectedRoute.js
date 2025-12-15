import React from 'react';
import {isAuthenticated} from '../utility/auth';

export default function ProtectedRoute({children, token, setPage}) {
  if (!isAuthenticated() || !token) {
  }
}
