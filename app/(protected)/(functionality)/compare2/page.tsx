"use client";

// types/htmldiff-js.d.ts
declare module 'htmldiff-js' {
    interface HtmlDiff {
      execute: (oldHtml: string, newHtml: string) => string;
    }
    
    const htmldiff: HtmlDiff;
    export default htmldiff;
}

import React, { useState } from 'react';
import htmldiff from 'htmldiff-js';

const App = () => {
  const [file1Content, setFile1Content] = useState('');
  const [file2Content, setFile2Content] = useState('');
  const [diffContent, setDiffContent] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [executionTime, setExecutionTime] = useState(0);

  const handleFileUpload = async (e) => {
    setError('');
    setIsLoading(true);
    const startTime = performance.now();
    const files = e.target.files;

    if (files.length !== 2) {
      setError('Please upload exactly two HTML files.');
      setIsLoading(false);
      return;
    }

    try {
      const file1 = await files[0].text();
      const file2 = await files[1].text();
      setFile1Content(file1);
      setFile2Content(file2);
      
      // Perform diff operation
      const diff = htmldiff.execute(file1, file2);
      // Add styles to the diff content
      const styledDiffContent = `
        <style>
          body { font: normal 14px/1.4 sans-serif; background: #f1f1f1; margin: 0; padding: 0; }
          ins { background: lightgreen; text-decoration: none; }
          del { background: pink; }
          table { border-collapse: collapse; width: 100%; }
          td { border: 1px solid #ccc; }
        </style>
        ${diff}
      `;
      setDiffContent(styledDiffContent);

      
      const endTime = performance.now();
      setExecutionTime((endTime - startTime) / 1000); // Convert to seconds
    } catch (err) {
      if (err instanceof Error) {
        setError('Error processing files: ' + err.message);
      } else {
        setError('Error processing files.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const downloadDiff = () => {
    const blob = new Blob([diffContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'html-diff.html';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url); // Clean up the URL
  };

  return (
    <div>
      <style>
        {`
          html { font: normal 14px/1.4 sans-serif; background: #f1f1f1; }
          body { font: normal 14px/1.4 sans-serif; background: #f1f1f1; }
          p { margin: 0 0 1rem; }
          ins { background: lightgreen; text-decoration: none; }
          del { background: pink; }
          table { border-collapse: collapse; width: 100%; }
          td { border: 1px solid #ccc; }
          .card { background: #fff; border: 1px solid #ccc; border-radius: 3px; margin: 1rem; padding: 1rem; }
          .nestedCard { margin: 0; flex: 1 0 0; }
          .row { display: flex; justify-content: space-between; margin-right: -8px; }
          .col { display: flex; flex: 1 0 0; flex-direction: column; margin-right: 8px; }
        `}
      </style>
      <h1>HTML File Comparison</h1>
      <p>Select exactly two HTML files to compare their rendered contents.</p>

      <input
        type="file"
        accept=".html"
        multiple
        onChange={handleFileUpload}
        style={{ marginBottom: '20px' }}
      />
      
      {isLoading && (
        <div className="my-4">
          <div className="w-full h-2 bg-gray-200 rounded">
            <div className="h-2 bg-blue-600 rounded animate-pulse"></div>
          </div>
          <p className="text-sm text-gray-600">Processing files...</p>
        </div>
      )}

      {error && (
        <div className="text-red-500 my-4">
          {error}
        </div>
      )}

      {executionTime > 0 && !isLoading && (
        <div className="text-sm text-gray-600 my-2">
          Process completed in {executionTime.toFixed(2)} seconds
        </div>
      )}

      {diffContent && (
        <div className="mt-4 p-4 border rounded">
          <div dangerouslySetInnerHTML={{ __html: diffContent }} />
          <button
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
            onClick={downloadDiff}
          >
            Download Diff
          </button>
        </div>
      )}
    </div>
  );
};

export default App;
