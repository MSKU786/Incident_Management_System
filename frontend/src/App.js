import logo from './logo.svg';
import './App.css';
import Navbar from './Component/navbar';
import LoginPage from './Pages/LoginPage';
import { useState } from 'react';

function App() {
  const [page, setPage] = useState('login');
  const [token, setToken] = useState(localStorage.getItem('token'));
  return (
    <div className="App">
      <h2>Incidnet Manager</h2>
      <Navbar
        setPage={setPage}
        token={token}
      />
      {page === 'login' && (
        <LoginPage
          setToken={setToken}
          setPage={setPage}
        />
      )}
    </div>
  );
}

export default App;
