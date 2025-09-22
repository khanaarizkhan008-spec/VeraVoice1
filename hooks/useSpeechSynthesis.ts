
import { useState, useEffect } from 'react';

export const useSpeechSynthesis = () => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoice, setSelectedVoice] = useState<SpeechSynthesisVoice | null>(null);

  const populateVoiceList = () => {
    const newVoices = window.speechSynthesis.getVoices();
    setVoices(newVoices);
    if (newVoices.length > 0) {
      const defaultVoice = newVoices.find(voice => voice.default) || newVoices[0];
      setSelectedVoice(defaultVoice);
    }
  };

  useEffect(() => {
    populateVoiceList();
    if (window.speechSynthesis.onvoiceschanged !== undefined) {
      window.speechSynthesis.onvoiceschanged = populateVoiceList;
    }
  }, []);

  const speak = (text: string, voice: SpeechSynthesisVoice | null) => {
    if (window.speechSynthesis.speaking) {
      window.speechSynthesis.cancel();
    }
    const utterance = new SpeechSynthesisUtterance(text);
    if (voice) {
        utterance.voice = voice;
    }
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    window.speechSynthesis.speak(utterance);
  };

  return {
    isSpeaking,
    speak,
    voices,
    selectedVoice,
    setSelectedVoice,
  };
};
