import React, { createContext, useState, useContext } from "react";
import { v4 as uuidv4 } from "uuid";
import "primeicons/primeicons.css";


export const ResumeContext = createContext();

export const ResumeProvider = ({ children, initialData }) => {
  const [data, setData] = useState(initialData);
  const [editMode, setEditMode] = useState({});
  const toggleEditMode = (section, id = "all") => {
  setEditMode((prevEditMode) => ({
    ...prevEditMode,
    [section]: {
      ...(prevEditMode[section] ? prevEditMode[section] : {}), // Check if exists
      [id]: !prevEditMode[section]?.[id],
    },
  }));
};

  const addSectionItem = (section) => {
    setData((prevData) => {
      const newData = JSON.parse(JSON.stringify(prevData));
      if (!newData[section]) {
        newData[section] = [];
      }
      if (Array.isArray(newData[section])) {
        newData[section].push({ id: uuidv4(), ...getDefaultItem(section) });
      }
      return newData;
    });
  };

  const removeSectionItem = (section, index, id) => {
    setData((prevData) => {
      const newData = JSON.parse(JSON.stringify(prevData));
      if (Array.isArray(newData[section])) {
        newData[section] = newData[section].filter((item, i) =>
          id ? item.id !== id : i !== index,
        );
      }
      return newData;
    });
    setEditMode((prevEditMode) => {
      const newEditMode = { ...prevEditMode };
      if (newEditMode[section]) {
        delete newEditMode[section][id || "all"];
      }
      return newEditMode;
    });
  };

  const getDefaultItem = (section) => {
    switch (section) {
      case "personal_information":
        return {
          name: "",
          email: "",
          phone: [""],
          location: {
            address: null,
            city: null,
            state: null,
            postal_code: null,
          },
          profiles: {
            linkedin: "",
            github: "",
            website: "",
            portfolio: "",
          },
        };

      case "experience":
        return {
          company: "",
          title: "",
          location: "",
          start_date: "",
          end_date: "",
          description: "",
          technologies: [],
        };
      case "education":
        return {
          institution: "",
          degree: "",
          major: "",
          minor: "",
          gpa: "",
          graduation_date: "",
          relevant_courses: [],
        };
      case "skills":
        return { name: "", keywords: [] };
      case "projects":
        return { name: "", description: "", link: "" };
      case "languages":
        return { language: "", proficiency: "" };
      default:
        return {};
    }
  };
  return (
    <ResumeContext.Provider
      value={{
        data,
        setData,
        editMode,
        setEditMode,
        toggleEditMode,
        addSectionItem,
        removeSectionItem,
        getDefaultItem,

      }}
    >
      {children}
    </ResumeContext.Provider>
  );
};

export const useResume = () => {
  const context = useContext(ResumeContext);
  if (!context) {
    throw new Error("useResume must be used within a ResumeProvider");
  }
  return context;
};
