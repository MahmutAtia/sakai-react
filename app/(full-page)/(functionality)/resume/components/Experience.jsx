"use client";
import React, { useState } from "react";
import { InputText } from "primereact/inputtext";
import { Calendar } from "primereact/calendar";
import { Button } from "primereact/button";
import { classNames } from "primereact/utils";
import "primeicons/primeicons.css";

import { useResume } from "../ResumeContext";

const Experience = ({ sectionKey }) => {
  const {
    data,
    setData,
    addSectionItem,
    removeSectionItem,
    toggleEditMode,
    editMode,
  } = useResume();
  const experienceData = data[sectionKey];

  const handleInputChange = (index, field, e) => {
    const newData = JSON.parse(JSON.stringify(data));
    newData[sectionKey][index][field] = e.target.value;
    setData(newData);
  };

  const handleDateChange = (index, field, e) => {
    const newData = JSON.parse(JSON.stringify(data));
    newData[sectionKey][index][field] = e.value ? e.value.toISOString() : null; // Store as ISO string
    setData(newData);
  };

  const handleTechnologiesChange = (index, techIndex, e) => {
    const newData = JSON.parse(JSON.stringify(data));
    newData[sectionKey][index].technologies[techIndex] = e.target.value;
    setData(newData);
  };

  const addTechnology = (index) => {
    const newData = JSON.parse(JSON.stringify(data));
    newData[sectionKey][index].technologies.push("");
    setData(newData);
  };

  const removeTechnology = (index, techIndex) => {
    const newData = JSON.parse(JSON.stringify(data));
    newData[sectionKey][index].technologies.splice(techIndex, 1);
    setData(newData);
  };

  const isEditing = (id) => {
    return (
      editMode[sectionKey] &&
      (editMode[sectionKey][id] || editMode[sectionKey].all)
    );
  };

  return (
    <div className="experience-section mb-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-800">Experience</h2>
        <div className="flex items-center">
          <Button
            icon="pi pi-plus"
            className="p-button-rounded p-button-success"
            onClick={() => toggleEditMode(sectionKey, "all")}
          />
        </div>
      </div>

      {/* New Experience Add Modal */}
      <div className={classNames({ "hidden": !editMode[sectionKey]?.all })}>
        <div className="border rounded p-4 mb-4 shadow-sm">
          <div className="grid grid-cols-1 gap-4">
            {[
              "title",
              "company",
              "location",
              "start_date",
              "end_date",
              "description",
            ].map((field) => (
              <div key={field}>
                <label
                  htmlFor={`${sectionKey}-new-${field}`}
                  className="block text-gray-600 font-medium mb-1"
                >
                  {field.charAt(0).toUpperCase() + field.slice(1)}:
                </label>
                {field.includes("date") ? (
                  <Calendar
                    id={`${sectionKey}-new-${field}`}
                    value={null}
                    onChange={(e) => handleDateChange("new", field, e)}
                    dateFormat="yy-mm-dd"
                    className="w-full"
                  />
                ) : (
                  <InputText
                    id={`${sectionKey}-new-${field}`}
                    value=""
                    onChange={(e) => handleInputChange("new", field, e)}
                  />
                )}
              </div>
            ))}
            <div>
              <label
                htmlFor={`${sectionKey}-new-technologies`}
                className="block text-gray-600 font-medium mb-1"
              >
                Technologies:
              </label>
              <InputText
                id={`${sectionKey}-new-technologies`}
                value=""
                onChange={(e) => handleTechnologiesChange("new", 0, e)}
              />
            </div>
            <Button
              label="Add"
              className="p-button-success"
              onClick={() => {
                addSectionItem(sectionKey);
                toggleEditMode(sectionKey, "all");
              }}
            />
          </div>
        </div>
      </div>

      {/* Experience Items */}
      {experienceData.map((item, index) => (
        <div
          key={item.id}
          className="border rounded p-4 mb-4 last:mb-0 shadow-sm"
        >
          <div className="flex justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">
              {item.title}
            </h3>
            <div className="flex items-center">
              <Button
                icon="pi pi-trash"
                className="p-button-rounded p-button-danger mr-2"
                onClick={() => removeSectionItem(sectionKey, index, item.id)}
              />
              <Button
                icon={isEditing(item.id) ? "pi pi-times" : "pi pi-pencil"}
                className="p-button-rounded p-button-text"
                onClick={() => toggleEditMode(sectionKey, item.id)}
              />
            </div>
          </div>

          {!isEditing(item.id) && (
            <div>
              <h5 className="text-lg font-semibold text-gray-800">
                {item.company}
              </h5>
              <p className="text-gray-600">
                {item.start_date} - {item.end_date}
              </p>
              <p className="text-gray-600">{item.location}</p>
              <p>{item.description}</p>
              <ul>
                {item.technologies.map((tech, techIndex) => (
                  <li key={techIndex}>{tech}</li>
                ))}
              </ul>
            </div>
          )}

          {isEditing(item.id) && (
            <div className="grid grid-cols-1 gap-4">
              {Object.keys(item)
                .filter((key) => key !== "technologies" && key !== "id")
                .map((field) => (
                  <div key={field} className="mb-2">
                    <label
                      htmlFor={`${sectionKey}-${item.id}-${field}`}
                      className="block text-gray-600 font-medium mb-1"
                    >
                      {field.charAt(0).toUpperCase() + field.slice(1)}:
                    </label>
                    {field.includes("date") ? (
                      <Calendar
                        id={`${sectionKey}-${item.id}-${field}`}
                        value={item[field] ? new Date(item[field]) : null}
                        onChange={(e) => handleDateChange(index, field, e)}
                        dateFormat="yy-mm-dd"
                        className="w-full"
                      />
                    ) : (
                      <InputText
                        id={`${sectionKey}-${item.id}-${field}`}
                        value={item[field] || ""}
                        onChange={(e) => handleInputChange(index, field, e)}
                      />
                    )}
                  </div>
                ))}
              <div className="mb-2">
                <label
                  htmlFor={`${sectionKey}-${item.id}-technologies`}
                  className="block text-gray-600 font-medium mb-1"
                >
                  Technologies:
                </label>
                {item.technologies.map((tech, techIndex) => (
                  <div key={techIndex} className="flex items-center mb-2">
                    <InputText
                      value={tech}
                      onChange={(e) => handleTechnologiesChange(index, techIndex, e)}
                      className="w-full"
                    />
                    <Button
                      icon="pi pi-times"
                      className="p-button-rounded p-button-danger p-button-text ml-2"
                      onClick={() => removeTechnology(index, techIndex)}
                    />
                  </div>
                ))}
                <Button
                  icon="pi pi-plus"
                  className="p-button-rounded p-button-success p-button-text"
                  onClick={() => addTechnology(index)}
                />
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default Experience;
