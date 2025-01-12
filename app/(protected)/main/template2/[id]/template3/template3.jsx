import React from 'react';
import styles from './styles.module.css';
import { useResume } from '../ResumeContext';

const WordSplit = () => {
  const { resumeData, theme } = useResume();
  if (!resumeData ) {
    return <div>Loading or no resume data available.</div>;
  }

  const {
    personal_information = {},
    experience = [],
    education = [],
    skills = [],
    projects = [],
    // ... other sections you want to use
  } = resumeData;

  const { profiles = {}, location = {} } = personal_information;

  const wordsData = [
    personal_information.name?.split(" ")[0] || "Name", // First Name
    personal_information.name?.split(" ")[1] || "Surname", // Last Name
    "Personal",
    "Details",
    "Employment",
    "History",
    "Education",
    "Personal",
    "Skills",
    "Technical",
    "Skills",
    "Get In",
    "Touch",
  ];

  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        {wordsData.map((word, index) => (
          <span className={styles[`word${index + 1}`]} key={index}>
            {word}
          </span>
        ))}

        <div className={styles.bubble1}>
          <span className={styles.theArrow1}></span>
          HI! <br />I AM...<br />
          {personal_information.name || "N/A"}
        </div>

        {profiles.portfolio && (
          <div className={styles.bubble2}>
            <span className={styles.theArrow2}></span>
            <img src={profiles.portfolio} alt="Profile" />
          </div>
        )}

        <div className={styles.bubble3}>
          <span className={styles.theArrow3}></span>
          NATIONALITY...<br /> {/* Add nationality data if available */}
          LOCATION...<br />
          {location.city ? `${location.city}, ${location.state || ''}` : "N/A"}<br />
          BIRTHDAY...<br /> {/* Add birthday data if available */}
          HOBBIES<br /> {/* Add hobbies data if available */}
          {/* ... other personal details */}
        </div>

        <div className={styles.bubble4}>
          <span className={styles.theArrow4}></span>
          {experience.map((exp) => (
            <div key={exp.id}>
              {exp.title} {exp.start_date} - {exp.end_date}<br />
              {exp.description}<br /><br />
            </div>
          ))}
        </div>

        <div className={styles.bubble5}>
          <span className={styles.theArrow5}></span>
          {education.map((edu) => (
            <div key={edu.id}>
              {edu.institution}<br />
              {edu.degree}<br />
              {edu.graduation_date}, GPA {edu.gpa}<br /><br />
            </div>
          ))}
        </div>

        <div className={styles.bubble6}>
          <span className={styles.theArrow6}></span>
          {/* Add personal skills data if available. Map through skills if needed */}
          {skills.map((skill) => <div key={skill.id}>{skill.name}</div>)}
        </div>

        <div className={styles.bubble7}>
          <span className={styles.theArrow7}></span>
          {/* Add technical skills data if available. Map through skills if needed */}
          {skills.map((skill) => <div key={skill.id}>{skill.name}</div>)}
        </div>

        <div className={styles.bubble8}>
          <span className={styles.theArrow8}></span>
          PHONE...<br />
          {personal_information.phone?.join(", ") || "N/A"}<br />
          EMAIL...<br />
          {personal_information.email || "N/A"}<br />
          WEBSITE...<br />
          {profiles.website || "N/A"}<br />
          {/* ... other contact info */}
        </div>
      </div>
    </div>
  );
};

export default WordSplit;
