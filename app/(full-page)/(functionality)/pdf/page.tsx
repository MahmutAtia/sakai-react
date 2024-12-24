"use client";
import React, { useState, useEffect } from 'react';
import * as pdfjsLib from 'pdfjs-dist';
import EditableResumeTemplate from './component';
import { ResumeData } from './component';

const FileViewer = () => {

  
  const [resume, setResume] = useState<ResumeData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const initPdfJs = async () => {
      const pdfjsWorker = await import('pdfjs-dist/build/pdf.worker.mjs');
      pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker;
    };
    initPdfJs();
  }, []);

  const readTextFile = async (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target?.result as string);
      reader.onerror = (e) => reject(e);
      reader.readAsText(file);
    });
  };

  const extractTextFromPdf = async (file: File): Promise<string> => {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    let fullText = '';

    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      const pageText = textContent.items.map((item: any) => item.str).join(' ');
      fullText += pageText + '\n';
    }
    return fullText;
  };

  const handleFile = async (file: File) => {
    setLoading(true);
    setError('');
    
    try {
      let content = '';
      if (file.type === 'application/pdf') {
        content = await extractTextFromPdf(file);
      } else if (file.type === 'text/plain' || file.name.endsWith('.txt') || file.name.endsWith('.doc')) {
        content = await readTextFile(file);
      } else {
        throw new Error('Unsupported file type');
      }
    
    const resumeContent = await handleGenerateResume(content);
    setResume(resumeContent.data);
    console.log("here",resume);

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to read file');
    } finally {
      setLoading(false);
    }
  };

  // # send request to server http://localhost:8000/api/resumes/generate/ with {input : input_text : content}
  interface ResumeResponse {
    data: any;
  }
  
  const handleGenerateResume = async (fileContent: any): Promise<ResumeResponse> => {
    const response = await fetch('http://localhost:8000/api/resumes/generate/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({input:{ input_text: fileContent }})
    });
    const data = await response.json();
    return data;
  }


  if( resume && resume.personalInfo) {
    console.log(resume.personalInfo);
  }

  return (
    <div className="p-4">
      <input
        type="file"
        accept=".pdf,.txt,.doc"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) {
            handleFile(file);
          }
        }}
        className="mb-4"
      />
      
      {error && (
        <div className="text-red-500 mb-4">
          {error}
        </div>
      )}

      {loading && (
        <div className="mb-4">
          <div>Loading...</div>
        </div>
      )}

      {resume && (
        <EditableResumeTemplate initialData={resume} />
      )}
    </div>
  );
};


export default FileViewer;

