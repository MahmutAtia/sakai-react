"use client";
import React, { useState, useEffect } from "react";
import { useResume } from "./ResumeContext"; // Context for resume data and theme
import "./styles.css"; // Styling for the template
import { ProgressSpinner } from "primereact/progressspinner"; // PrimeReact component for loading spinner


const ResumePreview = () => {
    const { resumeData, theme } = useResume();


    if (!resumeData) {
        return (
            <div className="loading-spinner">
                <ProgressSpinner />
            </div>
        );
    }



    return (
        <div className={`resume-preview a4-page ${theme}`}>
            {/* Header Section */}
            <div className="resume-header">
                <div className="header-content">
                    <div className="name-title">
                        <h1>{resumeData.personal_information.name}</h1>
                        <h2>{resumeData.personal_information.title}</h2>
                    </div>
                    <div className="contact-info">
                        <p>{resumeData.personal_information.email}</p>
                        <p>{resumeData.personal_information.phone.join(", ")}</p>
                        <p>
                            {resumeData.personal_information.location.city},{" "}
                            {resumeData.personal_information.location.state},{" "}
                            {resumeData.personal_information.location.postal_code}
                        </p>
                        <div className="profiles">
                            {resumeData.personal_information.profiles.linkedin && (
                                <a href={resumeData.personal_information.profiles.linkedin}>LinkedIn</a>
                            )}
                            {resumeData.personal_information.profiles.github && (
                                <a href={resumeData.personal_information.profiles.github}>GitHub</a>
                            )}
                            {resumeData.personal_information.profiles.website && (
                                <a href={resumeData.personal_information.profiles.website}>Website</a>
                            )}
                            {resumeData.personal_information.profiles.portfolio && (
                                <a href={resumeData.personal_information.profiles.portfolio}>Portfolio</a>
                            )}
                        </div>
                    </div>
                </div>
                <div className="profile-image">
                    {resumeData.personal_information.image ? (
                        <img src={resumeData.personal_information.image} alt="Profile" />
                    ) : (
                        <div className="image-placeholder">Placeholder</div>
                    )}
                </div>
            </div>

            {/* Body Section */}
            <div className="resume-body">
                {/* Left Column */}
                <div className="left-column">
                    {/* Profile Section */}
                    {resumeData.summary && (
                        <div className="profile">
                            <h2>Profile</h2>
                            <p>{resumeData.summary}</p>
                        </div>
                    )}

                    {/* Experience Section */}
                    {resumeData.experience && (
                        <div className="experience">
                            <h2>Experience</h2>
                            {resumeData.experience.map((exp) => (
                                <div key={exp.id} className="experience-item">
                                    <h3>{exp.title}</h3>
                                    <p>
                                        {exp.company} | {exp.start_date} - {exp.end_date || "Present"}
                                    </p>
                                    <p>{exp.description}</p>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Education Section */}
                    {resumeData.education && (
                        <div className="education">
                            <h2>Education</h2>
                            {resumeData.education.map((edu) => (
                                <div key={edu.id} className="education-item">
                                    <h3>{edu.degree}</h3>
                                    <p>
                                        {edu.institution} | {edu.graduation_date}
                                    </p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Right Column */}
                <div className="right-column">
                    {/* Skills Section */}
                    {resumeData.skills && (
                        <div className="skills">
                            <h2>Skills</h2>
                            <ul>
                                {resumeData.skills.map((skill) => (
                                    <li key={skill.id}>
                                        <strong>{skill.name}:</strong> {skill.keywords.join(", ")}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {/* Interests Section */}
                    {resumeData.interests && (
                        <div className="interests">
                            <h2>Interests</h2>
                            <ul>
                                {resumeData.interests.map((interest, index) => (
                                    <li key={index}>{interest}</li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};



export default ResumePreview;
