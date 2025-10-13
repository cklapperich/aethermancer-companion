import { Routes, Route } from 'react-router-dom';
import { TeamBuilderPage } from './components/TeamBuilderPage';
import './index.css';

function App() {
  return (
    <Routes>
      <Route path="/:monster1?/:monster2?/:monster3?" element={<TeamBuilderPage />} />
    </Routes>
  );
}

export default App;
