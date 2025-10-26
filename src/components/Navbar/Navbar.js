
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaBars, FaTimes, FaUser, FaShoppingBag } from 'react-icons/fa';
import logo from '../../logo.svg';
import './Navbar.css';

const Navbar = () => {
  const [click, setClick] = useState(false);

  const handleClick = () => setClick(!click);
  const closeMobileMenu = () => setClick(false);

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo" onClick={closeMobileMenu}>
          <img src={logo} alt="Rincon Creativo" className="navbar-icon" />
          Rincon Creativo
        </Link>
        <div className="menu-icon" onClick={handleClick}>
          {click ? <FaTimes /> : <FaBars />}
        </div>
        <ul className={click ? 'nav-menu active' : 'nav-menu'}>
          <li className="nav-item">
            <Link to="/" className="nav-links" onClick={closeMobileMenu}>
              Inicio
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/catalog" className="nav-links" onClick={closeMobileMenu}>
              Catálogo
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/about" className="nav-links" onClick={closeMobileMenu}>
              Sobre Nosotros
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/contact" className="nav-links" onClick={closeMobileMenu}>
              Contacto
            </Link>
          </li>
        </ul>
        <div className="nav-icons">
          <Link to="/cart" className="nav-icon-link">
            <FaShoppingBag />
          </Link>
          <Link to="/profile" className="nav-icon-link">
            <FaUser />
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
