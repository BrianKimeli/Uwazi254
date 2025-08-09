import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { IssueProvider } from './contexts/IssueContext';
import Navbar from './components/layout/Navbar';
import MobileNavigation from './components/layout/MobileNavigation';
import HomePage from './pages/HomePage';
import ReportIssuePage from './pages/ReportIssuePage';
import IssuesPage from './pages/IssuesPage';
import AnalyticsPage from './pages/AnalyticsPage';
import AdminDashboard from './pages/AdminDashboard';
import LoginPage from './pages/LoginPage';
import ProfilePage from './pages/ProfilePage';
import LoadingSpinner from './components/ui/LoadingSpinner';
import RegisterPage from './pages/RegisterPage';
import ChatbotWidget from './components/chatbot/ChatbotWidget';

const AppContent: React.FC = () => {
  const { user, loading } = useAuth();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {!user ? (
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      ) : (
        <>
          {!isMobile && <Navbar />}
          <main className={`${!isMobile ? 'pt-16' : ''} ${isMobile ? 'pb-20' : ''}`}>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/report" element={<ReportIssuePage />} />
              <Route path="/issues" element={<IssuesPage />} />
              <Route path="/analytics" element={<AnalyticsPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/chatbot" element={<ChatbotWidget />} />
              {user.role === 'admin' && (
                <Route path="/admin" element={<AdminDashboard />} />
              )}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
          {isMobile && <MobileNavigation />}
        </>
      )}
    </div>
  );
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <IssueProvider>
          <AppContent />
        </IssueProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;