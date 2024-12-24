import React, { useState } from 'react';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { Calendar } from 'primereact/calendar';
import { Button } from 'primereact/button';
import { v4 as uuidv4 } from 'uuid';
import { classNames } from 'primereact/utils';
import 'primeicons/primeicons.css';

import SectionHeader from  "./components/SectionHeader";
import SectionItem from './components/SectionItem';

interface ResumeData {
    about: string;
    personal_information: {
        name: string;
        email: string;
        phone: string[];
        location?: {
            address: string | null;
            city: string | null;
            state: string | null;
            postal_code: string | null;
        };
        profiles: {
            linkedin?: string;
            github?: string;
            website?: string;
            portfolio?: string;
        };
    };
    summary?: string; // Optional
    objective?: string; // Optional
    experience: {
        company: string;
        title: string;
        location?: string;
        start_date: string;
        end_date?: string; // Can be "Present"
        description: string;
        technologies: string[];
    }[];
    education: {
        institution: string;
        degree: string;
        major: string;
        minor?: string; // Optional
        gpa?: string; // Optional
        graduation_date: string;
        relevant_courses?: string[]; // Optional
    }[];
    skills: {
        name: string;
        keywords: string[];
    }[];
    projects?: {
        // Optional
        name: string;
        description: string;
        link?: string;
    }[];
    awards_and_recognition?: string[]; // Optional
    certifications?: string[]; // Optional
    languages: {
        language: string;
        proficiency: string;
    }[];
    interests?: string[]; // Optional
}

interface ResumeTemplateProps {
    data: ResumeData;
}

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
            newData.personal_information.phone.push('');
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
                newData[section] = newData[section].filter((item, i) => (id ? item.id !== id : i !== index));
            }
            return newData;
        });
        setEditMode((prevEditMode) => {
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
    const formatPhones = (phones: string[]) => phones.join(', ');
    const formatLocation = (location: ResumeData['personal_information']['location'] | undefined) => {
        if (!location) return null;
        const addressParts = [location.address, location.city, location.state, location.postal_code].filter(Boolean);
        return addressParts.join(', ');
    };

    const renderSection = (sectionKey: keyof ResumeData, sectionTitle: string, sectionData: any) => {
        if (!data[sectionKey] && !editMode[sectionKey]?.all && !Object.keys(editMode[sectionKey] || {}).some(key => key !== 'all' && editMode[sectionKey][key])) {
            return null;
        }

        return (
            <div key={sectionKey} className="mb-6">
                <SectionHeader
                    sectionTitle={sectionTitle}
                    editMode={editMode}
                    sectionKey={sectionKey}
                    toggleEditMode={toggleEditMode}
                    addSectionItem={addSectionItem}
                />
                {Array.isArray(sectionData) && sectionData.map((item, index) => (
                    <SectionItem
                        key={item.id}
                        item={item}
                        index={index}
                        editMode={editMode}
                        sectionKey={sectionKey}
                        isEditing={isEditing}
                        handleInputChange={handleInputChange}
                        handleDateChange={handleDateChange}
                        removeSectionItem={removeSectionItem}
                        data={data}
                        setData={setData}
                    />
                ))}
            </div>
        );
    };

    return (
        <div className="resume-container bg-white p-8 shadow-lg rounded-lg max-w-4xl mx-auto font-sans">
            {' '}
            {/* Increased max-w */}
            <header className="mb-8 border-b pb-4">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800 mb-1">
                            {editMode.personalInfo ? <InputText className="w-full" value={data.personal_information.name} onChange={(e) => handleInputChange('personal_information', 'name', undefined, e)} /> : data.personal_information.name}
                        </h1>
                    </div>
                    <div className="flex items-center">
                        <Button icon={editMode.personalInfo ? 'pi pi-times' : 'pi pi-pencil'} className="p-button-rounded p-button-text edit-button" onClick={() => toggleEditMode('personalInfo')} />
                    </div>
                </div>
                <div className="text-gray-600">
                    <div className="flex flex-col md:flex-row md:items-center md:space-x-4">
                        <div className="flex items-center space-x-2">
                            <i className="pi pi-envelope"></i>
                            {editMode.personalInfo ? (
                                <InputText className="w-full" value={data.personal_information.email} onChange={(e) => handleInputChange('personal_information', 'email', undefined, e)} />
                            ) : (
                                <span>{data.personal_information.email}</span>
                            )}
                        </div>
                        <div className="flex items-center space-x-2">
                            <i className="pi pi-phone"></i>
                            <div>
                                {data.personal_information.phone.map((phone, index) => (
                                    <div key={index} className="flex items-center space-x-2 mb-1">
                                        {' '}
                                        {/* Added mb-1 */}
                                        {editMode.personalInfo ? <InputText className="w-full" value={phone} onChange={(e) => handlePhoneChange(index, e)} /> : <span>{phone}</span>}
                                        {editMode.personalInfo && <Button icon="pi pi-minus" className="p-button-rounded p-button-danger" onClick={() => removePhone(index)} />}
                                    </div>
                                ))}
                                {editMode.personalInfo && <Button icon="pi pi-plus" className="p-button-rounded p-button-success mt-1" onClick={addPhone} />} {/* Added mt-1 */}
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col md:flex-row md:items-center md:space-x-4 mt-2">
                        {Object.entries(data.personal_information.profiles).map(
                            ([key, value]) =>
                                value && (
                                    <div key={key} className="flex items-center space-x-2">
                                        <i
                                            className={classNames('pi', {
                                                'pi-linkedin': key === 'linkedin',
                                                'pi-github': key === 'github',
                                                'pi-globe': key === 'website' || key === 'portfolio'
                                            })}
                                        ></i>
                                        {editMode.personalInfo ? (
                                            <InputText className="w-full" value={value} onChange={(e) => handleInputChange('personal_information', `profiles.${key}`, undefined, e)} />
                                        ) : (
                                            <a href={value} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                                                {value}
                                            </a>
                                        )}
                                    </div>
                                )
                        )}
                    </div>
                </div>
            </header>
            {Object.keys(initialData)
                .filter((key) => key !== 'personal_information')
                .map((sectionKey) => (
                    <React.Fragment key={sectionKey}>{renderSection(sectionKey as keyof ResumeData, sectionKey.charAt(0).toUpperCase() + sectionKey.slice(1), data[sectionKey])}</React.Fragment>
                ))}
            {/* Add Section */}
            <div className="mt-8">
                <Button label="Add Section" className="p-button-raised p-button-secondary" onClick={() => setShowAddSection(true)} />
                {showAddSection && (
                    <div className="mt-2 flex space-x-2">
                        <select className="border rounded px-2 py-1" value={newSectionType || ''} onChange={(e) => setNewSectionType(e.target.value as keyof ResumeData)}>
                            <option value="">Select a section</option>
                            {Object.keys(initialData)
                                .filter((key) => !data[key])
                                .map((key) => (
                                    <option key={key} value={key}>
                                        {key.charAt(0).toUpperCase() + key.slice(1)}
                                    </option>
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
