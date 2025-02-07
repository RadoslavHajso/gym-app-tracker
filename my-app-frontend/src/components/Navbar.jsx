import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UiUserProfile } from "./UiUserProfile";
import "./Navbar.css";

function Navbar({ isLoggedIn, user, handleLogout }) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 890);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const menuRef = useRef(null);
  const profileRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);

    const handleResize = () => setIsMobile(window.innerWidth <= 890);
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target) && !event.target.closest(".navbar-menu-button")) {
        setMenuOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setProfileOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogoutClick = () => {
    handleLogout(); 
    setProfileOpen(false);
    setShowLogoutModal(true);

    setTimeout(() => {
      setShowLogoutModal(false);
      navigate("/"); 
    }, 2000);
  };

  return (
    <>
      <header className={`navbar ${scrolled ? "scrolled" : ""}`}>
        <div className="navbar-container">
          <div className="navbar-logo">
            <Link to="/">GYM</Link>
          </div>

          <nav ref={menuRef} className={`navbar-nav ${menuOpen ? "menu-open" : ""}`}>
            <Link to="/rankings" className="nav-item" onClick={() => setMenuOpen(false)}>
              Rankings
            </Link>
            <Link to="/community" className="nav-item" onClick={() => setMenuOpen(false)}>
              Community
            </Link>
            <Link to="/progress" className="nav-item" onClick={() => setMenuOpen(false)}>
              Progress
            </Link>
          </nav>

          <div className="navbar-auth">
            {isLoggedIn ? (
              <div ref={profileRef} className="profile-container">
                <img
                  src={user?.profile_pic || "https://banner2.cleanpng.com/20190122/uyw/kisspng-portable-network-graphics-computer-icons-scalable-font-user-svg-png-icon-free-download-415641-5c46e5fb68a330.1185793715481502674286.jpg"}
                  alt="Profile"
                  className="profile-icon"
                  onClick={() => setProfileOpen(!profileOpen)}
                />
                <div className={`profile-dropdown ${profileOpen ? "open" : ""}`}>
                  <Link to="/profile" className="nav-item" onClick={() => setProfileOpen(false)}>
                    Profile
                  </Link>
                  <button className="nav-item logout-button" onClick={handleLogoutClick}>
                    Log Out
                  </button>
                </div>
              </div>
            ) : (
              isMobile ? (
                <div ref={profileRef} className="user-icon-container">
                  <UiUserProfile className="user-icon" onClick={() => setProfileOpen(!profileOpen)} />
                  <div className={`profile-dropdown guest-dropdown ${profileOpen ? "open" : ""}`}>
                    <Link to="/signin" className="nav-item" onClick={() => setProfileOpen(false)}>Sign In</Link>
                    <Link to="/signup" className="nav-item" onClick={() => setProfileOpen(false)}>Sign Up</Link>
                  </div>
                </div>
              ) : (
                <>
                  <Link to="/signin" className="nav-item">Sign In</Link>
                  <Link to="/signup" className="nav-item">Sign Up</Link>
                </>
              )
            )}
          </div>

          <button
            className="navbar-menu-button"
            onClick={(e) => {
              e.stopPropagation();
              setMenuOpen((prev) => !prev);
            }}
          >
            {menuOpen ? "✖" : "☰"}
          </button>
        </div>
      </header>

      {showLogoutModal && (
        <div className="logout-modal">
          <div className="logout-modal-content">
            <p>You have successfully logged out.</p>
            <p><span className="material-symbols-outlined">check</span></p>
          </div>
        </div>
      )}
    </>
  );
}

export default Navbar;