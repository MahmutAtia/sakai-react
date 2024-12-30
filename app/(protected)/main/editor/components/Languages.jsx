"use client";
import React, { useRef } from "react";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Toast } from 'primereact/toast';
import { useResume } from "../ResumeContext";
import AIAssistant from "./AIAssistant";

const Languages = ({ sectionKey }) => {
    const toast = useRef(null);
    const { data, setData, toggleEditMode, editMode } = useResume();
    const languages = data[sectionKey] || [];
    const historyRef = useRef([]);

    const isEditing = (id) => editMode[sectionKey]?.[id];

    const handleInputChange = (index, field, e) => {
        const newData = { ...data };
        newData[sectionKey][index][field] = e.target.value;
        setData(newData);
    };

    const addLanguage = () => {
        const newLanguage = {
            language: '',
            fluency: ''
        };
        const newData = { ...data };
        newData[sectionKey] = [...languages, newLanguage];
        setData(newData);
        toggleEditMode(sectionKey, languages.length);
    };

    const handleAIUpdate = (index, updatedData) => {
        const prevState = { ...data[sectionKey][index] };
        historyRef.current.push(JSON.stringify(prevState));

        const newData = { ...data };
        newData[sectionKey][index] = updatedData;
        setData(newData);

        toast.current.show({
            severity: 'success',
            summary: 'AI Updated',
            detail: 'Language updated successfully'
        });
    };

    return (
        <div className="surface-card p-3 border-round-xl shadow-2">
            <Toast ref={toast} />

            <div className="flex align-items-center justify-content-between border-bottom-1 surface-border pb-2">
                <h2 className="text-lg font-medium m-0">Languages</h2>
                <Button
                    icon="pi pi-plus"
                    className="p-button-rounded p-button-success p-button-sm"
                    onClick={addLanguage}
                    tooltip="Add Language"
                />
            </div>

            <div className="grid mt-2">
                {languages.map((lang, index) => (
                    <div key={index} className="col-6">
                        <div className="surface-card p-2 border-1 surface-border border-round m-1 transition-colors transition-duration-150 hover:surface-hover">
                            <div className="flex justify-content-end">
                                {isEditing(index) ? (
                                    <div className="flex gap-1 align-items-center">
                                        <AIAssistant
                                            sectionData={lang}
                                            onUpdate={(updatedData) => handleAIUpdate(index, updatedData)}
                                        />
                                        <Button
                                            icon="pi pi-times"
                                            className="p-button-rounded p-button-text p-button-sm"
                                            onClick={() => toggleEditMode(sectionKey, index)}
                                        />
                                    </div>
                                ) : (
                                    <Button
                                        icon="pi pi-pencil"
                                        className="p-button-rounded p-button-text p-button-sm"
                                        onClick={() => toggleEditMode(sectionKey, index)}
                                    />
                                )}
                            </div>

                            {isEditing(index) ? (
                                <div className="flex flex-column gap-2">
                                    <InputText
                                        placeholder="Language"
                                        value={lang.language}
                                        onChange={(e) => handleInputChange(index, 'language', e)}
                                        className="w-full p-inputtext-sm"
                                    />
                                    <InputText
                                        placeholder="Fluency Level"
                                        value={lang.fluency}
                                        onChange={(e) => handleInputChange(index, 'fluency', e)}
                                        className="w-full p-inputtext-sm"
                                    />
                                </div>
                            ) : (
                                <div className="flex align-items-center justify-content-between px-2">
                                    <span className="font-medium text-base">{lang.language}</span>
                                    <span className="text-500 text-sm">{lang.fluency}</span>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
export default Languages;
