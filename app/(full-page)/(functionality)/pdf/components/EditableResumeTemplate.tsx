import React, { useState } from 'react';
import { Button } from 'primereact/button';
import { v4 as uuidv4 } from 'uuid';
import ResumeHeader from './ResumeHeader';
import ResumeSection from './ResumeSection';
import { ResumeData } from './types';

const EditableResumeTemplate: React.FC<{ initialData: ResumeData }> = ({ initialData }) => {
    const [data, setData] = useState<ResumeData>(initialData);
    const [editMode, setEditMode] = useState<{ [section: string]: { [id: string]: boolean } }>({});
    const [showAddSection, setShowAddSection] = useState(false);
    const [newSectionType, setNewSectionType] = useState<keyof ResumeData | null>(null);

    const handleInputChange = (section: string, field: string, index?: number, event?: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setData((prevData) => {
            const newData = JSON.parse(JSON.stringify(prevData));
            if (index !== undefined && Array.isArray(newData[section])) {
                newData[section][index][field] = event?.target.value;
            } else {
                newData[section][field] = event?.target.value;
            }
            return newData;
        });
    };

    const handleDateChange = (section: string, field: string, index: number, event: any) => {
        setData((prevData) => {
            const newData = JSON.parse(JSON.stringify(prevData));
            newData[section][index][field] = event.value?.toLocaleDateString();
            return newData;
        });
    };

    const handlePhoneChange = (index: number, event: React.ChangeEvent<HTMLInputElement>) => {
        setData((prevData) => {
            const newData = JSON.parse(JSON.stringify(prevData));
            newData.personal_information.phone[index] = event.target.value;
            return newData;
        });
    };

    const toggleEditMode = (section: string, id?: string) => {
        setEditMode((prevEditMode) => {
            const newEditMode = { ...prevEditMode };
            if (!newEditMode[section]) {
                newEditMode[section] = {};
            }
            newEditMode[section][id || 'all'] = !newEditMode[section][id || 'all'];
            return newEditMode;
        });
    };

    const addSectionItem = (section: keyof ResumeData) => {
        setData((prevData) => {
            const newData = JSON.parse(JSON.stringify(prevData));
            if (!newData[section]) {
                newData[section] = [];
            }
            if (Array.isArray(newData[section])) {
                const newItem = { id: uuidv4(), ...getDefaultItem(section) };
                newData[section].push(newItem);
                toggleEditMode(section, newItem.id);
            }
            return newData;
        });
    };

    const addNewSection = () => {
        if (newSectionType) {
            addSectionItem(newSectionType);
            setNewSectionType(null);
            setShowAddSection(false);
        }
    };

    const isEditing = (section: string, id: string) => editMode[section] && (editMode[section][id] || editMode[section]['all']);

    const addPhone = () => {
        setData((prevData) => {
            const newData = JSON.parse(JSON.stringify(prevData));
            newData.personal_information.phone.push("");
            return newData;
        });
    };

    const removePhone = (index: number) => {
        setData((prevData) => {
            const newData = JSON.parse(JSON.stringify(prevData));
            newData.personal_information.phone.splice(index, 1);
            return newData;
        });
    };

    const removeSectionItem = (section: keyof ResumeData, index: number, id?: string) => {
        setData((prevData) => {
            const newData = JSON.parse(JSON.stringify(prevData));
            if (Array.isArray(newData[section])) {
                newData[section] = newData[section].filter((item, i) => id ? item.id !== id : i !== index);
            }
            return newData;
        });
        setEditMode(prevEditMode => {
            const newEditMode = { ...prevEditMode };
            delete newEditMode[section][id || 'all'];
            return newEditMode;
        });
    };

    const getDefaultItem = (section: keyof ResumeData) => {
        switch (section) {
            case 'experience':
                return { company: '', title: '', location: '', start_date: '', end_date: '', description: '', technologies: [] };
            case 'education':
                return { institution: '', degree: '', major: '', graduation_date: '' };
            case 'skills':
                return { name: '', keywords: [] };
            case 'projects':
                return { name: '', description: '', link: '' };
            case 'languages':
                return { language: '', proficiency: '' };
            default:
                return {};
        }
    };

    return (
        <div className="resume-container bg-white p-8 shadow-lg rounded-lg max-w-4xl mx-auto font-sans">
            <ResumeHeader
                data={data.personal_information}
                editMode={editMode.personalInfo}
                handleInputChange={handleInputChange}
                handlePhoneChange={handlePhoneChange}
                toggleEditMode={() => toggleEditMode('personalInfo')}
                addPhone={addPhone}
                removePhone={removePhone}
            />
            {Object.keys(initialData).filter(key => key !== 'personal_information').map((sectionKey) => (
                <ResumeSection
                    key={sectionKey}
                    sectionKey={sectionKey as keyof ResumeData}
                    sectionTitle={sectionKey.charAt(0).toUpperCase() + sectionKey.slice(1)}
                    sectionData={data[sectionKey]}
                    editMode={editMode}
                    handleInputChange={handleInputChange}
                    handleDateChange={handleDateChange}
                    addSectionItem={addSectionItem}
                    removeSectionItem={removeSectionItem}
                    toggleEditMode={toggleEditMode}
                    isEditing={isEditing}
                />
            ))}
            <div className="mt-8">
                <Button label="Add Section" className="p-button-raised p-button-secondary" onClick={() => setShowAddSection(true)} />
                {showAddSection && (
                    <div className="mt-2 flex space-x-2">
                        <select className="border rounded px-2 py-1" value={newSectionType || ""} onChange={(e) => setNewSectionType(e.target.value as keyof ResumeData)}>
                            <option value="">Select a section</option>
                            {Object.keys(initialData).filter(key => !data[key]).map((key) => (
                                <option key={key} value={key}>{key.charAt(0).toUpperCase() + key.slice(1)}</option>
                            ))}
                        </select>
                        <Button label="Add" className="p-button-raised p-button-success" onClick={addNewSection} disabled={!newSectionType} />
                    </div>
                )}
            </div>
        </div>
    );
};

export default EditableResumeTemplate;
