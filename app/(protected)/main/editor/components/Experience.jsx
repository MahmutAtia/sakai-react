"use client";
import React, { useRef } from 'react';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { Button } from 'primereact/button';
import { Calendar } from 'primereact/calendar';
import { Toast } from 'primereact/toast';
import { useResume } from '../ResumeContext';
import AIAssistant from './AIAssistant';

const Experience = ({ sectionKey }) => {
    const toast = useRef(null);
    const { data, setData, toggleEditMode, editMode } = useResume();
    const experiences = data[sectionKey] || [];
    const historyRef = useRef([]);

    const isItemEditing = (index) => editMode[sectionKey]?.[index];

    const toggleItemEditMode = (index) => {
        toggleEditMode(sectionKey, index);
    };

    const handleInputChange = (index, field, value) => {
        const newData = { ...data };
        newData[sectionKey][index][field] = value;
        setData(newData);
    };

    const addExperience = () => {
        const newExperience = {
            company: '',
            position: '',
            startDate: '',
            endDate: '',
            description: ''
        };
        const newData = { ...data };
        newData[sectionKey] = [...experiences, newExperience];
        setData(newData);
        // Automatically enable editing for new item
        toggleItemEditMode(experiences.length);
    };

    const handleAIUpdate = async (index, updatedData) => {
        try {
            // Save current state to history
            const prevState = { ...data[sectionKey][index] };
            historyRef.current.push(JSON.stringify(prevState));

            // Update the specific experience item with AI response
            const newData = { ...data };
            // Assuming API returns { company, position, startDate, endDate, description }
            newData[sectionKey][index] = {
                ...newData[sectionKey][index],
                ...updatedData
            };

            setData(newData);

            toast.current.show({
                severity: 'success',
                summary: 'AI Updated',
                detail: 'Experience has been updated'
            });
        } catch (error) {
            console.error('AI Update Error:', error);
            toast.current.show({
                severity: 'error',
                summary: 'Update Failed',
                detail: 'Failed to update experience'
            });
        }
    };
    return (
        <div className="surface-card p-4 border-round-xl shadow-2">
            <Toast ref={toast} />

            <div className="flex align-items-center justify-content-between border-bottom-1 surface-border pb-3">
                <h2 className="text-xl font-semibold m-0">Experience</h2>
                <Button
                    icon="pi pi-plus"
                    className="p-button-rounded p-button-success"
                    onClick={addExperience}
                    tooltip="Add Experience"
                />
            </div>

            <div className="flex flex-column gap-4 mt-3">
                {experiences.map((exp, index) => (
                    <div key={index} className="surface-card p-3 border-1 surface-border border-round">
                        <div className="flex justify-content-between align-items-center mb-3">
                            {isItemEditing(index) ? (
                                <div className="flex gap-2 align-items-center">
                                    <AIAssistant
                                        sectionData={exp}
                                        onUpdate={(updatedData) => handleAIUpdate(index, updatedData)}
                                    />
                                    <Button
                                        icon="pi pi-times"
                                        className="p-button-rounded p-button-text"
                                        onClick={() => toggleItemEditMode(index)}
                                    />
                                </div>
                            ) : (
                                <Button
                                    icon="pi pi-pencil"
                                    className="p-button-rounded p-button-text"
                                    onClick={() => toggleItemEditMode(index)}
                                />
                            )}
                        </div>

                        {isItemEditing(index) ? (
                            <div className="flex flex-column gap-3">
                                <InputText
                                    placeholder="Company"
                                    value={exp.company}
                                    onChange={(e) => handleInputChange(index, 'company', e.target.value)}
                                    className="w-full"
                                />
                                <InputText
                                    placeholder="Position"
                                    value={exp.position}
                                    onChange={(e) => handleInputChange(index, 'position', e.target.value)}
                                    className="w-full"
                                />
                                <div className="flex gap-2">
                                    <Calendar
                                        placeholder="Start Date"
                                        value={exp.startDate}
                                        onChange={(e) => handleInputChange(index, 'startDate', e.value)}
                                        className="flex-1"
                                        monthNavigator
                                        yearNavigator
                                        yearRange="2000:2030"
                                    />
                                    <Calendar
                                        placeholder="End Date"
                                        value={exp.endDate}
                                        onChange={(e) => handleInputChange(index, 'endDate', e.value)}
                                        className="flex-1"
                                        monthNavigator
                                        yearNavigator
                                        yearRange="2000:2030"
                                    />
                                </div>
                                <InputTextarea
                                    placeholder="Description"
                                    value={exp.description}
                                    onChange={(e) => handleInputChange(index, 'description', e.target.value)}
                                    rows={3}
                                    className="w-full"
                                />
                            </div>
                        ) : (
                            <div className="flex flex-column gap-2">
                                <div className="flex justify-content-between">
                                    <span className="font-semibold">{exp.company}</span>
                                    <span className="text-500">
                                        {exp.startDate} - {exp.endDate}
                                    </span>
                                </div>
                                <span className="text-primary">{exp.position}</span>
                                <p className="text-700 line-height-3">{exp.description}</p>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Experience;
