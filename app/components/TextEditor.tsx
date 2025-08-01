'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Toolbar } from './Toolbar';
import { StatusBar } from './StatusBar';
import { FileManager } from './FileManager';
import { FindReplace } from './FindReplace';
import { useTextEditor } from '../hooks/useTextEditor';
import { useKeyboardShortcuts } from '../hooks/useKeyboardShortcuts';

export default function TextEditor() {
  const editorRef = useRef<HTMLDivElement>(null);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [showFindReplace, setShowFindReplace] = useState(false);
  const [fileName, setFileName] = useState('Untitled Document');
  
  const {
    content,
    setContent,
    wordCount,
    charCount,
    saveDocument,
    loadDocument,
    exportAsText,
    exportAsHTML,
    createNewDocument,
    autosaveEnabled,
    setAutosaveEnabled,
    documentId,
    lastSaved
  } = useTextEditor(editorRef, fileName);

  // Dark mode management
  useEffect(() => {
    const savedTheme = localStorage.getItem('text-editor-theme');
    if (savedTheme === 'dark') {
      setIsDarkMode(true);
      document.documentElement.classList.add('dark');
    }
  }, []);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    if (!isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('text-editor-theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('text-editor-theme', 'light');
    }
  };

  // Format text functions
  const formatText = useCallback((command: string, value?: string) => {
    document.execCommand(command, false, value);
    editorRef.current?.focus();
  }, []);

  const setAlignment = useCallback((alignment: string) => {
    formatText('justify' + alignment.charAt(0).toUpperCase() + alignment.slice(1));
  }, [formatText]);

  const setFontFamily = useCallback((fontFamily: string) => {
    formatText('fontName', fontFamily);
  }, [formatText]);

  const setFontSize = useCallback((size: string) => {
    formatText('fontSize', size);
  }, [formatText]);

  const setTextColor = useCallback((color: string) => {
    formatText('foreColor', color);
  }, [formatText]);

  const setHighlightColor = useCallback((color: string) => {
    formatText('backColor', color);
  }, [formatText]);

  const insertList = useCallback((type: 'bullet' | 'numbered') => {
    if (type === 'bullet') {
      formatText('insertUnorderedList');
    } else {
      formatText('insertOrderedList');
    }
  }, [formatText]);

  // Keyboard shortcuts
  useKeyboardShortcuts({
    onBold: () => formatText('bold'),
    onItalic: () => formatText('italic'),
    onUnderline: () => formatText('underline'),
    onSave: saveDocument,
    onNew: createNewDocument,
    onFind: () => setShowFindReplace(true),
  });

  // Handle content changes
  const handleContentChange = () => {
    if (editorRef.current) {
      setContent(editorRef.current.innerHTML);
    }
  };

  return (
    <div className={`min-h-screen flex flex-col transition-colors duration-200 ${isDarkMode ? 'dark' : ''}`}>
      <div className="bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 flex flex-col flex-1 min-h-0">
        {/* Header */}
        <header className="border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
          <div className="px-4 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <h1 className="text-xl font-semibold">Text Editor</h1>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {fileName}
                </span>
                {lastSaved && (
                  <span className="text-xs text-gray-400 dark:text-gray-500">
                    Last saved: {lastSaved.toLocaleTimeString()}
                  </span>
                )}
              </div>
              <div className="flex items-center space-x-2">
                <FileManager
                  onSave={saveDocument}
                  onLoad={loadDocument}
                  onNew={createNewDocument}
                  onExportText={exportAsText}
                  onExportHTML={exportAsHTML}
                  fileName={fileName}
                  onFileNameChange={setFileName}
                />
                <button
                  onClick={() => setShowFindReplace(!showFindReplace)}
                  className="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
                  title="Find & Replace (Ctrl+F)"
                >
                  🔍
                </button>
                <button
                  onClick={toggleDarkMode}
                  className="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
                  title="Toggle Dark Mode"
                >
                  {isDarkMode ? '☀️' : '🌙'}
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Find & Replace */}
        {showFindReplace && (
          <FindReplace
            editorRef={editorRef}
            onClose={() => setShowFindReplace(false)}
          />
        )}

        {/* Toolbar */}
        <Toolbar
          onFormat={formatText}
          onAlignment={setAlignment}
          onFontFamily={setFontFamily}
          onFontSize={setFontSize}
          onTextColor={setTextColor}
          onHighlightColor={setHighlightColor}
          onInsertList={insertList}
          autosaveEnabled={autosaveEnabled}
          onToggleAutosave={setAutosaveEnabled}
        />

        {/* Editor */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="flex-1 p-2">
            <div className="h-full w-full max-w-none">
              <div
                ref={editorRef}
                contentEditable
                className="w-full h-full min-h-[calc(100vh-300px)] p-2 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 shadow-sm resize-none overflow-auto"
                style={{
                  fontFamily: 'Arial, sans-serif',
                  fontSize: '16px',
                  lineHeight: '1.8',
                }}
                onInput={handleContentChange}
                onKeyUp={handleContentChange}
                suppressContentEditableWarning={true}
                placeholder="Start typing your document..."
              />
            </div>
          </div>
        </div>
      {/* Status Bar at the bottom */}
      <StatusBar
        wordCount={wordCount}
        charCount={charCount}
        documentId={documentId}
      />
      </div>
    </div>
  );
}
