import React, { useState, useEffect, useCallback } from 'react';
import { useSpeechRecognition } from './hooks/useSpeechRecognition';
import { useSpeechSynthesis } from './hooks/useSpeechSynthesis';
import { getVeraResponse } from './services/geminiService';
import { MicrophoneButton } from './components/MicrophoneButton';
import { SettingsPanel } from './components/SettingsPanel';
import { UserSetupModal } from './components/UserSetupModal';
import { VERA_WAKE_WORD } from './constants';

const App: React.FC = () => {
  const [userName, setUserName] = useState<string | null>(null);
  const [isSetupModalOpen, setIsSetupModalOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [veraResponse, setVeraResponse] = useState("Hi! I'm Vera. Click the microphone and say 'Hey Vera' to get started.");
  const [conversationHistory, setConversationHistory] = useState<any[]>([]);

  const { speak, isSpeaking, voices, selectedVoice, setSelectedVoice } = useSpeechSynthesis();

  const handleTranscript = useCallback(async (text: string) => {
    setTranscript(text);
    if (text.toLowerCase().startsWith(VERA_WAKE_WORD.toLowerCase())) {
      stopListening();
      const command = text.substring(VERA_WAKE_WORD.length).trim();
      if (command) {
        setIsProcessing(true);
        setVeraResponse(`Thinking...`);
        const response = await getVeraResponse(command, conversationHistory, userName || 'friend');
        setVeraResponse(response);
        setConversationHistory(prev => [...prev, { role: 'user', parts: [{ text: command }] }, { role: 'model', parts: [{ text: response }] }]);
        speak(response, selectedVoice);
        setIsProcessing(false);
      }
    }
  }, [conversationHistory, speak, selectedVoice, userName]);

  const { isListening, startListening, stopListening } = useSpeechRecognition(handleTranscript);

  useEffect(() => {
    const storedName = localStorage.getItem('vera-username');
    if (storedName) {
      setUserName(storedName);
      setVeraResponse(`Welcome back, ${storedName}! How can I help you today?`);
    } else {
      setIsSetupModalOpen(true);
    }
  }, []);

  const handleNameSet = (name: string) => {
    localStorage.setItem('vera-username', name);
    setUserName(name);
    setIsSetupModalOpen(false);
    setVeraResponse(`Nice to meet you, ${name}! Click the microphone and say 'Hey Vera' followed by your question.`);
  };

  const toggleListening = () => {
    if (isSpeaking) return;
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };
  
  return (
    <div className="relative min-h-screen bg-gradient-to-br from-green-50 to-teal-100 font-sans flex flex-col items-center justify-center p-4 overflow-hidden">
        <div className="absolute top-6 right-6 z-20">
            <button
                onClick={() => setIsSettingsOpen(!isSettingsOpen)}
                className="text-gray-500 hover:text-green-600 transition-colors duration-300"
                aria-label="Open settings"
            >
                <i className="fas fa-cog fa-2x"></i>
            </button>
        </div>

        <main className="flex flex-col items-center justify-center text-center w-full max-w-2xl z-10 flex-grow">
            <div className="mb-8">
                <h1 className="text-5xl md:text-6xl font-bold text-gray-800">
                    Vera<span className="text-green-600">Voice</span>
                </h1>
                <p className="text-lg text-gray-600 mt-2">Your Voice, Your Command.</p>
            </div>

            <div className="w-full min-h-64 bg-white/70 backdrop-blur-sm rounded-xl shadow-lg p-6 flex items-center justify-center text-gray-700 text-lg mb-12">
                <p>{isProcessing ? 'Thinking...' : veraResponse}</p>
            </div>
            
            <div className="mb-8">
                <MicrophoneButton 
                    isListening={isListening} 
                    isProcessing={isProcessing} 
                    onClick={toggleListening}
                />
            </div>
            
            <div className="h-10 text-gray-500">
                {isListening ? "Listening..." : (transcript && <p>You said: "{transcript}"</p>)}
            </div>
        </main>
        
        <SettingsPanel
            isOpen={isSettingsOpen}
            onClose={() => setIsSettingsOpen(false)}
            voices={voices}
            selectedVoice={selectedVoice}
            setSelectedVoice={setSelectedVoice}
        />

        <UserSetupModal
            isOpen={isSetupModalOpen}
            onNameSet={handleNameSet}
        />
    </div>
  );
};

export default App;