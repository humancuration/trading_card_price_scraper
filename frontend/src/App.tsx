import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import InputRows from './Components/InputRows';
import ResultsPage from './Components/ResultsPage';
import AboutMe from './Components/AboutMe';
import DarkMode from './Components/DarkMode';

const App: React.FC = () => {
  return (
    <Router>
      <DarkMode />
      
      <nav>
        <Link to="/">
          <button className="nav-button">Home</button>
        </Link>
        <Link to="/about">
          <button className="nav-button" style={{margin: '10px 10px'}}>About Me</button>
        </Link>
      </nav>
      
      <Routes>
        <Route path="/" element={<InputRows />} />
        <Route path="/results" element={<ResultsPage />} />
        <Route path="/about" element={<AboutMe />} />
      </Routes>
    </Router>
  );
};

export default App;
