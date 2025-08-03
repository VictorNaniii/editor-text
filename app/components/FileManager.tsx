'use client';

import React, { useState, useRef, useEffect } from 'react';

interface FileManagerProps {
  onSave: () => void;
  onLoad: (content: string, filename: string) => void;
  onNew: () => void;
  onExportText: () => void;
  onExportHTML: () => void;
  fileName: string;
  onFileNameChange: (name: string) => void;
}

export function FileManager({
                              onSave,
                              onLoad,
                              onNew,
                              onExportText,
                              onExportHTML,
                              fileName,
                              onFileNameChange,
                            }: FileManagerProps) {
  const [showMenu, setShowMenu] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const handleFileImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        onLoad(content, file.name);
        onFileNameChange(file.name.replace(/\.[^/.]+$/, ''));
      };
      reader.readAsText(file);
    }
    setShowMenu(false);
  };

  const handleNewDocument = () => {
    if (confirm('Create a new document? Any unsaved changes will be lost.')) {
      onNew();
      onFileNameChange('Untitled Document');
    }
    setShowMenu(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false);
      }
    };

    if (showMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showMenu]);

  return (
      <div className="relative" ref={menuRef}>
        <button
            onClick={() => setShowMenu(!showMenu)}
            className="px-3 py-2 rounded bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium"
        >
          File
        </button>

        {showMenu && (
            <div className="absolute right-0 mt-1 w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg z-50">
              <div className="py-1">
                <button
                    onClick={handleNewDocument}
                    className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  📄 New Document (Ctrl+N)
                </button>

                <button
                    onClick={() => {
                      fileInputRef.current?.click();
                      setShowMenu(false);
                    }}
                    className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  📁 Open File
                </button>

                <button
                    onClick={() => {
                      onSave();
                      setShowMenu(false);
                    }}
                    className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  💾 Save (Ctrl+S)
                </button>

                <hr className="my-1 border-gray-200 dark:border-gray-700" />

                <button
                    onClick={() => {
                      onExportText();
                      setShowMenu(false);
                    }}
                    className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  📄 Export as Text (.txt)
                </button>

                <button
                    onClick={() => {
                      onExportHTML();
                      setShowMenu(false);
                    }}
                    className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  🌐 Export as HTML (.html)
                </button>

                <hr className="my-1 border-gray-200 dark:border-gray-700" />

                <div className="px-4 py-2">
                  <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">
                    Document Name
                  </label>
                  <input
                      type="text"
                      value={fileName}
                      onChange={(e) => onFileNameChange(e.target.value)}
                      className="w-full px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700"
                      placeholder="Document name"
                  />
                </div>
              </div>
            </div>
        )}

        <input
            ref={fileInputRef}
            type="file"
            accept=".txt,.html,.htm"
            onChange={handleFileImport}
            className="hidden"
        />
      </div>
  );
}