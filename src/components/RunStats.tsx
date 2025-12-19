import { useState, useRef } from 'react';
import { SaveFile } from '../types/saveFile';
import { parseSaveFile } from '../utils/parseSaveFile';
import { StatsDisplay } from './StatsDisplay';

export function RunStats() {
  const [saveData, setSaveData] = useState<SaveFile | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const [showInstructions, setShowInstructions] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    setError(null);
    setIsLoading(true);

    try {
      const text = await file.text();
      const json = JSON.parse(text);
      const parsed = parseSaveFile(json);
      setSaveData(parsed);
      setShowInstructions(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to parse save file');
      setSaveData(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleClear = () => {
    setSaveData(null);
    setFileName(null);
    setError(null);
    setShowInstructions(true);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="min-h-screen text-white p-4 md:p-6 lg:p-10">
      <div className="max-w-5xl mx-auto w-full">
        <div className="text-center mb-8">
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-alegreya font-bold text-tier-maverick" style={{ fontVariant: 'small-caps' }}>
            Run Stats
          </h1>
          <h2 className="text-lg md:text-xl font-alegreya text-tier-basic" style={{ fontVariant: 'small-caps' }}>
            {saveData ? fileName : 'Upload your save file to view stats'}
          </h2>
        </div>
        <hr className="border-tier-basic mb-8" />

        {/* Upload Section */}
        <div className="mb-8">
          <div className="flex flex-wrap items-center justify-center gap-4">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept=".game"
              className="hidden"
            />
            <button
              onClick={handleUploadClick}
              disabled={isLoading}
              className="px-6 py-3 bg-gray-700 hover:bg-gray-600 disabled:bg-gray-600 text-white font-alegreya text-lg rounded-lg transition-colors"
              style={{ fontVariant: 'small-caps' }}
            >
              {isLoading ? 'Loading...' : saveData ? 'Upload Different File' : 'Upload Save File'}
            </button>
            {saveData && (
              <button
                onClick={handleClear}
                className="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white font-alegreya text-lg rounded-lg transition-colors"
                style={{ fontVariant: 'small-caps' }}
              >
                Clear
              </button>
            )}
          </div>

          {error && (
            <div className="mt-4 p-4 bg-red-900/50 border border-red-700 rounded-lg text-center">
              <p className="text-red-400 font-figtree">{error}</p>
            </div>
          )}
        </div>

        {/* Stats Display */}
        {saveData && <StatsDisplay saveFile={saveData} />}

        {/* Instructions Section (collapsible) */}
        {!saveData && (
          <div className="mt-8">
            <button
              onClick={() => setShowInstructions(!showInstructions)}
              className="flex items-center gap-2 text-tier-basic hover:text-tier-maverick transition-colors mb-4"
            >
              <svg
                className={`w-5 h-5 transition-transform ${showInstructions ? 'rotate-90' : ''}`}
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M9 5l7 7-7 7V5z" />
              </svg>
              <span className="font-alegreya text-lg" style={{ fontVariant: 'small-caps' }}>
                How to find your save files
              </span>
            </button>

            {showInstructions && (
              <div className="bg-gray-800/50 rounded-lg p-6 md:p-8">
                <p className="text-gray-300 font-figtree mb-4">
                  Steam stores cloud-synced save files in the <code className="bg-gray-700 px-1.5 py-0.5 rounded text-tier-basic">userdata</code> folder. The location varies by operating system:
                </p>

                {/* OS Paths */}
                <div className="space-y-4 mb-6">
                  <div>
                    <h4 className="text-tier-basic font-alegreya font-semibold mb-2">Windows</h4>
                    <ol className="text-gray-400 font-figtree text-sm list-decimal list-inside space-y-1 mb-2">
                      <li>Press <code className="bg-gray-700 px-1 rounded text-tier-basic">Win + R</code> to open the Run dialog</li>
                      <li>Paste the path below and press Enter</li>
                    </ol>
                    <code className="block bg-gray-900 p-3 rounded text-sm font-mono text-gray-300 overflow-x-auto">
                      %ProgramFiles(x86)%\Steam\userdata
                    </code>
                    <p className="text-gray-500 font-figtree text-xs mt-1">
                      Or navigate to: C:\Program Files (x86)\Steam\userdata\
                    </p>
                  </div>

                  <div>
                    <h4 className="text-tier-basic font-alegreya font-semibold mb-2">Linux</h4>
                    <code className="block bg-gray-900 p-3 rounded text-sm font-mono text-gray-300 overflow-x-auto">
                      ~/.steam/steam/userdata/
                    </code>
                    <p className="text-gray-500 font-figtree text-xs mt-1">
                      Or: ~/.steam/debian-installation/userdata/
                    </p>
                  </div>

                  <div>
                    <h4 className="text-tier-basic font-alegreya font-semibold mb-2">macOS</h4>
                    <ol className="text-gray-400 font-figtree text-sm list-decimal list-inside space-y-1 mb-2">
                      <li>Open Finder and press <code className="bg-gray-700 px-1 rounded text-tier-basic">Cmd + Shift + G</code></li>
                      <li>Paste the path below and press Enter</li>
                    </ol>
                    <code className="block bg-gray-900 p-3 rounded text-sm font-mono text-gray-300 overflow-x-auto">
                      ~/Library/Application Support/Steam/userdata
                    </code>
                  </div>
                </div>

                {/* Aethermancer specific path */}
                <h4 className="text-lg font-alegreya font-bold text-tier-maverick mb-2" style={{ fontVariant: 'small-caps' }}>
                  Aethermancer Save Location
                </h4>
                <p className="text-gray-300 font-figtree mb-3">
                  Inside the userdata folder, find your Steam User ID folder, then navigate to the Aethermancer folder (App ID <span className="text-tier-basic font-semibold">2288470</span>):
                </p>
                <code className="block bg-gray-900 p-3 rounded text-sm font-mono text-gray-300 mb-2 overflow-x-auto">
                  &lt;YOUR_USER_ID&gt;\2288470\remote\
                </code>
                <p className="text-gray-500 font-figtree text-xs mb-4">
                  Example (Windows): C:\Program Files (x86)\Steam\userdata\12345678\2288470\remote\
                </p>

                {/* Save file names */}
                <h4 className="text-lg font-alegreya font-bold text-tier-maverick mb-2" style={{ fontVariant: 'small-caps' }}>
                  Save File Names
                </h4>
                <ul className="text-gray-300 font-figtree space-y-1 mb-6">
                  <li><code className="bg-gray-700 px-1.5 py-0.5 rounded text-tier-basic">1_aethermancer.game</code> - Save Slot 1</li>
                  <li><code className="bg-gray-700 px-1.5 py-0.5 rounded text-tier-basic">2_aethermancer.game</code> - Save Slot 2</li>
                  <li><code className="bg-gray-700 px-1.5 py-0.5 rounded text-tier-basic">3_aethermancer.game</code> - Save Slot 3</li>
                </ul>

                {/* Finding Steam ID */}
                <h4 className="text-lg font-alegreya font-bold text-tier-maverick mb-2" style={{ fontVariant: 'small-caps' }}>
                  Finding Your Steam User ID
                </h4>
                <p className="text-gray-300 font-figtree mb-2">
                  Your Steam User ID is a numeric folder inside the <code className="bg-gray-700 px-1.5 py-0.5 rounded text-tier-basic">userdata</code> directory. To find it:
                </p>
                <ol className="text-gray-300 font-figtree list-decimal list-inside space-y-1">
                  <li>Open Steam and click your profile name</li>
                  <li>Select "View Profile"</li>
                  <li>Look at the URL - it contains your Steam ID</li>
                </ol>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
