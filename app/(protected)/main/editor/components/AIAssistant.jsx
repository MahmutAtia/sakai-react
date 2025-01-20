import React, { useState } from 'react';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Dialog } from 'primereact/dialog';
import { Tooltip } from 'primereact/tooltip';
import './styles.css';

const AIAssistant = ({ sectionData, sectionTitle, onUpdate }) => {
  const [showDialog, setShowDialog] = useState(false);
  const [prompt, setPrompt] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async () => {
    if (!prompt.trim()) return;
    setIsProcessing(true);
    try {
      const response = await fetch('http://localhost:8000/api/resumes/edit/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, sectionData, sectionTitle }),
      });
      const data = await response.json();
      console.log(data);
      onUpdate(data);
      setPrompt('');
      setShowDialog(false); // Close the dialog after submission
    } catch (error) {
      console.error(error);
    }
    setIsProcessing(false);
  };

  const renderFooter = () => {
    return (
      <div>
        <Button
          label="Cancel"
          icon="pi pi-times"
          className="p-button-text p-button-danger"
          onClick={() => setShowDialog(false)}
          disabled={isProcessing}
        />
        <Button
          label="Submit"
          icon="pi pi-check"
          className="p-button-success"
          onClick={handleSubmit}
          disabled={isProcessing || !prompt.trim()}
          loading={isProcessing}
        />
      </div>
    );
  };

  return (
    <div className="flex align-items-center gap-2">
      <Button
        icon={isProcessing ? "pi pi-spin pi-spinner" : "pi pi-user-edit"}
        className={`p-button-rounded p-button-lg p-button-help shadow-3 hover:shadow-5 transition-all transition-duration-300`}
        onClick={() => setShowDialog(true)}
        disabled={isProcessing}
        tooltip="Ask AI for help"
        tooltipOptions={{ position: 'top' }}
      />

      <Dialog
        header="AI Assistant"
        visible={showDialog}
        style={{ width: '500px' }}
        footer={renderFooter()}
        onHide={() => setShowDialog(false)}
        dismissableMask={!isProcessing} // Prevent closing dialog while processing
        closable={!isProcessing} // Prevent closing dialog while processing
      >
        <div className="flex flex-column gap-3">
          <span
            className="p-input-icon-right w-full"
            data-pr-tooltip="Ask AI for suggestions. Press Enter to submit"
            data-pr-position="top"
          >
            <InputText
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Ask AI for suggestions..."
              className="p-inputtext-lg w-full border-round-xl shadow-2 transition-all transition-duration-300 hover:shadow-4"
              onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
              autoFocus
            />
          </span>
          <Tooltip target="[data-pr-tooltip]" position="top" />
        </div>
      </Dialog>
    </div>
  );
};

export default AIAssistant;
