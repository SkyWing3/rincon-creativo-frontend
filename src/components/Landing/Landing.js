
import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import './Landing.css';

const Landing = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="landing-container"
    >
      <div className="landing-content">
        <div className="landing-text">
          <motion.h1
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          >
            Bienvenido a Rincón Creativo
          </motion.h1>
          <motion.p
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, ease: 'easeOut', delay: 0.2 }}
          >
            Auténtica artesanía Boliviana, hecha con el corazón.
          </motion.p>
          <Link to="/catalog">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="landing-button"
            >
              Explora Nuestro Catálogo
            </motion.button>
          </Link>
        </div>
        <div className="landing-image">
          <motion.img
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.8, ease: 'easeOut', delay: 0.4 }}
            src="https://www.conartesanos.com/wp-content/uploads/2020/07/1.jpg"
            alt="Artesanía Boliviana"
          />
        </div>
      </div>
    </motion.div>
  );
};

export default Landing;
