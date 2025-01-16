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
import LeftSidebar from "./components/LeftSidebar";

const EditableResumeTemplate = () => {
    const { data, addSectionItem } = useResume();
    const [sidebarVisible, setSidebarVisible] = useState(false);


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
        <div className="flex flex-column gap-4 relative">
              {/* Add sidebar toggle button */}
              <Button
                icon="pi pi-plus"
                className="fixed left-0 top-0 m-3 p-button-rounded"
                onClick={() => setSidebarVisible(true)}
                tooltip="Add New Section"
            />

            {/* Add sidebar component */}
            {/* <LeftSidebar
                visible={sidebarVisible}
                onHide={() => setSidebarVisible(false)}
                onAddSection={handleAddSection}
            /> */}

            <div className="resume-container surface-card p-4 border-round-xl shadow-2 max-w-4xl mx-auto">
                {SECTION_ORDER.map((sectionKey) => (
                    data[sectionKey] && (
                        <div key={sectionKey} className="section mb-4">
                            {renderSection(sectionKey)}
                        </div>
                    )
                ))}
            </div>


        </div>
    );
};

export default EditableResumeTemplate;
