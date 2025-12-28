import { useEffect } from 'react';
import { Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { TeamBuilderPage } from './components/TeamBuilderPage';
import { RunStats } from './components/RunStats';
import { ChanceCalculator } from './components/ChanceCalculator';
import { Tabs } from './components/Tabs';
import './index.css';

const tabs = [
  { id: 'synergy-finder', label: 'Synergy Finder' },
  { id: 'run-stats', label: 'Run Stats' },
  { id: 'chance-calc', label: 'Chance Calculator' },
];

// Component to normalize URLs to lowercase for case-insensitive routing
function CaseInsensitiveRedirect() {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const lowerPath = location.pathname.toLowerCase();
    if (location.pathname !== lowerPath) {
      navigate(lowerPath + location.search + location.hash, { replace: true });
    }
  }, [location, navigate]);

  return null;
}

// Get active tab from current path
function getActiveTabFromPath(pathname: string): string {
  const lowerPath = pathname.toLowerCase();
  if (lowerPath.startsWith('/run-stats')) return 'run-stats';
  if (lowerPath.startsWith('/chance-calc')) return 'chance-calc';
  return 'synergy-finder';
}

function App() {
  const location = useLocation();
  const activeTab = getActiveTabFromPath(location.pathname);

  return (
    <>
      <CaseInsensitiveRedirect />
      <Tabs tabs={tabs} activeTab={activeTab}>
        <Routes>
          {/* Synergy Finder routes */}
          <Route path="/" element={<TeamBuilderPage />} />
          <Route path="/:monster1" element={<TeamBuilderPage />} />
          <Route path="/:monster1/:monster2" element={<TeamBuilderPage />} />
          <Route path="/:monster1/:monster2/:monster3" element={<TeamBuilderPage />} />

          {/* Run Stats route */}
          <Route path="/run-stats" element={<RunStats />} />

          {/* Chance Calculator route */}
          <Route path="/chance-calc" element={<ChanceCalculator />} />

          {/* Fallback redirect */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Tabs>
    </>
  );
}

export default App;
