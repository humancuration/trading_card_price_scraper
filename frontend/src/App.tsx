import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './Components/Navigation/Navbar';
import InputRows from './Components/InputRows';
import ResultsPage from './Components/ResultsPage';
import AboutMe from './Components/AboutMe';
import UserDashboard from './Components/UserDashboard/UserDashboard';
import PackSimulator from './Components/PackOpening/PackSimulator';
import PackValueAnalytics from './Components/Educational/PackValueAnalytics';
import ShopPurchaseTracker from './Components/ShopTracker/ShopPurchaseTracker';
import AdminDashboard from './admin/AdminDashboard';
import { ThemeProvider } from './theme/ThemeContext';
import { SoundProvider } from './interactions/SoundManager';
import EnhancedPageTransition from './Components/transitions/EnhancedPageTransition';

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <SoundProvider>
        <Router>
          <Navbar />
          <EnhancedPageTransition>
            <Routes>
              <Route path="/" element={<InputRows />} />
              <Route path="/results" element={<ResultsPage />} />
              <Route path="/dashboard" element={<UserDashboard />} />
              <Route path="/pack-simulator" element={<PackSimulator />} />
              <Route path="/shop-tracker" element={<ShopPurchaseTracker />} />
              <Route path="/analytics" element={<PackValueAnalytics setData="default" />} />
              <Route path="/about" element={<AboutMe />} />
              <Route path="/admin" element={<AdminDashboard />} />
            </Routes>
          </EnhancedPageTransition>
        </Router>
      </SoundProvider>
    </ThemeProvider>
  );
};

export default App;
