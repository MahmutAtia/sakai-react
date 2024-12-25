"use client";
import React from "react";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { useResume } from "../ResumeContext";

const Languages = ({ languagesData, sectionKey }) => {
  const {
    data,
    setData,
    addSectionItem,
    removeSectionItem,
    toggleEditMode,
    editMode,
  } = useResume();
  const isEditing = (id) =>
    editMode[sectionKey] &&
    (editMode[sectionKey][id] || editMode[sectionKey].all);

  const handleInputChange = (index, field) => {
    const newData = JSON.parse(JSON.stringify(data));
    newData[sectionKey][index][field] = e.target.value;
    setData(newData);
  };

  return (
    <div className="languages-section mb-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-800">Languages</h2>
        <div className="flex items-center">
          <Button
            icon={editMode[sectionKey]?.all ? "pi pi-times" : "pi pi-pencil"}
            className="p-button-rounded p-button-text mr-2"
            onClick={() => toggleEditMode(sectionKey)}
          />
          {editMode[sectionKey]?.all && (
            <Button
              icon="pi pi-plus"
              className="p-button-rounded p-button-success"
              onClick={() => addSectionItem(sectionKey)}
            />
          )}
        </div>
      </div>
      {languagesData.map((item, index) => (
        <div
          key={item.id}
          className="border rounded p-4 mb-4 last:mb-0 shadow-sm"
        >
          <div className="flex justify-end mb-2">
            <Button
              icon="pi pi-trash"
              className="p-button-rounded p-button-danger mr-2"
              onClick={() => removeSectionItem(sectionKey, index, item.id)}
            />
            {!isEditing(item.id) && editMode[sectionKey]?.all && (
              <Button
                icon="pi pi-pencil"
                className="p-button-rounded p-button-text"
                onClick={() => toggleEditMode(sectionKey, item.id)}
              />
            )}
            {isEditing(item.id) && editMode[sectionKey]?.all && (
              <Button
                icon="pi pi-times"
                className="p-button-rounded p-button-text"
                onClick={() => toggleEditMode(sectionKey, item.id)}
              />
            )}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.keys(item)
              .filter((key) => key !== "id")
              .map((field) => (
                <div key={field} className="mb-2">
                  <label
                    htmlFor={`${sectionKey}-${item.id}-${field}`}
                    className="block text-gray-600 font-medium mb-1"
                  >
                    {field.charAt(0).toUpperCase() + field.slice(1)}:
                  </label>
                  {isEditing(item.id) ? (
                    <InputText
                      value={item[field] || ""}
                      onChange={(e) => handleInputChange(index, field, e)}
                      className="w-full"
                    />
                  ) : (
                    <p className="text-gray-700">{item[field]}</p>
                  )}
                </div>
              ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Languages;
