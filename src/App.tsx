import { useMemo } from 'react';
import { SkillCard } from './components/SkillCard';
import { loadActions } from './utils/loadSkills';
import actionsData from '../data/actions.json';
import './index.css';

function App() {
  // Load and validate actions, then take 5 random for demo
  const sampleSkills = useMemo(() => {
    const allActions = loadActions(actionsData);
    // Shuffle and take 5 random actions
    const shuffled = [...allActions].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, 5);
  }, []);

  return (
    <div className="min-h-screen bg-wiki-bg bg-[url('https://aethermancer.wiki.gg/images/8/80/Site-background.jpg')] bg-top bg-cover bg-no-repeat bg-fixed text-white p-10 flex justify-center items-center">
      <div className="p-8">
        <div className="flex flex-wrap gap-5">
          {sampleSkills.map((skill) => (
            <SkillCard key={skill.name} skill={skill} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;
