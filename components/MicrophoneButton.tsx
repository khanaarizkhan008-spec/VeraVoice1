import React from 'react';

interface MicrophoneButtonProps {
  isListening: boolean;
  isProcessing: boolean;
  onClick: () => void;
}

export const MicrophoneButton: React.FC<MicrophoneButtonProps> = ({ isListening, isProcessing, onClick }) => {
  const getButtonClass = () => {
    if (isProcessing) {
      return 'bg-yellow-500 text-white cursor-not-allowed';
    }
    if (isListening) {
      return 'bg-red-500 text-white animate-pulse';
    }
    return 'bg-green-600 text-white hover:bg-green-700';
  };

  const getRingClass = () => {
    if (isListening) {
      return 'border-green-400 animate-ping';
    }
    return 'border-transparent';
  };

  return (
    <div className="relative flex items-center justify-center">
      <div className={`absolute w-32 h-32 rounded-full ${getRingClass()}`} style={{ borderWidth: '6px' }}></div>
      <button
        onClick={onClick}
        disabled={isProcessing}
        className={`relative w-28 h-28 rounded-full flex items-center justify-center transition-all duration-300 ease-in-out shadow-xl focus:outline-none focus:ring-4 focus:ring-green-300 ${getButtonClass()}`}
        aria-label={isListening ? 'Stop listening' : 'Start listening'}
      >
        {isProcessing ? (
          <i className="fas fa-brain fa-2x animate-spin"></i>
        ) : (
          <i className="fas fa-microphone-alt fa-3x"></i>
        )}
      </button>
    </div>
  );
};