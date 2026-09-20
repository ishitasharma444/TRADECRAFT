import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useGameStore } from './store/gameStore';
import { PublicLayout } from './components/PublicLayout';
import { AppLayout } from './components/AppLayout';

// Public Pages
import { LandingPage } from './pages/LandingPage';
import { AboutPage } from './pages/AboutPage';
import { HowItWorksPage } from './pages/HowItWorksPage';
import { LearnOverviewPage } from './pages/LearnOverviewPage';
import { LoginPage } from './pages/LoginPage';
import { SignupPage } from './pages/SignupPage';
import { ForgotPasswordPage } from './pages/ForgotPasswordPage';
import { PrivacyPage } from './pages/PrivacyPage';
import { TermsPage } from './pages/TermsPage';

// Isolated Dev Route
import { WorldTestPage } from './pages/dev/WorldTestPage';

// Authenticated Pages
import { AppIndexPage } from './pages/app/AppIndexPage';
import { WorldPage } from './pages/app/WorldPage';
import { MissionsPage } from './pages/app/MissionsPage';
import { MarketPage } from './pages/app/MarketPage';
import { PortfolioPage } from './pages/app/PortfolioPage';
import { LearningPage } from './pages/app/LearningPage';
import { SkillsPage } from './pages/app/SkillsPage';
import { MentorPage } from './pages/app/MentorPage';
import { PsychologyPage } from './pages/app/PsychologyPage';
import { ProfilePage } from './pages/app/ProfilePage';
import { SettingsPage } from './pages/app/SettingsPage';

function App() {
  const initializeGame = useGameStore((state) => state.initializeGame);

  useEffect(() => {
    initializeGame();
  }, [initializeGame]);

  return (
    <BrowserRouter>
      <Routes>
        {/* Isolated Dev Route for 3D Engine Failsafe Verification */}
        <Route path="/dev/world-test" element={<WorldTestPage />} />

        {/* Public Website Routes */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<LandingPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/how-it-works" element={<HowItWorksPage />} />
          <Route path="/learn" element={<LearnOverviewPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/privacy" element={<PrivacyPage />} />
          <Route path="/terms" element={<TermsPage />} />
        </Route>

        {/* Authenticated Application Command Center Routes */}
        <Route path="/app" element={<AppLayout />}>
          <Route index element={<AppIndexPage />} />
          <Route path="world" element={<WorldPage />} />
          <Route path="missions" element={<MissionsPage />} />
          <Route path="market" element={<MarketPage />} />
          <Route path="portfolio" element={<PortfolioPage />} />
          <Route path="learning" element={<LearningPage />} />
          <Route path="skills" element={<SkillsPage />} />
          <Route path="mentor" element={<MentorPage />} />
          <Route path="psychology" element={<PsychologyPage />} />
          <Route path="profile" element={<ProfilePage />} />
          <Route path="settings" element={<SettingsPage />} />
        </Route>

        {/* Fallback Redirect */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
