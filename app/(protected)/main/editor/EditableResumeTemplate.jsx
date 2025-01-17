"use client";
import React, { useState, useEffect } from "react";
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
import GenericSection from "./components/GenericSection";
import { ProgressSpinner } from 'primereact/progressspinner';


const EditableResumeTemplate = () => {
    const { data, setData } = useResume();
    const [sidebarVisible, setSidebarVisible] = useState(false);
    const [loading, setLoading] = useState(false);
    // Add state for custom sections
    const [customSections, setCustomSections] = useState([]);

    // Modify SECTION_ORDER to include custom sections
    const SECTION_ORDER = [
        'personal_information',
        'summary',
        'objective',
        'experience',
        'education',
        'projects',
        'skills',
        'languages',
        ...customSections
    ];
    const [sectionOrder, setSectionOrder] = useState([
        'personal_information',
        'summary',
        'objective',
        'experience',
        'education',
        'projects',
        'skills',
        'languages'
    ]);

    const isActiveSection = (key) => {
        if (key === 'personal_information') {
            return Boolean(data[key]); // Check just existence
        }
        return Boolean(data[key] && Array.isArray(data[key]) && data[key].length > 0);
    };

    const availableSections = sectionOrder.map(key => ({
        key,
        title: key.split('_').map(word =>
            word.charAt(0).toUpperCase() + word.slice(1)
        ).join(' '),
        active: isActiveSection(key)
    }));
    const handleAddSection = async (sectionKey) => {
        setLoading(true);
        try {
            const newData = { ...data };
            if (!newData[sectionKey]) {
                newData[sectionKey] = sectionKey in ['personal_information', 'summary', 'objective'] ? {} : [];

            }
            await setData(newData);
        } finally {
            setLoading(false);
        }
    };

    const handleReorderSections = async (sourceIndex, destinationIndex) => {
        setLoading(true);
        try {
            // Get active sections only
            const activeSectionKeys = availableSections
                .filter(section => section.active)
                .map(section => section.key);

            // Reorder within active sections
            const [movedSection] = activeSectionKeys.splice(sourceIndex, 1);
            activeSectionKeys.splice(destinationIndex, 0, movedSection);

            // Create new order preserving inactive sections
            const newOrder = sectionOrder.filter(key =>
                !activeSectionKeys.includes(key)
            );

            // Insert active sections in their new order
            activeSectionKeys.forEach((key, index) => {
                const originalIndex = sectionOrder.indexOf(key);
                if (originalIndex !== -1) {
                    newOrder.splice(index, 0, key);
                }
            });

            setSectionOrder(newOrder);
            localStorage.setItem('sectionOrder', JSON.stringify(newOrder));

        } finally {
            setLoading(false);
        }
    };

    const renderSection = (sectionKey) => {
        // Check if section exists in data
        if (!data[sectionKey] && !data[`${sectionKey}_config`]) {
            return null;
        }

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
                return data[`${sectionKey}_config`] ? (
                    <GenericSection
                        sectionKey={sectionKey}
                        fields={data[`${sectionKey}_config`].fields || []}
                    />
                ) : null;
        }
    };

    // Load saved order on mount
    useEffect(() => {
        const savedOrder = localStorage.getItem('sectionOrder');
        if (savedOrder) {
            setSectionOrder(JSON.parse(savedOrder));
        }
    }, []);

    return (
        <div className="flex flex-column gap-4 relative">
            {loading && (
                <div className="fixed top-50 left-50 z-5">
                    <ProgressSpinner />
                </div>
            )}

            <Button
                icon="pi pi-bars"
                className="fixed left-0 top-0 m-3 p-button-rounded"
                onClick={() => setSidebarVisible(true)}
            />

            <LeftSidebar
                visible={sidebarVisible}
                onHide={() => setSidebarVisible(false)}
                sections={availableSections}
                onAddSection={handleAddSection}
                onReorderSections={handleReorderSections}
            />

            <div className="resume-container surface-card p-4 border-round-xl shadow-2 max-w-4xl mx-auto">
                {sectionOrder.map((sectionKey) => (
                    isActiveSection(sectionKey) && renderSection(sectionKey)
                ))}
            </div>
        </div>
    );
};

export default EditableResumeTemplate;
