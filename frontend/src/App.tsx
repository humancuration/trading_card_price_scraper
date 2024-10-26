import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import InputRows from './Components/InputRows';
import ResultsPage from './Components/ResultsPage';
import AboutMe from './Components/AboutMe';
import DarkMode from './Components/DarkMode';
import { ThemeProvider } from './theme/ThemeContext';
import AdminDashboard from './admin/AdminDashboard';
import { SoundProvider } from './interactions/SoundManager';

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <SoundProvider>
        <Router>
          <DarkMode />
          
          <nav>
            <Link to="/">
              <button className="nav-button">Home</button>
            </Link>
            <Link to="/about">
              <button className="nav-button" style={{margin: '10px 10px'}}>About Me</button>
            </Link>
            <Link to="/admin">
              <button className="nav-button">Admin Panel</button>
            </Link>
          </nav>
          
          <Routes>
            <Route path="/" element={<InputRows />} />
            <Route path="/results" element={<ResultsPage />} />
            <Route path="/about" element={<AboutMe />} />
            <Route path="/admin" element={<AdminDashboard />} />
          </Routes>
        </Router>
      </SoundProvider>
    </ThemeProvider>
  );
};

export default App;
