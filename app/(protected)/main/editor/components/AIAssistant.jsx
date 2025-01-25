// AIAssistant.jsx
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Tooltip } from 'primereact/tooltip';

import React from 'react';

const AIAssistant = ({ prompt, setPrompt, onSubmit, isProcessing }) => {
    return (
        <div className="p-fluid flex flex-column gap-3">
            <div className="flex align-items-center gap-2">
                <span className="p-input-icon-left w-full">
                    <i className="pi pi-comment text-color-secondary" />
                    <InputText
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        placeholder="Ask AI to improve this section..."
                        className="w-full"
                        onKeyDown={(e) => e.key === 'Enter' && onSubmit()}
                        disabled={isProcessing}
                    />
                </span>
                <Tooltip target=".ai-assistant-button" position="left" />

                <Button
                    icon={isProcessing ? 'pi pi-spin pi-spinner' : 'pi pi-send'}
                    className="ai-assistant-button p-button-rounded p-button-help border-circle"
                    onClick={onSubmit}
                    disabled={!prompt.trim() || isProcessing}
                    tooltip="Submit AI Request"
                />
            </div>

            {prompt && (
                <div className="p-3 surface-50 border-round">
                    <small className="text-color-secondary">
                        AI suggestions will appear here after processing...
                    </small>
                </div>
            )}
        </div>
    );
};

export default AIAssistant;
