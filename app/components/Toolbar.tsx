'use client';

import React from 'react';
import {
  FaBold,
  FaItalic, 
  FaUnderline, 
  FaStrikethrough,
  FaAlignLeft,
  FaAlignCenter,
  FaAlignRight,
  FaIndent,
  FaOutdent,
  FaListUl,
  FaListOl,
  FaEraser,
  FaSave,
  FaPalette
} from "react-icons/fa";
import { MdFormatColorText } from "react-icons/md";

interface ToolbarProps {
  onFormat: (command: string, value?: string) => void;
  onAlignment: (alignment: string) => void;
  onFontFamily: (fontFamily: string) => void;
  onFontSize: (size: string) => void;
  onTextColor: (color: string) => void;
  onHighlightColor: (color: string) => void;
  onInsertList: (type: 'bullet' | 'numbered') => void;
  autosaveEnabled: boolean;
  onToggleAutosave: (enabled: boolean) => void;
}

export function Toolbar({
  onFormat,
  onAlignment,
  onFontFamily,
  onFontSize,
  onTextColor,
  onHighlightColor,
  onInsertList,
  autosaveEnabled,
  onToggleAutosave,
}: ToolbarProps) {
  const fontFamilies = [
    'Arial, sans-serif',
    'Times New Roman, serif',
    'Courier New, monospace',
    'Georgia, serif',
    'Helvetica, sans-serif',
    'Verdana, sans-serif',
  ];

  const fontSizes = ['8', '10', '12', '14', '16', '18', '20', '24', '28', '32', '36', '48'];

  return (
    <div className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 p-3">
      <div className="max-w-full mx-auto">
        <div className="flex items-center gap-3 overflow-x-auto">
          {/* Basic Formatting */}
          <div className="flex items-center gap-1 border-r border-gray-300 dark:border-gray-600 pr-3">
            <button
              onClick={() => onFormat('bold')}
              className="p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              title="Bold (Ctrl+B)"
            >
              <FaBold className="w-4 h-4" />
            </button>
            <button
              onClick={() => onFormat('italic')}
              className="p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              title="Italic (Ctrl+I)"
            >
              <FaItalic className="w-4 h-4" />
            </button>
            <button
              onClick={() => onFormat('underline')}
              className="p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              title="Underline (Ctrl+U)"
            >
              <FaUnderline className="w-4 h-4" />
            </button>
            <button
              onClick={() => onFormat('strikeThrough')}
              className="p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              title="Strikethrough"
            >
              <FaStrikethrough className="w-4 h-4" />
            </button>
          </div>

          {/* Alignment */}
          <div className="flex items-center gap-1 border-r border-gray-300 dark:border-gray-600 pr-3">
            <button
              onClick={() => onAlignment('left')}
              className="p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              title="Align Left"
            >
              <FaAlignLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => onAlignment('center')}
              className="p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              title="Center"
            >
              <FaAlignCenter className="w-4 h-4" />
            </button>
            <button
              onClick={() => onAlignment('right')}
              className="p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              title="Align Right"
            >
              <FaAlignRight className="w-4 h-4" />
            </button>
          </div>

          {/* Font Family */}
          <div className="border-r border-gray-300 dark:border-gray-600 pr-3">
            <select
              onChange={(e) => onFontFamily(e.target.value)}
              className="px-3 py-2 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm min-w-[140px] h-10"
              title="Font Family"
            >
              <option value="">Font Family</option>
              {fontFamilies.map((font) => (
                <option key={font} value={font} style={{ fontFamily: font }}>
                  {font.split(',')[0]}
                </option>
              ))}
            </select>
          </div>

          {/* Font Size */}
          <div className="border-r border-gray-300 dark:border-gray-600 pr-3">
            <select
              onChange={(e) => onFontSize(e.target.value)}
              className="px-3 py-2 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm min-w-[80px] h-10"
              title="Font Size"
            >
              <option value="">Size</option>
              {fontSizes.map((size) => (
                <option key={size} value={size}>
                  {size}px
                </option>
              ))}
            </select>
          </div>

          {/* Colors */}
          <div className="flex items-center gap-2 border-r border-gray-300 dark:border-gray-600 pr-3">
            <div className="flex items-center gap-1">
              <MdFormatColorText className="w-4 h-4 text-gray-600 dark:text-gray-400" />
              <input
                type="color"
                onChange={(e) => onTextColor(e.target.value)}
                className="w-10 h-10 rounded border border-gray-300 dark:border-gray-600 cursor-pointer"
                title="Text Color"
              />
            </div>
            <div className="flex items-center gap-1">
              <FaPalette className="w-4 h-4 text-gray-600 dark:text-gray-400" />
              <input
                type="color"
                onChange={(e) => onHighlightColor(e.target.value)}
                className="w-10 h-10 rounded border border-gray-300 dark:border-gray-600 cursor-pointer"
                title="Highlight Color"
                defaultValue="#ffff00"
              />
            </div>
          </div>

          {/* Lists */}
          <div className="flex items-center gap-1 border-r border-gray-300 dark:border-gray-600 pr-3">
            <button
              onClick={() => onInsertList('bullet')}
              className="p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              title="Bullet List"
            >
              <FaListUl className="w-4 h-4" />
            </button>
            <button
              onClick={() => onInsertList('numbered')}
              className="p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              title="Numbered List"
            >
              <FaListOl className="w-4 h-4" />
            </button>
          </div>

          {/* Additional Formatting */}
          <div className="flex items-center gap-1 border-r border-gray-300 dark:border-gray-600 pr-3">
            <button
              onClick={() => onFormat('indent')}
              className="p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              title="Indent"
            >
              <FaIndent className="w-4 h-4" />
            </button>
            <button
              onClick={() => onFormat('outdent')}
              className="p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              title="Outdent"
            >
              <FaOutdent className="w-4 h-4" />
            </button>
            <button
              onClick={() => onFormat('removeFormat')}
              className="p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              title="Clear Formatting"
            >
              <FaEraser className="w-4 h-4" />
            </button>
          </div>

          {/* Autosave Toggle */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => onToggleAutosave(!autosaveEnabled)}
              className={`flex items-center gap-2 px-3 py-2 rounded transition-colors ${
                autosaveEnabled
                  ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
              }`}
              title={`Autosave is ${autosaveEnabled ? 'enabled' : 'disabled'}`}
            >
              <FaSave className="w-4 h-4" />
              <span className="text-sm font-medium">
                {autosaveEnabled ? 'Auto' : 'Manual'}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
