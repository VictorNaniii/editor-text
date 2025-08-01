'use client';

import { useEffect } from 'react';

interface UseKeyboardShortcutsProps {
  onBold: () => void;
  onItalic: () => void;
  onUnderline: () => void;
  onSave: () => void;
  onNew: () => void;
  onFind: () => void;
}

export function useKeyboardShortcuts({
  onBold,
  onItalic,
  onUnderline,
  onSave,
  onNew,
  onFind,
}: UseKeyboardShortcutsProps) {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Check if Ctrl (or Cmd on Mac) is pressed
      const isCtrlOrCmd = event.ctrlKey || event.metaKey;

      if (isCtrlOrCmd) {
        switch (event.key.toLowerCase()) {
          case 'b':
            event.preventDefault();
            onBold();
            break;
          case 'i':
            event.preventDefault();
            onItalic();
            break;
          case 'u':
            event.preventDefault();
            onUnderline();
            break;
          case 's':
            event.preventDefault();
            onSave();
            break;
          case 'n':
            event.preventDefault();
            onNew();
            break;
          case 'f':
            event.preventDefault();
            onFind();
            break;
          default:
            break;
        }
      }
    };

    // Add event listener
    document.addEventListener('keydown', handleKeyDown);

    // Cleanup
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [onBold, onItalic, onUnderline, onSave, onNew, onFind]);
}
