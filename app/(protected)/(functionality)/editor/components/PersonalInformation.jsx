"use client";
import React, { useRef } from "react";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { useResume } from "../ResumeContext";
import ArrayField from "./ArrayField";
import { Toast } from 'primereact/toast';
import AIAssistant from "./AIAssistant";


const PersonalInformation = ({ sectionKey }) => {
    const toast = useRef(null);
    const { data, setData, toggleEditMode, editMode } = useResume();
    const personalInfo = data[sectionKey];
    const isEditing = editMode[sectionKey]?.all;
    const historyRef = useRef([]);


    const handleInputChange = (field, e) => {
        const newData = JSON.parse(JSON.stringify(data));
        newData[sectionKey][field] = e.target.value;
        setData(newData);
    };

    const handlePhoneChange = (index, e) => {
        const newData = JSON.parse(JSON.stringify(data));
        newData[sectionKey].phone[index] = e.target.value;
        setData(newData);
    };

    const addPhone = () => {
        const newData = JSON.parse(JSON.stringify(data));
        newData[sectionKey].phone.push("");
        setData(newData);
    };

    const removePhone = (index) => {
        const newData = JSON.parse(JSON.stringify(data));
        newData[sectionKey].phone.splice(index, 1);
        setData(newData);
    };


    const saveToHistory = (newData) => {
        historyRef.current.push(JSON.stringify(data[sectionKey]));
        setData(newData);
    };

    const handleUndo = () => {
        if (historyRef.current.length > 0) {
            const previousState = JSON.parse(historyRef.current.pop());
            const newData = { ...data };
            newData[sectionKey] = previousState;
            setData(newData);
            toast.current.show({
                severity: 'info',
                summary: 'Undo',
                detail: 'Previous state restored'
            });
        }
    };

    const handleAIUpdate = (updatedData) => {
        saveToHistory({
            ...data,
            [sectionKey]: updatedData
        });
        toast.current.show({
            severity: 'success',
            summary: 'AI Updated',
            detail: 'Content has been updated'
        });
    };


    return (
        <div className="surface-card p-4 border-round-xl shadow-2">
            <Toast ref={toast} />


            {/* AI Assistant */}

            <div className="flex align-items-center justify-content-between border-bottom-1 surface-border pb-3">
                <h2 className="text-xl font-semibold m-0">
                    {isEditing ? (
                        <InputText
                            className="w-full"
                            value={personalInfo.name}
                            onChange={(e) => handleInputChange("name", e)}
                        />
                    ) : (
                        personalInfo.name
                    )}
                </h2>
                <div className="flex gap-2">
                    {isEditing && (
                        <>
                            {historyRef.current.length > 0 && (
                                <Button
                                    icon="pi pi-undo"
                                    className="p-button-rounded p-button-text"
                                    onClick={handleUndo}
                                    tooltip="Undo"
                                />
                            )}
                            <AIAssistant
                                sectionData={personalInfo}
                                onUpdate={handleAIUpdate}
                            />
                        </>
                    )}
                    <Button
                        icon={isEditing ? "pi pi-times" : "pi pi-pencil"}
                        className="p-button-rounded p-button-text"
                        onClick={() => toggleEditMode(sectionKey)}
                    />
                </div>
            </div>


            <div className="flex flex-column gap-4 p-4 surface-card border-round-xl surface-border-1">

                <div className="flex flex-column gap-3">
                    {isEditing ? (
                        <>
                            <div className="field">
                                <InputText
                                    placeholder="Email"
                                    value={personalInfo.email}
                                    onChange={(e) => handleInputChange("email", e)}
                                    className="w-full"
                                />
                            </div>

                            <div className="field">
                                <ArrayField
                                    values={personalInfo.phone}
                                    onChange={handlePhoneChange}
                                    onAdd={addPhone}
                                    onRemove={removePhone}
                                    placeholder="Phone"
                                />
                            </div>

                            <div className="field">
                                <InputText
                                    placeholder="Address"
                                    value={personalInfo.location?.address || ""}
                                    onChange={(e) => handleLocationChange("address", e)}
                                    className="w-full"
                                />
                            </div>

                            <div className="flex gap-2">
                                <InputText
                                    placeholder="City"
                                    value={personalInfo.location?.city || ""}
                                    onChange={(e) => handleLocationChange("city", e)}
                                    className="flex-1"
                                />
                                <InputText
                                    placeholder="State"
                                    value={personalInfo.location?.state || ""}
                                    onChange={(e) => handleLocationChange("state", e)}
                                    className="flex-1"
                                />
                                <InputText
                                    placeholder="Postal Code"
                                    value={personalInfo.location?.postal_code || ""}
                                    onChange={(e) => handleLocationChange("postal_code", e)}
                                    className="flex-1"
                                />
                            </div>

                            <div className="flex flex-column gap-3">
                                <InputText
                                    placeholder="LinkedIn"
                                    value={personalInfo.profiles.linkedin || ""}
                                    onChange={(e) => handleProfileChange("linkedin", e)}
                                    className="w-full"
                                />
                                <InputText
                                    placeholder="GitHub"
                                    value={personalInfo.profiles.github || ""}
                                    onChange={(e) => handleProfileChange("github", e)}
                                    className="w-full"
                                />
                                <InputText
                                    placeholder="Website"
                                    value={personalInfo.profiles.website || ""}
                                    onChange={(e) => handleProfileChange("website", e)}
                                    className="w-full"
                                />
                                <InputText
                                    placeholder="Portfolio"
                                    value={personalInfo.profiles.portfolio || ""}
                                    onChange={(e) => handleProfileChange("portfolio", e)}
                                    className="w-full"
                                />
                            </div>
                        </>
                    ) : (
                        <div className="flex flex-column gap-2">
                            <p className="m-0">{personalInfo.email}</p>
                            {personalInfo.phone.map((phone, index) => (
                                <p key={index} className="m-0">{phone}</p>
                            ))}
                            {personalInfo.location && (
                                <div className="flex flex-column gap-1">
                                    {personalInfo.location.address && (
                                        <p className="m-0">{personalInfo.location.address}</p>
                                    )}
                                    {personalInfo.location.city && (
                                        <p className="m-0">
                                            {personalInfo.location.city}, {personalInfo.location.state}{" "}
                                            {personalInfo.location.postal_code}
                                        </p>
                                    )}
                                </div>
                            )}
                            {Object.entries(personalInfo.profiles).map(
                                ([key, value]) =>
                                    value && (
                                        <p key={key} className="m-0">
                                            <a href={value} target="_blank" rel="noopener noreferrer">
                                                {key}: {value}
                                            </a>
                                        </p>
                                    )
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>

    );
};

export default PersonalInformation;
