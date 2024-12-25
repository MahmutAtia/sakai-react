"use client";
import React from 'react';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { useResume } from '../ResumeContext';

const PersonalInformation = ({ personalInfo }) => {
    const { data, setData, toggleEditMode, editMode } = useResume();
    const isEditing = editMode.personal_information;

    const handleInputChange = (field, e) => {
        setData((prevData) => ({
            ...prevData,
            personal_information: { ...prevData.personal_information, [field]: e.target.value }
        }));
    };

    const handlePhoneChange = (index, e) => {
        const newPhoneNumbers = [...data.personal_information.phone];
        newPhoneNumbers[index] = e.target.value;
        setData((prevData) => ({
            ...prevData,
            personal_information: { ...prevData.personal_information, phone: newPhoneNumbers }
        }));
    };

    const addPhone = () => {
        setData((prevData) => ({
            ...prevData,
            personal_information: { ...prevData.personal_information, phone: [...prevData.personal_information.phone, ''] }
        }));
    };

    const removePhone = (index) => {
        const newPhoneNumbers = [...data.personal_information.phone];
        newPhoneNumbers.splice(index, 1);
        setData((prevData) => ({
            ...prevData,
            personal_information: { ...prevData.personal_information, phone: newPhoneNumbers }
        }));
    };

    const handleProfileChange = (profile, e) => {
        setData((prevData) => ({
            ...prevData,
            personal_information: {
                ...prevData.personal_information,
                profiles: { ...prevData.personal_information.profiles, [profile]: e.target.value }
            }
        }));
    };

    const handleLocationChange = (field, e) => {
        setData((prevData) => ({
            ...prevData,
            personal_information: {
                ...prevData.personal_information,
                location: { ...prevData.personal_information.location, [field]: e.target.value }
            }
        }));
    };

    return (
        <div className="personal-information-section mb-8 border-b pb-4">
            <div className="flex justify-between items-center mb-2">
                <h2 className="text-2xl font-bold text-gray-800">{isEditing ? <InputText className="w-full" value={personalInfo.name} onChange={(e) => handleInputChange('name', e)} /> : personalInfo.name}</h2>
                <Button icon={isEditing ? 'pi pi-times' : 'pi pi-pencil'} className="p-button-rounded p-button-text edit-button" onClick={() => toggleEditMode('personal_information')} />
            </div>
            <div className="text-gray-600">
                {isEditing ? (
                    <>
                        <InputText placeholder="Email" value={personalInfo.email} onChange={(e) => handleInputChange('email', e)} className="w-full mb-2" />

                        <div>
                            {personalInfo.phone.map((phone, index) => (
                                <div key={index} className="flex items-center space-x-2 mb-1">
                                    <InputText placeholder="Phone" value={phone} onChange={(e) => handlePhoneChange(index, e)} className="w-full" />
                                    <Button icon="pi pi-minus" className="p-button-rounded p-button-danger" onClick={() => removePhone(index)} />
                                </div>
                            ))}
                            <Button icon="pi pi-plus" className="p-button-rounded p-button-success mt-1" onClick={addPhone} />
                        </div>

                        <InputText placeholder="Address" value={personalInfo.location?.address || ''} onChange={(e) => handleLocationChange('address', e)} className="w-full mb-2 mt-2" />
                        <div className="flex space-x-2">
                            <InputText placeholder="City" value={personalInfo.location?.city || ''} onChange={(e) => handleLocationChange('city', e)} className="w-1/3" />
                            <InputText placeholder="State" value={personalInfo.location?.state || ''} onChange={(e) => handleLocationChange('state', e)} className="w-1/3" />
                            <InputText placeholder="Postal Code" value={personalInfo.location?.postal_code || ''} onChange={(e) => handleLocationChange('postal_code', e)} className="w-1/3" />
                        </div>

                        <InputText placeholder="LinkedIn" value={personalInfo.profiles.linkedin || ''} onChange={(e) => handleProfileChange('linkedin', e)} className="w-full mb-2 mt-2" />
                        <InputText placeholder="GitHub" value={personalInfo.profiles.github || ''} onChange={(e) => handleProfileChange('github', e)} className="w-full mb-2" />
                        <InputText placeholder="Website" value={personalInfo.profiles.website || ''} onChange={(e) => handleProfileChange('website', e)} className="w-full mb-2" />
                        <InputText placeholder="Portfolio" value={personalInfo.profiles.portfolio || ''} onChange={(e) => handleProfileChange('portfolio', e)} className="w-full mb-2" />
                    </>
                ) : (
                    <>
                        <p>{personalInfo.email}</p>
                        {personalInfo.phone.map((phone, index) => (
                            <p key={index}>{phone}</p>
                        ))}
                        {personalInfo.location && (
                            <p>
                                {personalInfo.location.address && <div>{personalInfo.location.address}</div>}
                                {personalInfo.location.city && (
                                    <div>
                                        {personalInfo.location.city}, {personalInfo.location.state} {personalInfo.location.postal_code}
                                    </div>
                                )}
                            </p>
                        )}
                        {Object.entries(personalInfo.profiles).map(
                            ([key, value]) =>
                                value && (
                                    <p key={key}>
                                        <a href={value} target="_blank" rel="noopener noreferrer">
                                            {key}: {value}
                                        </a>
                                    </p>
                                )
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default PersonalInformation;
