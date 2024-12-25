"use client";
import React from "react";
import { InputTextarea } from "primereact/inputtextarea";
import { Button } from "primereact/button";
import { useResume } from "../ResumeContext";

const Summary = ({ summary, sectionKey }) => {
  const { data, setData, toggleEditMode, editMode } = useResume();
  const isEditing = editMode[sectionKey];

  const handleInputChange = (e) => {
    setData((prevData) => ({ ...prevData, [sectionKey]: e.target.value }));
  };

  return (
    <div className="summary-section mb-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-800">
          {sectionKey.charAt(0).toUpperCase() + sectionKey.slice(1)}
        </h2>
        <Button
          icon={isEditing ? "pi pi-times" : "pi pi-pencil"}
          className="p-button-rounded p-button-text mr-2"
          onClick={() => toggleEditMode(sectionKey)}
        />
      </div>
      {isEditing ? (
        <InputTextarea
          value={summary}
          onChange={handleInputChange}
          rows={3}
          className="w-full"
        />
      ) : (
        <p className="text-gray-700 leading-relaxed">{summary}</p>
      )}
    </div>
  );
};

export default Summary;
