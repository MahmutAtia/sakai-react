"use client";
import React, { useState } from 'react';
import 'diff2html/bundles/css/diff2html.min.css';
import { Diff2HtmlUI } from 'diff2html/lib/ui/js/diff2html-ui';
import { html as beautifyHtml } from 'js-beautify';
import { marked } from 'marked';

const App = () => {
  const [file1Content, setFile1Content] = useState('');
  const [file2Content, setFile2Content] = useState('');
  const [processing, setProcessing] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [diffGenerated, setDiffGenerated] = useState(false);
  const [error, setError] = useState('');

  const handleFileUpload = async (e) => {
    setError('');
    const files = e.target.files;

    if (files.length !== 2) {
      setError('Please upload exactly two files.');
      return;
    }

    try {
      const file1 = await files[0].text();
      const file2 = await files[1].text();

      const fileType1 = files[0].name.split('.').pop().toLowerCase();
      const fileType2 = files[1].name.split('.').pop().toLowerCase();

      // Preprocess files based on their type
      const processedFile1 = preprocessFileContent(file1, fileType1);
      const processedFile2 = preprocessFileContent(file2, fileType2);

      setFile1Content(processedFile1);
      setFile2Content(processedFile2);
      setDiffGenerated(false);
    } catch (err) {
      setError('Error reading files. Please try again.');
    }
  };

  const preprocessFileContent = (content, fileType) => {
    switch (fileType) {
      case 'html':
        return beautifyHtml(content, { indent_size: 2 });
      case 'md':
      case 'markdown':
        return marked(content);
      default:
        return content; // Treat as plain text
    }
  };

  const handleStartProcessing = () => {
    if (!file1Content || !file2Content) {
      setError('Please upload two files before starting the process.');
      return;
    }

    setProcessing(true);
    setError('');

    const diffString = `
diff --git a/file1 b/file2
--- a/file1
+++ b/file2
@@ -1,999 +1,999 @@
${file1Content
  .split('\n')
  .map((line) => `-${line}`)
  .join('\n')}
${file2Content
  .split('\n')
  .map((line) => `+${line}`)
  .join('\n')}`;

    const targetElement = document.getElementById('diff-container');
    const diff2htmlUi = new Diff2HtmlUI(targetElement, diffString, {
      drawFileList: true,
      matching: 'lines',
      outputFormat: 'side-by-side',
      highlight: true,
      colorScheme: darkMode ? 'dark' : 'light',
    });

    diff2htmlUi.draw();
    diff2htmlUi.highlightCode();

    setProcessing(false);
    setDiffGenerated(true);
  };

  const handleKillProcess = () => {
    setProcessing(false);
    setError('Process has been stopped.');
    const targetElement = document.getElementById('diff-container');
    targetElement.innerHTML = ''; // Clear the diff container
    setDiffGenerated(false);
  };

  const handleSaveDiff = () => {
    const diffHtml = document.getElementById('diff-container').innerHTML;
    const blob = new Blob([diffHtml], { type: 'text/html' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'file-diff.html';
    link.click();
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', margin: '20px' }}>
      <h1>File Comparison Tool</h1>
      <p>Select exactly two files (HTML, Markdown, or text) to compare their contents.</p>

      <input
        type="file"
        accept=".html,.md,.markdown,.txt"
        multiple
        onChange={handleFileUpload}
        style={{ marginBottom: '20px' }}
        disabled={processing}
      />

      {error && <p style={{ color: 'red' }}>{error}</p>}

      <div style={{ marginTop: '20px' }}>
        <button
          onClick={handleStartProcessing}
          style={{
            marginRight: '10px',
            padding: '10px 20px',
            backgroundColor: '#0078d7',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
          }}
          disabled={processing || diffGenerated}
        >
          Start Processing
        </button>
        <button
          onClick={handleKillProcess}
          style={{
            marginRight: '10px',
            padding: '10px 20px',
            backgroundColor: '#d70000',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
          }}
          disabled={!processing}
        >
          Kill Process
        </button>
        <button
          onClick={handleSaveDiff}
          style={{
            marginRight: '10px',
            padding: '10px 20px',
            backgroundColor: '#28a745',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
          }}
          disabled={!diffGenerated}
        >
          Save Diff
        </button>
        <button
          onClick={toggleDarkMode}
          style={{
            padding: '10px 20px',
            backgroundColor: darkMode ? '#6c757d' : '#f0ad4e',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
          }}
        >
          Toggle {darkMode ? 'Light' : 'Dark'} Mode
        </button>
      </div>

      {processing && (
        <div style={{ marginTop: '20px', fontWeight: 'bold', color: '#0078d7' }}>
          Processing... Please wait.
        </div>
      )}

      <div
        id="diff-container"
        style={{
          border: '1px solid #ddd',
          borderRadius: '5px',
          padding: '20px',
          backgroundColor: darkMode ? '#333' : '#f9f9f9',
          color: darkMode ? '#fff' : '#000',
          overflowX: 'auto',
          marginTop: '20px',
        }}
      />
    </div>
  );
};

export default App;
