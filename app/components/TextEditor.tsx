'use client';

import React, { useState, useRef, useCallback } from 'react';
import { Toolbar } from './Toolbar';
import { StatusBar } from './StatusBar';
import { FileManager } from './FileManager';
import { FindReplace } from './FindReplace';
import { useTextEditor } from '../hooks/useTextEditor';
import { useKeyboardShortcuts } from '../hooks/useKeyboardShortcuts';

export default function TextEditor() {
  const editorRef = useRef<HTMLDivElement>(null!); // Added non-null assertion to ensure compatibility
  const [showFindReplace, setShowFindReplace] = useState(false);
  const [fileName, setFileName] = useState('Untitled Document');
  
  const {
    setContent,
    wordCount,
    charCount,
    saveDocument,
    loadDocument,
    exportAsText,
    exportAsHTML,
    createNewDocument,
    documentId,
    lastSaved
  } = useTextEditor(editorRef, fileName);

  // Format text functions
  const formatText = useCallback((command: string, value?: string) => {
    editorRef.current?.focus();
    document.execCommand(command, false, value);
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
    const editor = editorRef.current;
    if (!editor) return;
    editor.focus();
    document.execCommand(type === 'bullet' ? 'insertUnorderedList' : 'insertOrderedList', false, '');
  }, []);

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
      <div className="min-h-screen flex flex-col transition-colors duration-200">
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

                <FileManager
                    onSave={saveDocument}
                    onLoad={loadDocument}
                    onExportText={exportAsText}
                    onExportHTML={exportAsHTML}
                    onNew={createNewDocument}
                    fileName={fileName}
                    onFileNameChange={setFileName}
                />
              </div>
            </div>
          </header>

          {/* Toolbar */}
          <Toolbar
              onFormat={formatText}
              onAlignment={setAlignment}
              onFontFamily={setFontFamily}
              onFontSize={setFontSize}
              onTextColor={setTextColor}
              onHighlightColor={setHighlightColor}
              onInsertList={insertList}
              autosaveEnabled={false} // Added default value for autosaveEnabled
              onToggleAutosave={() => {}} // Added placeholder function for onToggleAutosave
          />

          {/* Find and Replace */}
          {showFindReplace && (
              <FindReplace
                  editorRef={editorRef as React.RefObject<HTMLDivElement>} // Ensured type compatibility
                  onClose={() => setShowFindReplace(false)}
              />
          )}

          {/* Main Editor */}
          <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
            <div className="flex-1 px-4 lg:px-8 overflow-y-auto">
              <div
                  ref={editorRef}
                  contentEditable
                  suppressContentEditableWarning
                  onInput={handleContentChange}
                  className="min-h-[calc(100vh-180px)] w-full max-w-[90%] lg:max-w-[85%] xl:max-w-[80%] mx-auto bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                  style={{
                    lineHeight: '1.6',
                    fontSize: '16px',
                    fontFamily: 'system-ui, -apple-system, sans-serif',
                    boxSizing: 'border-box'
                  }}
                  data-placeholder="Start typing your document..."
              />
            </div>
          </div>

          {/* Status Bar */}
          <StatusBar
              wordCount={wordCount}
              charCount={charCount}
              documentId={documentId}
          />
        </div>
      </div>
  );
}
