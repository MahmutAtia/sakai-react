"use client";
import React, { useRef, useState,
    useEffect
 } from 'react';
import InteractiveResumeTemplate from './InteractiveResumeTemplate';
import './s.css';

const ResumeBuilder = () => {
    const [resumeData, setResumeData] = useState({ });

   // get data from data local storage
  useEffect(() => {
    const storedData = localStorage.getItem("data");
    if (storedData) {
      const parsedData = JSON.parse(storedData);
      if (parsedData.length > 0) {
        setResumeData(parsedData[0].resume); // Set the first resume data from localStorage
      }
    }
  }, []);

  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const resumeRef = useRef();

  return (

    <div className="resume-builder">
      <TemplateSidebar onSelectTemplate={setSelectedTemplate} />
      <MainPreview selectedTemplate={selectedTemplate} resumeData={resumeData} ref={resumeRef} />
      {/* <ExportButtons resumeRef={resumeRef} /> Ensure this is used correctly */}
    </div>
  );
};


import ReactToPrint from 'react-to-print';
import { saveAs } from 'file-saver';
import Docxtemplater from 'docxtemplater';
import PizZip from 'pizzip';

const ExportButtons = ({ resumeRef }) => {
  const handleExportDocx = () => {
    const content = resumeRef.current.innerHTML;
    const zip = new PizZip();
    const doc = new Docxtemplater().loadZip(zip);
    doc.setData({ content });
    doc.render();
    const out = doc.getZip().generate({ type: 'blob' });
    saveAs(out, 'resume.docx');
  };

  return (
    <div className="export-buttons">
      <ReactToPrint
        trigger={() => <button>Export as PDF</button>}
        content={() => resumeRef.current}
      />
      <button onClick={handleExportDocx}>Export as DOCX</button>
    </div>
  );
};

const DovileTemplate = ({ data }) => {
    return (
      <div className="dovile-template">
        <header>
          <h1>{data.personal_information.name}</h1>
          <p>{data.personal_information.email}</p>
          <p>{data.personal_information.phone.join(", ")}</p>
        </header>
        <section className="summary">
          <h2>Summary</h2>
          <p>{data.summary}</p>
        </section>
        <section className="experience">
          <h2>Experience</h2>
          {data.experience.map((exp) => (
            <div key={exp.id}>
              <h3>{exp.title} at {exp.company}</h3>
              <p>{exp.start_date} - {exp.end_date || "Present"}</p>
              <p>{exp.description}</p>
            </div>
          ))}
        </section>
      </div>
    );
  };


  const DracoTemplate = ({ data }) => {
    return (
      <div className="draco-template">
        <header>
          <h1>{data.personal_information.name}</h1>
          <p>{data.personal_information.email}</p>
        </header>
        <section className="skills">
          <h2>Skills</h2>
          <ul>
            {data.skills.map((skill) => (
              <li key={skill.id}>{skill.name}</li>
            ))}
          </ul>
        </section>
        <section className="projects">
          <h2>Projects</h2>
          {data.projects.map((project) => (
            <div key={project.id}>
              <h3>{project.name}</h3>
              <p>{project.description}</p>
            </div>
          ))}
        </section>
      </div>
    );
  };


  const MinimalResumeTemplate = ({ data }) => {
    return (
      <div className="minimal-template">
        <header>
          <h1>{data.personal_information.name}</h1>
          <p>{data.personal_information.email}</p>
        </header>
        <section className="education">
          <h2>Education</h2>
          {data.education.map((edu) => (
            <div key={edu.id}>
              <h3>{edu.degree} in {edu.major}</h3>
              <p>{edu.institution}</p>
              <p>{edu.graduation_date}</p>
            </div>
          ))}
        </section>
        <section className="certifications">
          <h2>Certifications</h2>
          {data.certifications.map((cert) => (
            <div key={cert.id}>
              <h3>{cert.name}</h3>
              <p>{cert.issuing_authority}</p>
            </div>
          ))}
        </section>
      </div>
    );
  };




  const MainPreview = ({ selectedTemplate, resumeData }) => {
    const renderTemplate = () => {
      switch (selectedTemplate) {
        case 1:
          return <DovileTemplate data={resumeData} />;
        case 2:
          return <DracoTemplate data={resumeData} />;
        case 3:
          return <MinimalResumeTemplate data={resumeData} />;
        case 4:
          return <InteractiveResumeTemplate data={resumeData} />;
        default:
          return <p>Select a template to preview.</p>;
      }
    };

    return <div className="main-preview">{renderTemplate()}</div>;
  };



const templates = [
  { id: 1, name: 'OpenResume', preview: '/templates/openresume-preview.png' },
  { id: 2, name: 'React JS Resume', preview: '/templates/react-resume-preview.png' },
  { id: 3, name: 'HTML Resume', preview: '/templates/html-resume-preview.png' },
  { id: 4, name: 'Universal Resume', preview: '/templates/universal-resume-preview.png' },
];

const TemplateSidebar = ({ onSelectTemplate }) => {
  return (
    <div className="sidebar">
      {templates.map((template) => (
        <div key={template.id} onClick={() => onSelectTemplate(template.id)}>
          <img src={template.preview} alt={template.name} />
          <p>{template.name}</p>
        </div>
      ))}
    </div>
  );
};







export default ResumeBuilder;
