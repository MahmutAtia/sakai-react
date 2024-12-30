"use client";
import React, { useRef } from 'react';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { useResume } from '../ResumeContext';
import AIAssistant from './AIAssistant';

const Skills = ({ sectionKey }) => {
    const toast = useRef(null);
    const { data, setData, toggleEditMode, editMode } = useResume();
    const skills = data[sectionKey] || [];
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

    const addSkill = () => {
        const newSkill = {
            name: '',
            level: '',
            keywords: []
        };
        const newData = { ...data };
        newData[sectionKey] = [...skills, newSkill];
        setData(newData);
        toggleItemEditMode(skills.length);
    };

    const removeSkill = (index) => {
        const newData = { ...data };
        newData[sectionKey].splice(index, 1);
        setData(newData);
    };

    const addKeyword = (skillIndex) => {
        const newData = { ...data };
        newData[sectionKey][skillIndex].keywords.push('');
        setData(newData);
    };

    const removeKeyword = (skillIndex, keywordIndex) => {
        const newData = { ...data };
        newData[sectionKey][skillIndex].keywords.splice(keywordIndex, 1);
        setData(newData);
    };

    const handleAIUpdate = (index, updatedData) => {
        const newData = { ...data };
        newData[sectionKey][index] = updatedData;
        setData(newData);
        toast.current.show({
            severity: 'success',
            summary: 'AI Updated',
            detail: 'Skill has been updated'
        });
    };

    return (
        <div className="surface-card p-4 border-round-xl shadow-2">
            <Toast ref={toast} />

            <div className="flex align-items-center justify-content-between border-bottom-1 surface-border pb-3">
                <h2 className="text-xl font-semibold m-0">Skills</h2>
                <Button
                    icon="pi pi-plus"
                    className="p-button-rounded p-button-success"
                    onClick={addSkill}
                    tooltip="Add Skill"
                />
            </div>

            <div className="flex flex-column gap-4 mt-3">
                {skills.map((skill, index) => (
                    <div key={index} className="surface-card p-3 border-1 surface-border border-round">
                        <div className="flex justify-content-between align-items-center mb-3">
                            {isItemEditing(index) ? (
                                <div className="flex gap-2 align-items-center">
                                    <AIAssistant
                                        sectionData={skill}
                                        onUpdate={(updatedData) => handleAIUpdate(index, updatedData)}
                                    />
                                    <Button
                                        icon="pi pi-times"
                                        className="p-button-rounded p-button-text"
                                        onClick={() => toggleItemEditMode(index)}
                                    />
                                    <Button
                                        icon="pi pi-trash"
                                        className="p-button-rounded p-button-danger p-button-text"
                                        onClick={() => removeSkill(index)}
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
                                    placeholder="Skill Category"
                                    value={skill.name}
                                    onChange={(e) => handleInputChange(index, 'name', e.target.value)}
                                    className="w-full"
                                />
                                <InputText
                                    placeholder="Level"
                                    value={skill.level}
                                    onChange={(e) => handleInputChange(index, 'level', e.target.value)}
                                    className="w-full"
                                />
                                <div className="flex flex-column gap-2">
                                    {skill.keywords.map((keyword, keywordIndex) => (
                                        <div key={keywordIndex} className="flex gap-2">
                                            <InputText
                                                placeholder="Keyword"
                                                value={keyword}
                                                onChange={(e) => handleInputChange(index, 'keywords', [
                                                    ...skill.keywords.slice(0, keywordIndex),
                                                    e.target.value,
                                                    ...skill.keywords.slice(keywordIndex + 1)
                                                ])}
                                                className="flex-1"
                                            />
                                            <Button
                                                icon="pi pi-minus"
                                                className="p-button-rounded p-button-danger p-button-text"
                                                onClick={() => removeKeyword(index, keywordIndex)}
                                            />
                                        </div>
                                    ))}
                                    <Button
                                        icon="pi pi-plus"
                                        className="p-button-rounded p-button-text align-self-end"
                                        onClick={() => addKeyword(index)}
                                        tooltip="Add Keyword"
                                    />
                                </div>
                            </div>
                        ) : (
                            <div className="flex flex-column gap-2">
                                <div className="flex justify-content-between">
                                    <span className="font-semibold">{skill.name}</span>
                                    <span className="text-500">{skill.level}</span>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {skill.keywords.map((keyword, keywordIndex) => (
                                        <span key={keywordIndex} className="surface-200 text-700 border-round px-2 py-1">
                                            {keyword}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Skills;
