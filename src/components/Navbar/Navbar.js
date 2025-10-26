
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaBars, FaUser, FaShoppingBag } from 'react-icons/fa';
import logo from '../../logo.svg';
import './Navbar.css';
import SideDrawer from '../SideDrawer/SideDrawer';
import Backdrop from '../Backdrop/Backdrop';

const Navbar = ({ cartItemCount }) => {
  const [sideDrawerOpen, setSideDrawerOpen] = useState(false);

  const drawerToggleClickHandler = () => {
    setSideDrawerOpen((prevState) => !prevState);
  };

  const backdropClickHandler = () => {
    setSideDrawerOpen(false);
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          <img src={logo} alt="Rincon Creativo" className="navbar-icon" />
          Rincon Creativo
        </Link>
        <div className="menu-icon" onClick={drawerToggleClickHandler}>
          <FaBars />
        </div>
        <ul className="nav-menu">
          <li className="nav-item">
            <Link to="/" className="nav-links">
              Inicio
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/catalog" className="nav-links">
              Catálogo
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/login" className="nav-links">
              Login
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/signup" className="nav-links">
              Signup
            </Link>
          </li>
        </ul>
        <div className="nav-icons">
          <Link to="/cart" className="nav-icon-link">
            <FaShoppingBag />
            {cartItemCount > 0 && <span className="cart-badge">{cartItemCount}</span>}
          </Link>
          <Link to="/login" className="nav-icon-link">
            <FaUser />
          </Link>
        </div>
      </div>
      <SideDrawer show={sideDrawerOpen} click={backdropClickHandler} cartItemCount={cartItemCount} />
      {sideDrawerOpen && <Backdrop click={backdropClickHandler} />}
    </nav>
  );
};

export default Navbar;
