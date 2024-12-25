"use client";
import React from "react";
import { InputText } from "primereact/inputtext";
import { Calendar } from "primereact/calendar";
import { Button } from "primereact/button";
import { useResume } from "../ResumeContext";

const Education = ({ educationData, sectionKey }) => {
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

  const handleInputChange = (index, field, e) => {
    const newData = JSON.parse(JSON.stringify(data));
    newData[sectionKey][index][field] = e.target.value;
    setData(newData);
  };

  const handleDateChange = (index, field, e) => {
    const newData = JSON.parse(JSON.stringify(data));
    newData[sectionKey][index][field] = e.value ? e.value.toISOString() : null;
    setData(newData);
  };

  return (
    <div className="education-section mb-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-800">Education</h2>
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
      {educationData &&
        educationData.map((item, index) => (
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
              <div className="md:col-span-2 flex items-center mb-2">
                {isEditing(item.id) ? (
                  <InputText
                    placeholder="Institution"
                    value={item.institution}
                    onChange={(e) => handleInputChange(index, "institution", e)}
                    className="w-full mr-2"
                  />
                ) : (
                  <h3 className="text-lg font-semibold mr-2">
                    {item.institution}
                  </h3>
                )}
                {isEditing(item.id) ? (
                  <InputText
                    placeholder="Degree"
                    value={item.degree}
                    onChange={(e) => handleInputChange(index, "degree", e)}
                    className="w-full"
                  />
                ) : (
                  <span className="text-gray-600">{item.degree}</span>
                )}
              </div>
              <div>
                {isEditing(item.id) ? (
                  <InputText
                    placeholder="Location"
                    value={item.location || ""}
                    onChange={(e) => handleInputChange(index, "location", e)}
                    className="w-full"
                  />
                ) : (
                  <div className="flex items-center">
                    <i className="pi pi-map-marker mr-1 text-gray-500"></i>
                    <span>{item.location}</span>
                  </div>
                )}
              </div>
              <div className="flex items-center">
                {isEditing(item.id) ? (
                  <Calendar
                    placeholder="Start Date"
                    value={item.start_date ? new Date(item.start_date) : null}
                    onChange={(e) => handleDateChange(index, "start_date", e)}
                    dateFormat="yy-mm-dd"
                    className="w-full mr-2"
                  />
                ) : (
                  <div className="flex items-center">
                    <i className="pi pi-calendar mr-1 text-gray-500"></i>
                    <span>{item.start_date}</span>
                  </div>
                )}
                <span className="mx-2">-</span>
                {isEditing(item.id) ? (
                  <Calendar
                    placeholder="End Date"
                    value={
                      item.end_date && item.end_date !== "Present"
                        ? new Date(item.end_date)
                        : null
                    }
                    onChange={(e) => handleDateChange(index, "end_date", e)}
                    dateFormat="yy-mm-dd"
                    className="w-full mr-2"
                  />
                ) : (
                  <div className="flex items-center">
                    <i className="pi pi-calendar mr-1 text-gray-500"></i>
                    <span>{item.end_date}</span>
                  </div>
                )}
                {!isEditing(item.id) && item.end_date === "Present" && (
                  <span>Present</span>
                )}
              </div>
            </div>
          </div>
        ))}
    </div>
  );
};

export default Education;
