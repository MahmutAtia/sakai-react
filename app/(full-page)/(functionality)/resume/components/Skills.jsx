"use client";
import React from 'react';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { useResume } from '../ResumeContext';

const Skills = ({ sectionKey }) => {
    const { data, setData, addSectionItem, removeSectionItem, toggleEditMode, editMode } = useResume();
    const skillsData = data[sectionKey];
    const isEditing = (id) => editMode[sectionKey] && (editMode[sectionKey][id] || editMode[sectionKey].all);
    const handleInputChange = (index, field, e) => {
        const newData = JSON.parse(JSON.stringify(data));
        newData[sectionKey][index][field] = e.target.value;
        setData(newData);
    };

    const handleKeywordsChange = (index, keywordIndex, e) => {
        const newData = JSON.parse(JSON.stringify(data));
        newData[sectionKey][index].keywords[keywordIndex] = e.target.value;
        setData(newData);
    };

    const addKeyword = (index) => {
        const newData = JSON.parse(JSON.stringify(data));
        newData[sectionKey][index].keywords.push("");
        setData(newData);
    };

    const removeKeyword = (index, keywordIndex) => {
        const newData = JSON.parse(JSON.stringify(data));
        newData[sectionKey][index].keywords.splice(keywordIndex, 1);
        setData(newData);
    };

    return (
        <div>
            {/* Skills Header and Add Button */}
            <div className="mb-4">
                <h2 className="text-xl font-semibold">Skills</h2>   
                <Button onClick={() => addSectionItem(sectionKey)} icon="pi pi-plus" className="p-button-text" />
            </div>

            {/* Skills Items */}
            {skillsData.map((skill, index) => (
                <div key={skill.id} className="mb-4">
                    {/* Skill Header */}
                    <div className="flex justify-between items-center mb-2">
                        < h3 className="text-lg font-semibold"> {skill.name} </h3>
                        <div>
                            <Button icon="pi pi-pencil" className="p-button-rounded p-button-text p-button-success" onClick={() => toggleEditMode(sectionKey, skill.id)} />
                            <Button icon="pi pi-trash" className="p-button-rounded p-button-text p-button-danger" onClick={() => removeSectionItem(sectionKey, index, skill.id)} />
                        </div>
                    </div>

                    {/* Skill Details display mode */}
                    {!isEditing(skill.id) && (
                        <div className="flex flex-col gap-2">
                            <div className="flex items-center gap-2">

                                <span className="text-gray-600">
                                    {skill.keywords?.map((keyword, keywordIndex) => (
                                        <span key={keywordIndex} className="text-gray-600">
                                            {keyword}
                                        </span>
                                    ))}
                                </span>
                            </div>
                        </div>
                    )}



                    {/* Skill Details Edit it should be reusable component */}
                    {isEditing(skill.id) && (
                        <div className="flex items-center gap-2">
                            <label className="text-gray-600">Skill Name </label>
                            <InputText value={skill.name} onChange={(e) => handleInputChange(index, "name", e)} />
                            <Button icon="pi pi-plus" onClick={() => addKeyword(index)} />
                        </div>
                    )}

                    {isEditing(skill.id) && (
                        <div className="flex flex-col gap-4 mt-4">
                            <InputText value={skill.name} onChange={(e) => handleInputChange(index, "name", e)} placeholder="Skill Name" />
                            <div className="flex flex-col gap-2">
                                {skill.keywords.map((keyword, keywordIndex) => (
                                    <div key={keywordIndex} className="flex items-center gap-2">
                                        <InputText value={keyword} onChange={(e) => handleKeywordsChange(index, keywordIndex, e)} />
                                        <Button icon="pi pi-times" onClick={() => removeKeyword(index, keywordIndex)} />
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            ))
            }
        </div >
    );

};
export default Skills;

