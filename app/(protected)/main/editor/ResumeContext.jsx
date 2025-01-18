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
          phone: [],
          location: {
            address: null,
            city: null,
            state: null,
            postal_code: null,
          },
          profiles: {
            linkedin: null,
            github: null,
            website: null,
            portfolio: null,
          },
        };

      case "experience":
        return {
          company: "",
          title: "",
          location: null,
          start_date: "",
          end_date: null,
          description: "",
          technologies: [],
        };

      case "education":
        return {
          institution: "",
          degree: "",
          major: "",
          minor: null,
          gpa: null,
          graduation_date: "",
          relevant_courses: [],
        };

      case "skills":
        return {
          name: "",
          proficiency: "",
          keywords: [],
        };

      case "projects":
        return {
          name: "",
          description: "",
          link: null,
        };

      case "awards_and_recognition":
        return {
          title: "",
          issuing_organization: "",
          date_received: "",
          description: "",
        };

      case "volunteer_and_social_activities":
        return {
          organization: "",
          position: "",
          start_date: "",
          end_date: "",
          description: "",
        };

      case "certifications":
        return {
          name: "",
          issuing_authority: "",
          date_obtained: "",
          expiry_date: null,
        };

      case "languages":
        return {
          language: "",
          proficiency: "",
        };

      case "interests":
        return {
          name: "",
          keywords: [],
        };

      case "references":
        return {
          name: "",
          position: "",
          company: "",
          email: "",
          phone: [],
          relationship: "",
          years_known: "",
        };

      case "publications":
        return {
          title: "",
          authors: [],
          publication_date: "",
          publisher: "",
          link: null,
          description: "",
        };

      case "courses":
        return {
          title: "",
          institution: "",
          completion_date: "",
          link: null,
          description: "",
        };

      case "conferences":
        return {
          name: "",
          date: "",
          location: "",
          link: null,
          description: "",
        };

      case "speaking_engagements":
        return {
          title: "",
          event: "",
          date: "",
          location: "",
          audience_size: null,
          video_link: null,
          slides_link: null,
        };

      case "patents":
        return {
          title: "",
          patent_number: "",
          filing_date: "",
          issue_date: null,
          status: "",
          inventors: [],
          description: "",
        };

      case "professional_memberships":
        return {
          organization: "",
          role: "",
          start_date: "",
          end_date: null,
          benefits: [],
        };

      case "military_service":
        return {
          branch: "",
          rank: "",
          start_date: "",
          end_date: "",
          location: "",
          duties: [],
          awards: [],
        };

      case "teaching_experience":
        return {
          institution: "",
          position: "",
          subject: "",
          start_date: "",
          end_date: null,
          description: "",
          student_level: "",
          class_size: null,
        };

      case "research_experience":
        return {
          institution: "",
          project: "",
          role: "",
          start_date: "",
          end_date: null,
          description: "",
          funding_source: null,
          publications: [],
          collaborators: [],
        };

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
