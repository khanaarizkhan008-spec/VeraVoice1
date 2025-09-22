import React from 'react';

interface SettingsPanelProps {
  isOpen: boolean;
  onClose: () => void;
  voices: SpeechSynthesisVoice[];
  selectedVoice: SpeechSynthesisVoice | null;
  setSelectedVoice: (voice: SpeechSynthesisVoice) => void;
}

export const SettingsPanel: React.FC<SettingsPanelProps> = ({
  isOpen,
  onClose,
  voices,
  selectedVoice,
  setSelectedVoice,
}) => {
  if (!isOpen) return null;

  const handleVoiceChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedVoiceName = event.target.value;
    const voice = voices.find(v => v.name === selectedVoiceName);
    if (voice) {
      setSelectedVoice(voice);
    }
  };

  return (
    <>
      <div
        className="fixed inset-0 bg-black/50 z-40 transition-opacity"
        onClick={onClose}
      ></div>
      <div
        className={`fixed top-0 right-0 h-full w-80 bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Settings</h2>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-800">
              <i className="fas fa-times fa-lg"></i>
            </button>
          </div>
          
          <div className="space-y-4">
            <div>
              <label htmlFor="voice-select" className="block text-sm font-medium text-gray-700 mb-1">
                Vera's Voice
              </label>
              <select
                id="voice-select"
                value={selectedVoice?.name || ''}
                onChange={handleVoiceChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
              >
                {voices.map((voice) => (
                  <option key={voice.name} value={voice.name}>
                    {`${voice.name} (${voice.lang})`}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};