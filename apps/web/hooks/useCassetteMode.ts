import { useState, useEffect, useCallback } from 'react';
import { globalCassette } from '../../../packages/anchor8-sdk/cassette';

export function useCassetteMode() {
  const [isOffline, setIsOffline] = useState(false);

  const toggleCassetteMode = useCallback(() => {
    setIsOffline(prev => {
      const nextState = !prev;
      globalCassette.setMode(nextState);
      return nextState;
    });
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'o') {
        e.preventDefault();
        toggleCassetteMode();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [toggleCassetteMode]);

  return { isOffline, toggleCassetteMode };
}
