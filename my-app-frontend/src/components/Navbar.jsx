import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);

    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <header className={`navbar ${scrolled && !isMobile ? "scrolled" : ""} ${isMobile ? "mobile" : ""}`}>
      <div className="navbar-container">
        <div className="navbar-logo">
          <Link to="/">GYM</Link> 
        </div>

        <nav className={`navbar-nav ${menuOpen ? "menu-open" : ""}`}>
          <Link to="/rankings" className="nav-item">Rankings</Link>
          <Link to="/community" className="nav-item">Community</Link>
          <Link to="/progress" className="nav-item">Progress</Link>
        </nav>

        <div className="navbar-auth">
          <Link to="/signin" className="nav-item">Sign In</Link>
          <Link to="/signup" className="nav-item">Sign Up</Link>
        </div>

        <button className="navbar-menu-button" onClick={() => setMenuOpen(!menuOpen)}>
          &#9776;
        </button>
      </div>
    </header>
  );
}

export default Navbar;