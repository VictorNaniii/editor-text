'use client';

import React from 'react';
import {
  FaFileAlt,
  FaKeyboard,
  FaIdCard,
  FaCheckCircle
} from 'react-icons/fa';

interface StatusBarProps {
  wordCount: number;
  charCount: number;
  documentId: string;
}

export function StatusBar({ wordCount, charCount, documentId }: StatusBarProps) {
  return (
    <footer className="border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-4 py-3">
      <div className="max-w-full mx-auto flex justify-between items-center text-sm text-gray-600 dark:text-gray-400">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <FaFileAlt className="w-4 h-4" />
            <span>Words: {wordCount}</span>
          </div>
          <div className="flex items-center gap-2">
            <FaKeyboard className="w-4 h-4" />
            <span>Characters: {charCount}</span>
          </div>
          <div className="flex items-center gap-2">
            <FaIdCard className="w-4 h-4" />
            <span>Document ID: {documentId}</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <FaCheckCircle className="w-4 h-4 text-green-500" />
          <span>Ready</span>
        </div>
      </div>
    </footer>
  );
}
