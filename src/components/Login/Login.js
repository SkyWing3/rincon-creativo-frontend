import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import './Login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      await login(email, password);
      alert('Login successful!');
      navigate('/profile');
    } catch (error) {
      let errorMessage = 'Login failed';
      if (error.response) {
        errorMessage += `: ${error.response.data.message || error.response.statusText}`;
      } else if (error.request) {
        errorMessage += ': No response from server';
      } else {
        errorMessage += `: ${error.message}`;
      }
      alert(errorMessage);
      setError(errorMessage);
    }
  };

  return (
    <div className="login-container">
      <div className="login-form">
        <h2>Iniciar Sesión</h2>
        {error && <p className="error">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Correo Electrónico</label>
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Contraseña</label>
            <input
              type="password"
              id="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="login-btn">Iniciar Sesión</button>
        </form>
        <p className="signup-link">
          ¿No tienes una cuenta? <a href="/signup">Regístrate</a>
        </p>
      </div>
    </div>
  );
};

export default Login;
