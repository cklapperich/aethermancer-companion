import { ReactNode } from 'react';
import { Link } from 'react-router-dom';

interface Tab {
  id: string;
  label: string;
}

interface TabsProps {
  tabs: Tab[];
  activeTab: string;
  children: ReactNode;
}

// Map tab IDs to their route paths
function getTabPath(tabId: string): string {
  switch (tabId) {
    case 'run-stats': return '/run-stats';
    case 'chance-calc': return '/chance-calc';
    case 'synergy-finder':
    default: return '/';
  }
}

export function Tabs({ tabs, activeTab, children }: TabsProps) {
  return (
    <div className="min-h-screen">
      {/* Tab Navigation */}
      <div className="border-b border-gray-700 bg-gray-900/50">
        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-10">
          <nav className="flex gap-4" aria-label="Tabs">
            {tabs.map((tab) => (
              <Link
                key={tab.id}
                to={getTabPath(tab.id)}
                className={`py-3 px-4 font-alegreya text-lg border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-tier-maverick text-tier-maverick'
                    : 'border-transparent text-gray-400 hover:text-gray-200 hover:border-gray-500'
                }`}
                style={{ fontVariant: 'small-caps' }}
              >
                {tab.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>

      {/* Tab Content */}
      <div className="text-white">
        {children}
      </div>
    </div>
  );
}
