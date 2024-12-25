"use client";

import React from "react";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { Button } from "primereact/button";
import { useResume } from "../ResumeContext";

const Projects = ({ sectionKey }) => {
  const {
    data,
    setData,
    addSectionItem,
    removeSectionItem,
    toggleEditMode,
    editMode,
  } = useResume();

  const projectsData = data[sectionKey];

  const isEditing = (id) =>
    editMode[sectionKey] &&
    (editMode[sectionKey][id] || editMode[sectionKey].all);

  const handleInputChange = (index, field, e) => {
    const newData = JSON.parse(JSON.stringify(data));
    newData[sectionKey][index][field] = e.target.value;
    setData(newData);
  };

  return (
    <>
      {/* Section Header and Add Button */}
      <div className="mb-4">
        <h2 className="text-xl font-semibold">Projects</h2>
        <Button
          onClick={() => addSectionItem(sectionKey)}
          icon="pi pi-plus"
          className="p-button-text"
        />
      </div>

      {/* Projects Items */}
      {projectsData.map((project, index) => (
        <div key={project.id} className="mb-4">
          {/* Projects Header */}
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-lg font-semibold">Project {index + 1}</h3>
            <div>
              <Button
                icon="pi pi-pencil"
                className="p-button-rounded p-button-text p-button-success"
                onClick={() => toggleEditMode(sectionKey, project.id)}
              />
              <Button
                icon="pi pi-trash"
                className="p-button-rounded p-button-text p-button-danger"
                onClick={() =>
                  removeSectionItem(sectionKey, index, project.id)
                }
              />
            </div>
          </div>

          {/* Projects Details display mode */}
{  !isEditing(project.id)  && (     <div className="flex flex-col gap-2">
            <div>
              <span className="font-semibold">Title:</span>{" "}
              <span>{project.title}</span>
            </div>
            <div>
              <span className="font-semibold">Description:</span>{" "}
              <span>{project.description}</span>
            </div>
            <div>
              <span className="font-semibold">Technologies:</span>{" "}
              <span>{project.technologies.join(", ")}</span>
            </div>
          </div>)
}
          {/* Projects Details edit mode */}
          {isEditing(project.id) && (
            <div className="flex flex-col gap-4 mt-4">
              <InputText
                value={project.title}
                onChange={(e) => handleInputChange(index, "title", e)}
                placeholder="Title"
              />
              <InputTextarea
                value={project.description}
                onChange={(e) => handleInputChange(index, "description", e)}
                placeholder="Description"
                autoResize
              />
              <InputText
                value={project.technologies.join(", ")}
                onChange={(e) => handleInputChange(index, "technologies", e)}
                placeholder="Technologies"
              />
            </div>
          )}
        </div>
      ))}
    </>
  );
};

export default Projects;