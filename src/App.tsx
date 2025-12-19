import { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { TeamBuilderPage } from './components/TeamBuilderPage';
import { RunStats } from './components/RunStats';
import { Tabs } from './components/Tabs';
import './index.css';

const tabs = [
  { id: 'synergy-finder', label: 'Synergy Finder' },
  { id: 'run-stats', label: 'Run Stats' },
];

function App() {
  const [activeTab, setActiveTab] = useState('synergy-finder');

  return (
    <Tabs tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab}>
      {activeTab === 'synergy-finder' && (
        <Routes>
          <Route path="/:monster1?/:monster2?/:monster3?" element={<TeamBuilderPage />} />
        </Routes>
      )}
      {activeTab === 'run-stats' && <RunStats />}
    </Tabs>
  );
}

export default App;
