"use client";
import React, { useState } from "react";
import PersonalInformation from "./components/PersonalInformation";
import Summary from "./components/Summary";
import Experience from "./components/Experience";
import Education from "./components/Education";
import Projects from "./components/Projects";
import Skills from "./components/Skills";
import Languages from "./components/Languages";
import { useResume } from "./ResumeContext";

// Uncomment and use the provided interface or create a simplified version

const EditableResumeTemplate = () => {
  const { data, addSectionItem } = useResume();
  const [showAddSection, setShowAddSection] = useState(false);
  const [newSectionType, setNewSectionType] = useState("");

  const addNewSection = () => {
    if (newSectionType) {
      addSectionItem(newSectionType);
      setNewSectionType("");
      setShowAddSection(false);
    }
  };
console.log(data.projects);
  return (
    <div className="resume-container bg-white p-8 shadow-lg rounded-lg max-w-4xl mx-auto font-sans">
      {data.personal_information && <PersonalInformation sectionKey="personal_information" />}

      {data.summary && <Summary sectionKey="summary" />}
      {data.objective && <Summary sectionKey="objective" />}
      {data.experience && data.experience.length > 0 && <Experience sectionKey="experience" />}
      {data.education && data.education.length > 0 && <Education sectionKey="education" />}
      {data.skills && data.skills.length > 0 && <Skills sectionKey="skills" />}
      {data.projects && data.projects.length > 0 && <Projects sectionKey="projects" />}
      {data.languages && data.languages.length > 0 && (
        <Languages languagesData={data.languages} sectionKey="languages" />
      )}

      <div className="mt-8 flex flex-col gap-4">
        <button
          onClick={() => setShowAddSection(true)}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
        >
          Add Section
        </button>

        {showAddSection && (
          <div className="flex gap-2">
            <select
              value={newSectionType}
              onChange={(e) => setNewSectionType(e.target.value)}
              className="border rounded px-3 py-2 flex-grow"
            >
              <option value="">Select a section</option>
              {Object.keys(data)
                .filter((key) => !data[key] && key !== "personal_information")
                .map((key) => (
                  <option key={key} value={key}>
                    {key.charAt(0).toUpperCase() +
                      key.slice(1).replace(/_/g, " ")}
                  </option>
                ))}
            </select>
            <button
              onClick={addNewSection}
              disabled={!newSectionType}
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors disabled:bg-gray-300"
            >
              Add
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default EditableResumeTemplate;

// interface ResumeData {
//     about: string;
//     personal_information: {
//         name: string;
//         email: string;
//         phone: string[];
//         location?: {
//             address: string | null;
//             city: string | null;
//             state: string | null;
//             postal_code: string | null;
//         };
//         profiles: {
//             linkedin?: string;
//             github?: string;
//             website?: string;
//             portfolio?: string;
//         };
//     };
//     summary?: string; // Optional
//     objective?: string; // Optional
//     experience: {
//         company: string;
//         title: string;
//         location?: string;
//         start_date: string;
//         end_date?: string; // Can be "Present"
//         description: string;
//         technologies: string[];
//     }[];
//     education: {
//         institution: string;
//         degree: string;
//         major: string;
//         minor?: string; // Optional
//         gpa?: string; // Optional
//         graduation_date: string;
//         relevant_courses?: string[]; // Optional
//     }[];
//     skills: {
//         name: string;
//         keywords: string[];
//     }[];
//     projects?: {
//         // Optional
//         name: string;
//         description: string;
//         link?: string;
//     }[];
//     awards_and_recognition?: string[]; // Optional
//     certifications?: string[]; // Optional
//     languages: {
//         language: string;
//         proficiency: string;
//     }[];
//     interests?: string[]; // Optional
// }
