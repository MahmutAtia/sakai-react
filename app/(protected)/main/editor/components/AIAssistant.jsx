import React from "react";
import { InputText} from "primereact/inputtext";
import { Button } from "primereact/button";
import { Tooltip } from "primereact/tooltip";

const AIAssistant = ({ prompt = "", setPrompt, onSubmit, isProcessing }) => {
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
                        onKeyDown={(e) => e.key === "Enter" && onSubmit()}
                        disabled={isProcessing}
                    />
                </span>
                <Tooltip target=".ai-assistant-button" position="left" />

                <Button
                    icon={isProcessing ? "pi pi-spin pi-spinner" : "pi pi-send"}
                    className="ai-assistant-button p-button-rounded p-button-help border-circle"
                    onClick={onSubmit}
                    disabled={!prompt?.trim() || isProcessing} // Safely handle undefined prompt
                    tooltip="Submit AI Request"
                />
            </div>


        </div>
    );
};

export default AIAssistant;
