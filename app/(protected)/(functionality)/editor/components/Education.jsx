"use client";
import React, { useRef } from "react";
import { InputText } from "primereact/inputtext";
import { Calendar } from "primereact/calendar";
import { Button } from "primereact/button";
import { Toast } from 'primereact/toast';
import { useResume } from "../ResumeContext";
import AIAssistant from "./AIAssistant";

const Education = ({ sectionKey }) => {
    const toast = useRef(null);
    const { data, setData, toggleEditMode, editMode } = useResume();
    const education = data[sectionKey] || [];
    const historyRef = useRef([]);

    const isEditing = (id) => editMode[sectionKey]?.[id];

    const handleInputChange = (index, field, e) => {
        const newData = { ...data };
        newData[sectionKey][index][field] = e.target.value;
        setData(newData);
    };

    const handleDateChange = (index, field, e) => {
        const newData = { ...data };
        newData[sectionKey][index][field] = e.value ? e.value.toISOString() : null;
        setData(newData);
    };

    const addEducation = () => {
        const newEducation = {
            institution: '',
            area: '',
            studyType: '',
            startDate: '',
            endDate: '',
            gpa: ''
        };
        const newData = { ...data };
        newData[sectionKey] = [...education, newEducation];
        setData(newData);
        toggleEditMode(sectionKey, education.length);
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
            detail: 'Education entry updated'
        });
    };

    return (
        <div className="surface-card p-4 border-round-xl shadow-2">
            <Toast ref={toast} />

            <div className="flex align-items-center justify-content-between border-bottom-1 surface-border pb-3">
                <h2 className="text-xl font-semibold m-0">Education</h2>
                <Button
                    icon="pi pi-plus"
                    className="p-button-rounded p-button-success"
                    onClick={addEducation}
                    tooltip="Add Education"
                />
            </div>

            <div className="flex flex-column gap-4 mt-3">
                {education.map((edu, index) => (
                    <div key={index} className="surface-card p-3 border-1 surface-border border-round">
                        <div className="flex justify-content-between align-items-center mb-3">
                            {isEditing(index) ? (
                                <div className="flex gap-2 align-items-center">
                                    <AIAssistant
                                        sectionData={edu}
                                        onUpdate={(updatedData) => handleAIUpdate(index, updatedData)}
                                    />
                                    <Button
                                        icon="pi pi-times"
                                        className="p-button-rounded p-button-text"
                                        onClick={() => toggleEditMode(sectionKey, index)}
                                    />
                                </div>
                            ) : (
                                <Button
                                    icon="pi pi-pencil"
                                    className="p-button-rounded p-button-text"
                                    onClick={() => toggleEditMode(sectionKey, index)}
                                />
                            )}
                        </div>

                        {isEditing(index) ? (
                            <div className="flex flex-column gap-3">
                                <InputText
                                    placeholder="Institution"
                                    value={edu.institution}
                                    onChange={(e) => handleInputChange(index, 'institution', e)}
                                    className="w-full"
                                />
                                <div className="flex gap-2">
                                    <InputText
                                        placeholder="Area of Study"
                                        value={edu.area}
                                        onChange={(e) => handleInputChange(index, 'area', e)}
                                        className="flex-1"
                                    />
                                    <InputText
                                        placeholder="Degree"
                                        value={edu.studyType}
                                        onChange={(e) => handleInputChange(index, 'studyType', e)}
                                        className="flex-1"
                                    />
                                </div>
                                <div className="flex gap-2">
                                    <Calendar
                                        placeholder="Start Date"
                                        value={edu.startDate ? new Date(edu.startDate) : null}
                                        onChange={(e) => handleDateChange(index, 'startDate', e)}
                                        className="flex-1"
                                        monthNavigator
                                        yearNavigator
                                        yearRange="1990:2030"
                                    />
                                    <Calendar
                                        placeholder="End Date"
                                        value={edu.endDate ? new Date(edu.endDate) : null}
                                        onChange={(e) => handleDateChange(index, 'endDate', e)}
                                        className="flex-1"
                                        monthNavigator
                                        yearNavigator
                                        yearRange="1990:2030"
                                    />
                                </div>
                                <InputText
                                    placeholder="GPA"
                                    value={edu.gpa}
                                    onChange={(e) => handleInputChange(index, 'gpa', e)}
                                    className="w-full"
                                />
                            </div>
                        ) : (
                            <div className="flex flex-column gap-2">
                                <div className="flex justify-content-between">
                                    <span className="font-semibold">{edu.institution}</span>
                                    <span className="text-500">
                                        {edu.startDate && new Date(edu.startDate).getFullYear()} -
                                        {edu.endDate && new Date(edu.endDate).getFullYear()}
                                    </span>
                                </div>
                                <span className="text-primary">{edu.studyType} in {edu.area}</span>
                                {edu.gpa && <span className="text-700">GPA: {edu.gpa}</span>}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Education;
