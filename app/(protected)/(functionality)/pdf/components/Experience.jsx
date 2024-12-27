"use client";
import React, { useState } from 'react';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { Calendar } from 'primereact/calendar';
import { Button } from 'primereact/button';
import { v4 as uuidv4 } from 'uuid';
import { classNames } from 'primereact/utils';
import 'primeicons/primeicons.css';

import 'primeicons/primeicons.css';
import { useResume } from '../ResumeContext';

const Experience = ({ sectionKey }) => {
    const { data, setData, addSectionItem, removeSectionItem, toggleEditMode, editMode } = useResume();
    const experienceData = data[sectionKey];

    const handleInputChange = (index, field) => {
        const newData = JSON.parse(JSON.stringify(data));
        newData[sectionKey][index][field] = e.target.value;
        setData(newData);
    };

    const handleDateChange = (index, field) => {
        const newData = JSON.parse(JSON.stringify(data));
        newData[sectionKey][index][field] = e.value ? e.value.toISOString() : null; // Store as ISO string
        setData(newData);
    };

    const handleTechnologiesChange = (index, techIndex) => {
        const newData = JSON.parse(JSON.stringify(data));
        newData[sectionKey][index].technologies[techIndex] = e.target.value;
        setData(newData);
    };

    const addTechnology = (index) => {
        const newData = JSON.parse(JSON.stringify(data));
        newData[sectionKey][index].technologies.push('');
        setData(newData);
    };

    const removeTechnology = (index, techIndex) => {
        const newData = JSON.parse(JSON.stringify(data));
        newData[sectionKey][index].technologies.splice(techIndex, 1);
        setData(newData);
    };

    const isEditing = (id) => editMode[sectionKey] && (editMode[sectionKey][id] || editMode[sectionKey].all);

    return (
        <div className="experience-section mb-8">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-800">Experience</h2>
                <div className="flex items-center">
                    <Button icon={editMode[sectionKey]?.all ? 'pi pi-times' : 'pi pi-pencil'} className="p-button-rounded p-button-text mr-2" onClick={() => toggleEditMode(sectionKey)} />
                    {editMode[sectionKey]?.all && <Button icon="pi pi-plus" className="p-button-rounded p-button-success" onClick={() => addSectionItem(sectionKey)} />}
                </div>
            </div>
            {experienceData.map((item, index) => (
                <div key={item.id} className="border rounded p-4 mb-4 last:mb-0 shadow-sm">
                    <div className="flex justify-end mb-2">
                        {editMode[sectionKey]?.all && <Button icon="pi pi-trash" className="p-button-rounded p-button-danger mr-2" onClick={() => removeSectionItem(sectionKey, index, item.id)} />}
                        {!isEditing(item.id) && editMode[sectionKey]?.all && <Button icon="pi pi-pencil" className="p-button-rounded p-button-text" onClick={() => toggleEditMode(sectionKey, item.id)} />}
                        {isEditing(item.id) && editMode[sectionKey]?.all && <Button icon="pi pi-times" className="p-button-rounded p-button-text" onClick={() => toggleEditMode(sectionKey, item.id)} />}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="md:col-span-2 flex items-center mb-2">
                            {' '}
                            {/* Company and title on one line */}
                            {isEditing(item.id) ? (
                                <InputText placeholder="Company" value={item.company} onChange={(e) => handleInputChange(index, 'company', e)} className="w-full mr-2" />
                            ) : (
                                <h3 className="text-lg font-semibold mr-2">{item.company}</h3>
                            )}
                            {isEditing(item.id) ? <InputText placeholder="Title" value={item.title} onChange={(e) => handleInputChange(index, 'title', e)} className="w-full" /> : <span className="text-gray-600">{item.title}</span>}
                        </div>
                        <div>
                            {isEditing(item.id) ? (
                                <InputText placeholder="Location" value={item.location || ''} onChange={(e) => handleInputChange(index, 'location', e)} className="w-full" />
                            ) : (
                                <div className="flex items-center">
                                    <i className="pi pi-map-marker mr-1 text-gray-500"></i>
                                    <span>{item.location}</span>
                                </div>
                            )}
                        </div>
                        <div className="flex items-center">
                            {isEditing(item.id) ? (
                                <Calendar placeholder="Start Date" value={item.start_date ? new Date(item.start_date) : null} onChange={(e) => handleDateChange(index, 'start_date', e)} dateFormat="yy-mm-dd" className="w-full mr-2" />
                            ) : (
                                <div className="flex items-center">
                                    <i className="pi pi-calendar mr-1 text-gray-500"></i>
                                    <span>{item.start_date}</span>
                                </div>
                            )}
                            <span className="mx-2">-</span>
                            {isEditing(item.id) ? (
                                <Calendar
                                    placeholder="End Date"
                                    value={item.end_date && item.end_date !== 'Present' ? new Date(item.end_date) : null}
                                    onChange={(e) => handleDateChange(index, 'end_date', e)}
                                    dateFormat="yy-mm-dd"
                                    className="w-full mr-2"
                                />
                            ) : (
                                <div className="flex items-center">
                                    <i className="pi pi-calendar mr-1 text-gray-500"></i>
                                    <span>{item.end_date}</span>
                                </div>
                            )}
                            {!isEditing(item.id) && item.end_date === 'Present' && <span>Present</span>}
                        </div>
                        <div className="md:col-span-2">
                            {isEditing(item.id) ? (
                                <InputTextarea placeholder="Description" value={item.description} onChange={(e) => handleInputChange(index, 'description', e)} rows={3} className="w-full" />
                            ) : (
                                <p className="text-gray-700">{item.description}</p>
                            )}
                        </div>
                        <div className="md:col-span-2">
                            {isEditing(item.id) && (
                                <div>
                                    <label className="block text-gray-600 font-medium mb-1">Technologies:</label>
                                    {item.technologies.map((technology, techIndex) => (
                                        <div key={techIndex} className="flex items-center space-x-2 mb-1">
                                            <InputText value={technology} onChange={(e) => handleTechnologiesChange(index, techIndex, e)} className="w-full" />
                                            <Button icon="pi pi-minus" className="p-button-rounded p-button-danger" onClick={() => removeTechnology(index, techIndex)} />
                                        </div>
                                    ))}
                                    <Button icon="pi pi-plus" className="p-button-rounded p-button-success mt-2" onClick={() => addTechnology(index)} />
                                </div>
                            )}
                            {!isEditing(item.id) && item.technologies.length > 0 && (
                                <div className="flex flex-wrap mt-2">
                                    {item.technologies.map((tech) => (
                                        <span key={tech} className="bg-gray-200 text-gray-700 rounded-full px-2 py-1 mr-2 mb-1 text-sm">
                                            {tech}
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

export default Experience;
