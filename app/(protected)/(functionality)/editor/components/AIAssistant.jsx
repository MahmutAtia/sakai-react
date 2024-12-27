import React, { useState } from 'react';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import './styles.css';

const AIAssistant = ({ sectionData, onUpdate }) => {
  const [showInput, setShowInput] = useState(false);
  const [prompt, setPrompt] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async () => {
    if (!prompt.trim()) return;
    setIsProcessing(true);
    try {
      const response = await fetch('http://localhost:8000/api/resumes/edit/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, sectionData })
      });
      const data = await response.json();
      onUpdate(data);
      setPrompt('');
      setShowInput(false);
    } catch (error) {
      console.error(error);
    }
    setIsProcessing(false);
  };

  return (
    <div className="flex align-items-center gap-2">
      {showInput && (
        <div className="flex gap-2 animate__animated animate__fadeIn">
          <InputText
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Ask AI..."
            className="p-inputtext-sm surface-200 border-round-2xl transition-all transition-duration-300 hover:surface-100"
            onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
          />
        </div>
      )}
      <Button
        icon={
          isProcessing
            ? "pi pi-spin pi-spinner"
            : showInput
              ? "pi pi-arrow-right"
              : "pi pi-reddit"
        }
        className={`p-button-rounded p-button-text ${isProcessing ? 'p-button-info' : 'p-button-help'} transition-colors transition-duration-300 hover:shadow-4`}
        onClick={() => !isProcessing && setShowInput(!showInput)}
        disabled={isProcessing}
      />
    </div>
  );
}

export default AIAssistant;
