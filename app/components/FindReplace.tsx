'use client';

import React, { useState, useCallback } from 'react';
import {
  FaSearch,
  FaTimes,
  FaChevronUp,
  FaChevronDown,
  FaExchangeAlt,
  FaCheckSquare,
  FaSquare
} from 'react-icons/fa';

interface FindReplaceProps {
  editorRef: React.RefObject<HTMLDivElement>;
  onClose: () => void;
}

export function FindReplace({ editorRef, onClose }: FindReplaceProps) {
  const [findText, setFindText] = useState('');
  const [replaceText, setReplaceText] = useState('');
  const [caseSensitive, setCaseSensitive] = useState(false);
  const [currentMatchIndex, setCurrentMatchIndex] = useState(0);
  const [totalMatches, setTotalMatches] = useState(0);

  const highlightMatches = useCallback((searchText: string) => {
    if (!editorRef.current || !searchText) {
      // Clear previous highlights
      if (editorRef.current) {
        const content = editorRef.current.innerHTML.replace(
          /<mark class="search-highlight[^"]*"[^>]*>([^<]*)<\/mark>/gi,
          '$1'
        );
        editorRef.current.innerHTML = content;
      }
      setTotalMatches(0);
      setCurrentMatchIndex(0);
      return;
    }

    const content = editorRef.current.textContent || '';
    const flags = caseSensitive ? 'g' : 'gi';
    const regex = new RegExp(searchText.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), flags);
    const matches = content.match(regex);

    if (matches) {
      setTotalMatches(matches.length);
      setCurrentMatchIndex(1);

      // Highlight all matches
      let htmlContent = editorRef.current.innerHTML;
      const highlightRegex = new RegExp(
        `(${searchText.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`,
        flags
      );

      htmlContent = htmlContent.replace(
        highlightRegex,
        '<mark class="search-highlight bg-yellow-300 dark:bg-yellow-600">$1</mark>'
      );

      editorRef.current.innerHTML = htmlContent;
    } else {
      setTotalMatches(0);
      setCurrentMatchIndex(0);
    }
  }, [editorRef, caseSensitive]);

  const findNext = useCallback(() => {
    if (totalMatches > 0) {
      const nextIndex = currentMatchIndex < totalMatches ? currentMatchIndex + 1 : 1;
      setCurrentMatchIndex(nextIndex);

      // Scroll to the current match
      const highlights = editorRef.current?.querySelectorAll('.search-highlight');
      if (highlights && highlights[nextIndex - 1]) {
        highlights[nextIndex - 1].scrollIntoView({ behavior: 'smooth', block: 'center' });

        // Remove current highlight from all
        highlights.forEach(h => h.classList.remove('bg-blue-300', 'dark:bg-blue-600'));
        // Add current highlight
        highlights[nextIndex - 1].classList.add('bg-blue-300', 'dark:bg-blue-600');
      }
    }
  }, [editorRef, currentMatchIndex, totalMatches]);

  const findPrevious = useCallback(() => {
    if (totalMatches > 0) {
      const prevIndex = currentMatchIndex > 1 ? currentMatchIndex - 1 : totalMatches;
      setCurrentMatchIndex(prevIndex);

      // Scroll to the current match
      const highlights = editorRef.current?.querySelectorAll('.search-highlight');
      if (highlights && highlights[prevIndex - 1]) {
        highlights[prevIndex - 1].scrollIntoView({ behavior: 'smooth', block: 'center' });

        // Remove current highlight from all
        highlights.forEach(h => h.classList.remove('bg-blue-300', 'dark:bg-blue-600'));
        // Add current highlight
        highlights[prevIndex - 1].classList.add('bg-blue-300', 'dark:bg-blue-600');
      }
    }
  }, [editorRef, currentMatchIndex, totalMatches]);

  const replaceOne = useCallback(() => {
    if (!editorRef.current || !findText || totalMatches === 0) return;

    const highlights = editorRef.current.querySelectorAll('.search-highlight');
    const currentHighlight = highlights[currentMatchIndex - 1];

    if (currentHighlight) {
      currentHighlight.outerHTML = replaceText;
      highlightMatches(findText);
      findNext();
    }
  }, [editorRef, findText, replaceText, totalMatches, currentMatchIndex, highlightMatches, findNext]);

  const replaceAll = useCallback(() => {
    if (!editorRef.current || !findText) return;

    const content = editorRef.current.innerHTML;
    const flags = caseSensitive ? 'g' : 'gi';
    const regex = new RegExp(findText.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), flags);

    const newContent = content.replace(regex, replaceText);
    editorRef.current.innerHTML = newContent;

    setTotalMatches(0);
    setCurrentMatchIndex(0);
  }, [editorRef, findText, replaceText, caseSensitive]);

  const handleFindChange = (value: string) => {
    setFindText(value);
    highlightMatches(value);
  };

  return (
    <div className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 p-4">
      <div className="flex items-center gap-4 max-w-full">
        {/* Find Input */}
        <div className="flex items-center gap-2 min-w-0 flex-1">
          <FaSearch className="w-4 h-4 text-gray-500 dark:text-gray-400" />
          <input
            type="text"
            placeholder="Find..."
            value={findText}
            onChange={(e) => handleFindChange(e.target.value)}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-sm flex-1 min-w-[200px] h-10"
            autoFocus
          />
          <div className="flex items-center gap-1">
            <button
              onClick={findPrevious}
              disabled={totalMatches === 0}
              className="p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
              title="Previous"
            >
              <FaChevronUp className="w-4 h-4" />
            </button>
            <button
              onClick={findNext}
              disabled={totalMatches === 0}
              className="p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
              title="Next"
            >
              <FaChevronDown className="w-4 h-4" />
            </button>
          </div>
          <span className="text-sm text-gray-500 dark:text-gray-400 whitespace-nowrap">
            {totalMatches > 0 ? `${currentMatchIndex}/${totalMatches}` : '0/0'}
          </span>
        </div>

        {/* Replace Input */}
        <div className="flex items-center gap-2 min-w-0 flex-1">
          <FaExchangeAlt className="w-4 h-4 text-gray-500 dark:text-gray-400" />
          <input
            type="text"
            placeholder="Replace..."
            value={replaceText}
            onChange={(e) => setReplaceText(e.target.value)}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-sm flex-1 min-w-[200px] h-10"
          />
          <div className="flex items-center gap-1">
            <button
              onClick={replaceOne}
              disabled={totalMatches === 0}
              className="px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
              title="Replace"
            >
              Replace
            </button>
            <button
              onClick={replaceAll}
              disabled={totalMatches === 0}
              className="px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
              title="Replace All"
            >
              All
            </button>
          </div>
        </div>

        {/* Options */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setCaseSensitive(!caseSensitive)}
            className="flex items-center gap-2 px-3 py-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700 text-sm"
            title="Case Sensitive"
          >
            {caseSensitive ? (
              <FaCheckSquare className="w-4 h-4 text-blue-600" />
            ) : (
              <FaSquare className="w-4 h-4 text-gray-400" />
            )}
            <span>Aa</span>
          </button>

          <button
            onClick={onClose}
            className="p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700"
            title="Close"
          >
            <FaTimes className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
