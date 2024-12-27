"use client";
import React, { useRef } from "react";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { Button } from "primereact/button";
import { Toast } from 'primereact/toast';
import { useResume } from "../ResumeContext";
import AIAssistant from "./AIAssistant";

const Projects = ({ sectionKey }) => {
    const toast = useRef(null);
    const { data, setData, toggleEditMode, editMode } = useResume();
    const projects = data[sectionKey] || [];
    const historyRef = useRef([]);

    const isEditing = (id) => editMode[sectionKey]?.[id];

    const handleInputChange = (index, field, e) => {
        const newData = { ...data };
        newData[sectionKey][index][field] = e.target.value;
        setData(newData);
    };

    const addProject = () => {
        const newProject = {
            name: '',
            description: '',
            highlights: [],
            keywords: [],
            url: '',
            github: ''
        };
        const newData = { ...data };
        newData[sectionKey] = [...projects, newProject];
        setData(newData);
        toggleEditMode(sectionKey, projects.length);
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
            detail: 'Project updated successfully'
        });
    };

    return (
        <div className="surface-card p-4 border-round-xl shadow-2">
            <Toast ref={toast} />

            <div className="flex align-items-center justify-content-between border-bottom-1 surface-border pb-3">
                <h2 className="text-xl font-semibold m-0">Projects</h2>
                <Button
                    icon="pi pi-plus"
                    className="p-button-rounded p-button-success"
                    onClick={addProject}
                    tooltip="Add Project"
                />
            </div>

            <div className="flex flex-column gap-4 mt-3">
                {projects.map((project, index) => (
                    <div key={index} className="surface-card p-3 border-1 surface-border border-round">
                        <div className="flex justify-content-between align-items-center mb-3">
                            {isEditing(index) ? (
                                <div className="flex gap-2 align-items-center">
                                    <AIAssistant
                                        sectionData={project}
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
                                    placeholder="Project Name"
                                    value={project.name}
                                    onChange={(e) => handleInputChange(index, 'name', e)}
                                    className="w-full"
                                />
                                <InputTextarea
                                    placeholder="Description"
                                    value={project.description}
                                    onChange={(e) => handleInputChange(index, 'description', e)}
                                    rows={3}
                                    className="w-full"
                                />
                                <div className="flex gap-2">
                                    <InputText
                                        placeholder="Project URL"
                                        value={project.url}
                                        onChange={(e) => handleInputChange(index, 'url', e)}
                                        className="flex-1"
                                    />
                                    <InputText
                                        placeholder="GitHub URL"
                                        value={project.github}
                                        onChange={(e) => handleInputChange(index, 'github', e)}
                                        className="flex-1"
                                    />
                                </div>
                                <div className="flex flex-column gap-2">
                                    <InputText
                                        placeholder="Technologies (comma-separated)"
                                        value={project.keywords?.join(', ')}
                                        onChange={(e) => handleInputChange(index, 'keywords', {
                                            target: { value: e.target.value.split(',').map(k => k.trim()) }
                                        })}
                                        className="w-full"
                                    />
                                </div>
                            </div>
                        ) : (
                            <div className="flex flex-column gap-2">
                                <div className="flex justify-content-between">
                                    <span className="font-semibold">{project.name}</span>
                                    <div className="flex gap-2">
                                        {project.url && (
                                            <a href={project.url} target="_blank" rel="noopener noreferrer">
                                                <i className="pi pi-link"></i>
                                            </a>
                                        )}
                                        {project.github && (
                                            <a href={project.github} target="_blank" rel="noopener noreferrer">
                                                <i className="pi pi-github"></i>
                                            </a>
                                        )}
                                    </div>
                                </div>
                                <p className="text-700 line-height-3 my-2">{project.description}</p>
                                <div className="flex flex-wrap gap-2">
                                    {project.keywords?.map((keyword, kIndex) => (
                                        <span key={kIndex} className="surface-200 text-700 border-round px-2 py-1">
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

export default Projects;
