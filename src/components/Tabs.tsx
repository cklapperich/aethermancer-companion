import { ReactNode } from 'react';

interface Tab {
  id: string;
  label: string;
}

interface TabsProps {
  tabs: Tab[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
  children: ReactNode;
}

export function Tabs({ tabs, activeTab, onTabChange, children }: TabsProps) {
  return (
    <div className="min-h-screen">
      {/* Tab Navigation */}
      <div className="border-b border-gray-700 bg-gray-900/50">
        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-10">
          <nav className="flex gap-4" aria-label="Tabs">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`py-3 px-4 font-alegreya text-lg border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-tier-maverick text-tier-maverick'
                    : 'border-transparent text-gray-400 hover:text-gray-200 hover:border-gray-500'
                }`}
                style={{ fontVariant: 'small-caps' }}
              >
                {tab.label}
              </button>
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
