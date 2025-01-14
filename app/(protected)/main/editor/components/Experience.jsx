"use client";
import React, { useRef } from 'react';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { Button } from 'primereact/button';
import { Calendar } from 'primereact/calendar';
import { Toast } from 'primereact/toast';
import { useResume } from '../ResumeContext';
import AIAssistant from './AIAssistant';
import SectionWrapper from './SectionWrapper';
import ItemWrapper from './ItemWrapper';

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


    const handleUndo = (index) => {
        if (historyRef.current.length > 0) {
            const prevState = JSON.parse(historyRef.current.pop());
            const newData = { ...data };
            newData[sectionKey][index] = prevState;
            setData(newData);

            toast.current.show({
                severity: 'info',
                summary: 'Undo',
                detail: 'Previous state restored'
            });
        }
    };


    return (<SectionWrapper title="Experience" onAdd={addExperience} toast={toast}>
        {experiences.map((exp, index) => (
            <ItemWrapper
                key={index}
                isEditing={isItemEditing(index)}
                onEdit={() => toggleEditMode(sectionKey, index)}
                onUndo={() => handleUndo(index)}
                canUndo={historyRef.current.length > 0}
                onAIUpdate={(updatedData) => handleAIUpdate(index, updatedData)}
                sectionData={exp}
                editContent={
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
                }
                viewContent={
                    <div className="flex flex-column gap-2">
                    <div className="flex justify-content-between">
                        <span className="font-semibold">{exp.company}</span>
                        <span className="text-500">
                            {exp.startDate ? new Date(exp.startDate).toLocaleDateString() : ''} -
                            {exp.endDate ? new Date(exp.endDate).toLocaleDateString() : ''}
                        </span>
                    </div>
                    <span className="text-primary">{exp.position}</span>
                    <div style={{ whiteSpace: 'pre-line' }} className="text-700 line-height-4">{exp.description}</div>
                </div>
                }
            />
        ))}
    </SectionWrapper>
);


};


export default Experience;
