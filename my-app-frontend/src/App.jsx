import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';

function App() {
  return (
    <Router>
      <Navbar />
      
      <div className="page-container">
        <Routes>
          <Route path="/" element={<HomePage />} />
          {/*
          <Route path="/rankings" element={<RankingsPage />} />
          <Route path="/community" element={<CommunityPage />} />
          <Route path="/progress" element={<ProgressPage />} /> 
          */}
        </Routes>
      </div>

      <Footer />
    </Router>
  );
}

export default App;

