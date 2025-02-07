import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import RankingsPage from './pages/RankingsPage';
import SignInPage from "./pages/SignInPage";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsLoggedIn(true);
      fetchUserData(token);
    }
  }, []);

  const fetchUserData = async (token) => {
    try {
      const response = await fetch("http://localhost:5000/api/users/me", {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });

      const data = await response.json();
      setUser(data);
    } catch (error) {
      console.log("Chyba pri načítaní dát používateľa:", error);
    }
  };

  const handleLogin = () => {
    setIsLoggedIn(true);
    const token = localStorage.getItem('token');
    if (token) {
      fetchUserData(token);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    setUser(null);
  };

  return (
    <Router>
      <Navbar
        isLoggedIn={isLoggedIn}
        user={user}
        handleLogout={handleLogout}
      />
      
      <div className="page-container">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/rankings" element={<RankingsPage />} />
          <Route path="/signin" element={<SignInPage onLogin={handleLogin} />}/>
        </Routes>
      </div>

      <Footer />
    </Router>
  );
}

export default App;

