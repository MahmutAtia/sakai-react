import React from "react";
import { jsPDF } from "jspdf";
import { useResume } from "../ResumeContext";
import Markdown from 'react-markdown';
import "./Template2Styles.css"

const ResumeTemplate2 = () => {
  const { resumeData, theme } = useResume();

  const generatePDF = () => {
    const doc = new jsPDF({
      unit: "mm",
      format: [210, 297],
    });
    const element = document.getElementById("resume-content");

    doc.html(element, {
      callback: function (pdf) {
        pdf.save("resume.pdf");
      },
      margin: [10, 10, 10, 10],
      scaling: 0.9,
    });
  };

  if (!resumeData ) {
    return <div>Loading resume data...</div>;
  }

  const {
    personal_information = {},
    summary,
    objective,
    experience = [],
    education = [],
    skills = [],
    projects = [],
    awards_and_recognition = [],
    certifications = [],
    languages = [],
    interests = [],
  } = resumeData;

  const { profiles = {}, location = {} } = personal_information;

  return (
    <div className="resume-wrapper" id="resume-content">
      <section className="profile section-padding">
        <div className="container">
          {profiles.portfolio && (
            <div className="picture-resume-wrapper">
              <div className="picture-resume">
                <span>
                  <img src={profiles.portfolio} alt="Profile" />
                </span>
                <svg version="1.1" viewBox="0 0 350 350">
                  <defs>
                    <filter id="goo">
                      <feGaussianBlur in="SourceGraphic" stdDeviation="8" result="blur" />
                      <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 21 -9" result="cm" />
                    </filter>
                  </defs>
                  <g filter="url(#goo)">
                    <circle id="main_circle" className="st0" cx="171.5" cy="175.6" r="130" />
                    {/* ... (rest of SVG circles) */}
                  </g>
                </svg>
              </div>
              <div className="clearfix"></div>
            </div>
          )}

          <div className="name-wrapper"><h1>{personal_information.name}</h1></div>
          <div className="clearfix"></div>

          <div className="contact-info clearfix">
            <ul className="list-titles"><li>Call</li><li>Mail</li><li>Web</li><li>Home</li></ul>
            <ul className="list-content">
              <li>{personal_information.phone.join(", ") || "N/A"}</li>
              <li>{personal_information.email || "N/A"}</li>
              <li><a href={profiles.website || "#"}>{profiles.website || "N/A"}</a></li>
              <li>{location.city ? `${location.city}, ${location.state || ''}` : "N/A"}</li>
            </ul>
          </div>
          {summary && (<div className="contact-presentation"><p>{summary}</p></div>)}

          <div className="contact-social clearfix">
            <ul className="list-titles"><li>LinkedIn</li><li>GitHub</li></ul>
            <ul className="list-content">
              <li><a href={profiles.linkedin || "#"}>{profiles.linkedin || "N/A"}</a></li>
              <li><a href={profiles.github || "#"}>{profiles.github || "N/A"}</a></li>
            </ul>
          </div>
        </div>
      </section>

      <section className="experience section-padding">
        <div className="container">
          <h3 className="experience-title">Experience</h3>
          <div className="experience-wrapper">
            {experience.length > 0 ? (
              experience.map((exp) => (
                <div key={exp.id}>
                  <div className="company-wrapper clearfix">
                    <div className="experience-title">{exp.company}</div>
                    <div className="time">{exp.start_date} - {exp.end_date}</div>
                  </div>
                  <div className="job-wrapper clearfix">
                    <div className="experience-title">{exp.title}</div>
                    <div className="company-description">
                      <p>{exp.description}</p>
                      {exp.technologies && exp.technologies.length > 0 && (
                        <p>Technologies: {exp.technologies.join(", ")}</p>
                      )}
                    </div>
                  </div>
                </div>
              ))
            ) : (<p>No experience data available.</p>)}
          </div>

          <div className="section-wrapper clearfix">
            <h3 className="section-title">Skills</h3>
            {skills.length > 0 ? (
              <ul>
                {skills.map((skill) => (
                  <li key={skill.id} className="skill-percentage">{skill.name}</li>
                ))}
              </ul>
            ) : (<p>No skills data available.</p>)}
          </div>

          {projects.length > 0 && (
            <div className="section-wrapper clearfix">
              <h3 className="section-title">Projects</h3>
              <ul>
                {projects.map((project) => (
                  <li key={project.id}>
                    <a href={project.link || "#"}>{project.name}</a>: {project.description}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {education.length > 0 && (
            <div className="section-wrapper clearfix">
              <h3 className="section-title">Education</h3>
              <ul>
                {education.map((edu) => (
                  <li key={edu.id}>
                    {edu.institution}, {edu.degree} in {edu.major} ({edu.graduation_date})
                  </li>
                ))}
              </ul>
            </div>
          )}

          {certifications.length > 0 && (
            <div className="section-wrapper clearfix">
              <h3 className="section-title">Certifications</h3>
              <ul>
                {certifications.map((cert) => (
                  <li key={cert.id}>
                    {cert.name} from {cert.issuing_authority} ({cert.date_obtained})
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </section>

      <div className="clearfix"></div>
      <button onClick={generatePDF}>Download PDF</button>
    </div>
  );
};

export default ResumeTemplate2;
