import React, { useState } from 'react';

interface UserSetupModalProps {
  isOpen: boolean;
  onNameSet: (name: string) => void;
}

export const UserSetupModal: React.FC<UserSetupModalProps> = ({ isOpen, onNameSet }) => {
  const [name, setName] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onNameSet(name.trim());
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl p-8 max-w-sm w-full">
        <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">Welcome to VeraVoice!</h2>
        <p className="text-gray-600 mb-6 text-center">To get started, please tell me your name.</p>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your name"
            className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
            autoFocus
          />
          <button
            type="submit"
            className="w-full mt-6 bg-green-600 text-white font-bold py-2 px-4 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors duration-300"
          >
            Let's Go!
          </button>
        </form>
      </div>
    </div>
  );
};