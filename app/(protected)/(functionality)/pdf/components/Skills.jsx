
"use client";
import React from 'react';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { useResume } from '../ResumeContext';

const Skills = ({ skillsData, sectionKey }) => {
    const { data, setData, addSectionItem, removeSectionItem, toggleEditMode, editMode } = useResume();
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
        <div className="skills-section mb-8">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-800">Skills</h2>
                <div className="flex items-center">
                    <Button icon={editMode[sectionKey]?.all ? 'pi pi-times' : 'pi pi-pencil'} className="p-button-rounded p-button-text mr-2" onClick={() => toggleEditMode(sectionKey)} />
                    {editMode[sectionKey]?.all && <Button icon="pi pi-plus" className="p-button-rounded p-button-success" onClick={() => addSectionItem(sectionKey)} />}
                </div>
            </div>
            {skillsData.map((item, index) => (
                <div key={item.id} className="border rounded p-4 mb-4 last:mb-0 shadow-sm">
                    <div className="flex justify-end mb-2">
                        <Button icon="pi pi-trash" className="p-button-rounded p-button-danger mr-2" onClick={() => removeSectionItem(sectionKey, index, item.id)} />
                        {!isEditing(item.id) && editMode[sectionKey]?.all && <Button icon="pi pi-pencil" className="p-button-rounded p-button-text" onClick={() => toggleEditMode(sectionKey, item.id)} />}
                        {isEditing(item.id) && editMode[sectionKey]?.all && <Button icon="pi pi-times" className="p-button-rounded p-button-text" onClick={() => toggleEditMode(sectionKey, item.id)} />}
                    </div>
                    <div className="grid grid-cols-1 gap-4">
                        <div className="mb-2">
                            <label htmlFor={`${sectionKey}-${item.id}-name`} className="block text-gray-600 font-medium mb-1">Name:</label>
                            {isEditing(item.id) ? <InputText value={item.name} onChange={(e) => handleInputChange(index, 'name', e)} className="w-full" /> : <p className="text-gray-700">{item.name}</p>}
                        </div>
                        <div className="mb-2">
                            <label className="block text-gray-600 font-medium mb-1">Keywords:</label>
                            {isEditing(item.id) && (
                                <div>
                                    {item.keywords.map((keyword, keywordIndex) => (
                                        <div key={keywordIndex} className="flex items-center space-x-2 mb-1">
                                            <InputText value={keyword} onChange={(e) => handleKeywordsChange(index, keywordIndex, e)} className="w-full" />
                                            <Button icon="pi pi-minus" className="p-button-rounded p-button-danger" onClick={() => removeKeyword(index, keywordIndex)} />
                                        </div>
                                    ))}
                                    <Button icon="pi pi-plus" className="p-button-rounded p-button-success mt-2" onClick={() => addKeyword(index)} />
                                </div>
                            )}
                            {!isEditing(item.id) && item.keywords.length > 0 && (
                                <div className="flex flex-wrap">
                                    {item.keywords.map((keyword) => (
                                        <span key={keyword} className="bg-gray-200 text-gray-700 rounded-full px-2 py-1 mr-2 mb-1 text-sm">
                                            {keyword}
                                        </span>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default Skills;
