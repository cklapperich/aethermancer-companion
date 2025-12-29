import { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { ExternalLink } from 'lucide-react';

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
      {/* Site Header */}
      <div className="border-b border-gray-700 bg-gray-900/50">
        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-10 flex items-center">
          {/* Left side: stacked header info + tabs */}
          <div className="flex-1">
            {/* Unofficial/Steam line */}
            <div className="flex items-center gap-2 pt-2 text-sm text-gray-400">
              <span>Unofficial fan companion</span>
              <span>•</span>
              <a
                href="https://store.steampowered.com/app/2288470/Aethermancer/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-white transition-colors inline-flex items-center gap-1"
              >
                Get Aethermancer on Steam
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>

            {/* Tab Navigation */}
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

          {/* Right side: Tiberion */}
          <img
            src="/assets/TiberionIcon.webp"
            alt="Tiberion"
            className="w-16 h-16 md:w-20 md:h-20 flex-shrink-0"
          />
        </div>
      </div>

      {/* Tab Content */}
      <div className="text-white">
        {children}
      </div>
    </div>
  );
}
