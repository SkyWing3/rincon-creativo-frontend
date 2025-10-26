import React from 'react';
import './Login.css';

const Login = () => {
  return (
    <div className="login-container">
      <div className="login-form">
        <h2>Iniciar Sesión</h2>
        <form>
          <div className="form-group">
            <label htmlFor="email">Correo Electrónico</label>
            <input type="email" id="email" name="email" required />
          </div>
          <div className="form-group">
            <label htmlFor="password">Contraseña</label>
            <input type="password" id="password" name="password" required />
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
