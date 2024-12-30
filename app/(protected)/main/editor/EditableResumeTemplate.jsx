"use client";
import React, { useState } from "react";
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';
import { InputText } from 'primereact/inputtext';
import PersonalInformation from "./components/PersonalInformation";
import Summary from "./components/Summary";
import Experience from "./components/Experience";
import Education from "./components/Education";
import Projects from "./components/Projects";
import Skills from "./components/Skills";
import Languages from "./components/Languages";
import { useResume } from "./ResumeContext";

const EditableResumeTemplate = () => {
    const { data, addSectionItem } = useResume();

    const SECTION_ORDER = [
        'personal_information',
        'summary',
        'objective',
        'experience',
        'education',
        'projects',
        'skills',
        'languages'
    ];
    const [showAddSection, setShowAddSection] = useState(false);
    const [newSection, setNewSection] = useState({
        type: '',
        title: '',
        isList: false
    });

    const sectionTypes = [
        { label: 'Text Section', value: 'text' },
        { label: 'List Section', value: 'list' }
    ];

    const handleAddSection = () => {
        if (newSection.title && newSection.type) {
            const sectionKey = newSection.title.toLowerCase().replace(/\s+/g, '_');
            addSectionItem(sectionKey, newSection.isList ? [] : '');
            setNewSection({ type: '', title: '', isList: false });
            setShowAddSection(false);
        }
    };

    const renderSection = (sectionKey) => {
        switch (sectionKey) {
            case 'personal_information':
                return <PersonalInformation sectionKey={sectionKey} />;
            case 'summary':
            case 'objective':
                return <Summary sectionKey={sectionKey} />;
            case 'experience':
                return <Experience sectionKey={sectionKey} />;
            case 'education':
                return <Education sectionKey={sectionKey} />;
            case 'projects':
                return <Projects sectionKey={sectionKey} />;
            case 'skills':
                return <Skills sectionKey={sectionKey} />;
            case 'languages':
                return <Languages sectionKey={sectionKey} />;
            default:
                return Array.isArray(data[sectionKey]) ? (
                    <Projects sectionKey={sectionKey} /> // Use Projects component for list sections
                ) : (
                    <Summary sectionKey={sectionKey} /> // Use Summary component for text sections
                );
        }
    };

    return (
        <div className="flex flex-column gap-4">
            <div className="resume-container surface-card p-4 border-round-xl shadow-2 max-w-4xl mx-auto">
                {SECTION_ORDER.map((sectionKey) => (
                    data[sectionKey] && (
                        <div key={sectionKey} className="section mb-4">
                            {renderSection(sectionKey)}
                        </div>
                    )
                ))}
            </div>

            <div className="flex justify-content-center">
                <Button
                    icon="pi pi-plus"
                    label="Add Section"
                    className="p-button-rounded p-button-success"
                    onClick={() => setShowAddSection(true)}
                />
            </div>

            <Dialog
                visible={showAddSection}
                onHide={() => setShowAddSection(false)}
                header="Add New Section"
                className="w-30rem"
            >
                <div className="flex flex-column gap-3 p-3">
                    <div className="field">
                        <label htmlFor="sectionTitle" className="block mb-2">Section Title</label>
                        <InputText
                            id="sectionTitle"
                            value={newSection.title}
                            onChange={(e) => setNewSection({ ...newSection, title: e.target.value })}
                            className="w-full"
                        />
                    </div>

                    <div className="field">
                        <label htmlFor="sectionType" className="block mb-2">Section Type</label>
                        <Dropdown
                            id="sectionType"
                            value={newSection.type}
                            options={sectionTypes}
                            onChange={(e) => setNewSection({ ...newSection, type: e.value, isList: e.value === 'list' })}
                            className="w-full"
                        />
                    </div>

                    <div className="flex justify-content-end gap-2">
                        <Button
                            label="Cancel"
                            icon="pi pi-times"
                            className="p-button-text"
                            onClick={() => setShowAddSection(false)}
                        />
                        <Button
                            label="Add"
                            icon="pi pi-check"
                            onClick={handleAddSection}
                            disabled={!newSection.title || !newSection.type}
                        />
                    </div>
                </div>
            </Dialog>
        </div>
    );
};

export default EditableResumeTemplate;
