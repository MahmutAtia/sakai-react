"use client";
import React, { useRef } from "react";
import { InputTextarea } from "primereact/inputtextarea";
import { Button } from "primereact/button";
import { Toast } from 'primereact/toast';
import { useResume } from "../ResumeContext";
import AIAssistant from "./AIAssistant";

const Summary = ({ sectionKey }) => {
    const toast = useRef(null);
    const { data, setData, toggleEditMode, editMode } = useResume();
    const summary = data[sectionKey];
    const isEditing = editMode[sectionKey]?.all; // Match other components
    const historyRef = useRef([]);

    const handleInputChange = (e) => {
        saveToHistory();
        const newData = { ...data };
        newData[sectionKey] = e.target.value;
        setData(newData);
    };

    const saveToHistory = () => {
        historyRef.current.push(JSON.stringify(data[sectionKey]));
    };

    const handleUndo = () => {
        if (historyRef.current.length > 0) {
            const previousState = JSON.parse(historyRef.current.pop());
            const newData = { ...data };
            newData[sectionKey] = previousState;
            setData(newData);
            toast.current.show({
                severity: 'info',
                summary: 'Undo',
                detail: 'Previous state restored'
            });
        }
    };

    const handleAIUpdate = (updatedData) => {
        saveToHistory();
        const newData = { ...data };
        newData[sectionKey] = updatedData;
        setData(newData);
        toast.current.show({
            severity: 'success',
            summary: 'AI Updated',
            detail: 'Summary has been updated'
        });
    };

    return (
        <div className="surface-card p-4 border-round-xl shadow-2">
            <Toast ref={toast} />

            <div className="flex align-items-center justify-content-between border-bottom-1 surface-border pb-3">
                <h2 className="text-xl font-semibold m-0">
                    {sectionKey.charAt(0).toUpperCase() + sectionKey.slice(1)}
                </h2>
                <div className="flex gap-2">
                    {isEditing && (
                        <>
                            {historyRef.current.length > 0 && (
                                <Button
                                    icon="pi pi-undo"
                                    className="p-button-rounded p-button-text"
                                    onClick={handleUndo}
                                    tooltip="Undo"
                                />
                            )}
                            <AIAssistant
                                sectionTitle={sectionKey.charAt(0).toUpperCase() + sectionKey.slice(1)}
                                sectionData={summary}
                                onUpdate={handleAIUpdate}
                            />
                        </>
                    )}
                    <Button
                        icon={isEditing ? "pi pi-times" : "pi pi-pencil"}
                        className="p-button-rounded p-button-text"
                        onClick={() => toggleEditMode(sectionKey)}
                    />
                </div>
            </div>

            <div className="mt-3">
                {isEditing ? (
                    <InputTextarea
                        value={summary}
                        onChange={handleInputChange}
                        rows={5}
                        className="w-full"
                        autoResize
                    />
                ) : (
                    <p className="text-700 line-height-3 m-0">{summary}</p>
                )}
            </div>
        </div>
    );
};

export default Summary;
