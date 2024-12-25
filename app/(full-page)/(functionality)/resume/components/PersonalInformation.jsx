"use client";
import React from "react";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { useResume } from "../ResumeContext";
import ArrayField from "./ArrayField";

const PersonalInformation = ({ sectionKey }) => {
  const { data, setData, toggleEditMode, editMode } = useResume();
  const personalInfo = data[sectionKey];
  const isEditing = editMode[sectionKey]?.all;

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

  const handleProfileChange = (profile, e) => {
    const newData = JSON.parse(JSON.stringify(data));
    newData[sectionKey].profiles[profile] = e.target.value;
    setData(newData);
  };

  const handleLocationChange = (field, e) => {
    const newData = JSON.parse(JSON.stringify(data));
    newData[sectionKey].location[field] = e.target.value;
    setData(newData);
  };

  return (
    <div className="p-mb-8 p-border-bottom p-pb-4">
      <div className="p-d-flex p-jc-between p-ai-center p-mb-4">
        <h2 className="p-text-2xl p-font-bold p-text-gray-800">
          {isEditing ? (
            <InputText
              className="p-w-full"
              value={personalInfo.name}
              onChange={(e) => handleInputChange("name", e)}
            />
          ) : (
            personalInfo.name
          )}
        </h2>
        <Button
          icon={isEditing ? "pi pi-times" : "pi pi-pencil"}
          className="p-button-rounded p-button-text edit-button"
          onClick={() => toggleEditMode(sectionKey)}
        />
      </div>
      <div className="p-text-gray-600">
        {isEditing ? (
          <>
            <InputText
              placeholder="Email"
              value={personalInfo.email}
              onChange={(e) => handleInputChange("email", e)}
              className="p-w-full p-mb-4"
            />

            <ArrayField
              values={personalInfo.phone}
              onChange={handlePhoneChange}
              onAdd={addPhone}
              onRemove={removePhone}
              placeholder="Phone"
              className="p-mb-4"
            />

            <InputText
              placeholder="Address"
              value={personalInfo.location?.address || ""}
              onChange={(e) => handleLocationChange("address", e)}
              className="p-w-full p-mb-4 p-mt-4"
            />
            <div className="p-d-flex p-ai-center p-mb-4">
              <InputText
                placeholder="City"
                value={personalInfo.location?.city || ""}
                onChange={(e) => handleLocationChange("city", e)}
                className="p-w-1/3"
              />
              <InputText
                placeholder="State"
                value={personalInfo.location?.state || ""}
                onChange={(e) => handleLocationChange("state", e)}
                className="p-w-1/3"
              />
              <InputText
                placeholder="Postal Code"
                value={personalInfo.location?.postal_code || ""}
                onChange={(e) => handleLocationChange("postal_code", e)}
                className="p-w-1/3"
              />
            </div>

            <InputText
              placeholder="LinkedIn"
              value={personalInfo.profiles.linkedin || ""}
              onChange={(e) => handleProfileChange("linkedin", e)}
              className="p-w-full p-mb-4 p-mt-4"
            />
            <InputText
              placeholder="GitHub"
              value={personalInfo.profiles.github || ""}
              onChange={(e) => handleProfileChange("github", e)}
              className="p-w-full p-mb-4"
            />
            <InputText
              placeholder="Website"
              value={personalInfo.profiles.website || ""}
              onChange={(e) => handleProfileChange("website", e)}
              className="p-w-full p-mb-4"
            />
            <InputText
              placeholder="Portfolio"
              value={personalInfo.profiles.portfolio || ""}
              onChange={(e) => handleProfileChange("portfolio", e)}
              className="p-w-full p-mb-4"
            />
          </>
        ) : (
          <>
            <p className="p-mb-2">{personalInfo.email}</p>
            {personalInfo.phone.map((phone, index) => (
              <p key={index} className="p-mb-2">{phone}</p>
            ))}
            {personalInfo.location && (
              <p className="p-mb-2">
                {personalInfo.location.address && (
                  <div>{personalInfo.location.address}</div>
                )}
                {personalInfo.location.city && (
                  <div>
                    {personalInfo.location.city}, {personalInfo.location.state}{" "}
                    {personalInfo.location.postal_code}
                  </div>
                )}
              </p>
            )}
            {Object.entries(personalInfo.profiles).map(
              ([key, value]) =>
                value && (
                  <p key={key} className="p-mb-2">
                    <a href={value} target="_blank" rel="noopener noreferrer">
                      {key}: {value}
                    </a>
                  </p>
                ),
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default PersonalInformation;
