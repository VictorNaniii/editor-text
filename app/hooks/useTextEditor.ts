'use client';

import { useState, useEffect, useCallback, useRef } from 'react';

interface UseTextEditorReturn {
  content: string;
  setContent: (content: string) => void;
  wordCount: number;
  charCount: number;
  saveDocument: () => void;
  loadDocument: (content: string, filename?: string) => void;
  exportAsText: () => void;
  exportAsHTML: () => void;
  createNewDocument: () => void;
  autosaveEnabled: boolean;
  setAutosaveEnabled: (enabled: boolean) => void;
  documentId: string;
  lastSaved: Date | null;
}

export function useTextEditor(
  editorRef: React.RefObject<HTMLDivElement>,
  fileName: string
): UseTextEditorReturn {
  const [content, setContent] = useState('');
  const [wordCount, setWordCount] = useState(0);
  const [charCount, setCharCount] = useState(0);
  const [autosaveEnabled, setAutosaveEnabled] = useState(true);
  const [documentId, setDocumentId] = useState('');
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const autosaveTimerRef = useRef<NodeJS.Timeout>();

  // Generate or load document ID
  useEffect(() => {
    const savedDocId = localStorage.getItem('text-editor-current-doc-id');
    if (savedDocId) {
      setDocumentId(savedDocId);
      // Load the document
      const savedContent = localStorage.getItem(`text-editor-doc-${savedDocId}`);
      if (savedContent) {
        const docData = JSON.parse(savedContent);
        setContent(docData.content);
        if (editorRef.current) {
          editorRef.current.innerHTML = docData.content;
        }
        setLastSaved(new Date(docData.lastSaved));
      }
    } else {
      const newId = generateDocumentId();
      setDocumentId(newId);
      localStorage.setItem('text-editor-current-doc-id', newId);
    }
  }, []);

  // Calculate word and character counts
  useEffect(() => {
    const text = editorRef.current?.textContent || '';
    setCharCount(text.length);
    setWordCount(text.trim() ? text.trim().split(/\s+/).length : 0);
  }, [content, editorRef]);

  // Autosave functionality
  useEffect(() => {
    if (autosaveEnabled && content && documentId) {
      // Clear existing timer
      if (autosaveTimerRef.current) {
        clearTimeout(autosaveTimerRef.current);
      }

      // Set new timer for 3 seconds
      autosaveTimerRef.current = setTimeout(() => {
        saveDocument();
      }, 3000);
    }

    return () => {
      if (autosaveTimerRef.current) {
        clearTimeout(autosaveTimerRef.current);
      }
    };
  }, [content, autosaveEnabled, documentId]);

  const generateDocumentId = (): string => {
    return 'doc_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  };

  const saveDocument = useCallback(() => {
    if (!documentId || !content) return;

    const docData = {
      id: documentId,
      content,
      fileName,
      lastSaved: new Date().toISOString(),
      created: new Date().toISOString(),
    };

    // Save to localStorage
    localStorage.setItem(`text-editor-doc-${documentId}`, JSON.stringify(docData));

    // Update saved documents list
    const savedDocs = JSON.parse(localStorage.getItem('text-editor-saved-docs') || '[]');
    const existingIndex = savedDocs.findIndex((doc: any) => doc.id === documentId);

    if (existingIndex >= 0) {
      savedDocs[existingIndex] = { id: documentId, fileName, lastSaved: docData.lastSaved };
    } else {
      savedDocs.push({ id: documentId, fileName, lastSaved: docData.lastSaved });
    }

    localStorage.setItem('text-editor-saved-docs', JSON.stringify(savedDocs));
    setLastSaved(new Date());
  }, [documentId, content, fileName]);

  const loadDocument = useCallback((newContent: string, filename?: string) => {
    setContent(newContent);
    if (editorRef.current) {
      editorRef.current.innerHTML = newContent;
    }
  }, [editorRef]);

  const createNewDocument = useCallback(() => {
    const newId = generateDocumentId();
    setDocumentId(newId);
    setContent('');
    setLastSaved(null);

    if (editorRef.current) {
      editorRef.current.innerHTML = '';
    }

    localStorage.setItem('text-editor-current-doc-id', newId);
  }, [editorRef]);

  const exportAsText = useCallback(() => {
    const text = editorRef.current?.textContent || '';
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = `${fileName || 'document'}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [editorRef, fileName]);

  const exportAsHTML = useCallback(() => {
    const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${fileName || 'Document'}</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
            color: #333;
        }
        .document-title {
            text-align: center;
            color: #666;
            margin-bottom: 30px;
        }
        .content {
            min-height: 400px;
        }
    </style>
</head>
<body>
    <div class="document-title">
        <h1>${fileName || 'Untitled Document'}</h1>
        <p>Exported on ${new Date().toLocaleDateString()}</p>
    </div>
    <div class="content">
        ${content || ''}
    </div>
</body>
</html>`;

    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = `${fileName || 'document'}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [content, fileName]);

  return {
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
    lastSaved,
  };
}
