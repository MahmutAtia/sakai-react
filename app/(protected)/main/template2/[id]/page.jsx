"use client";
import React from "react";
import { useParams } from 'next/navigation';
import { ResumeProvider } from "./ResumeContext";
import ResumePreview from "./ResumePreview";
import Template3 from "./template3/template3";
import ThemeSelector from "./ThemeSelector";
import TemplateSelector from "./TemplateSelector";
import Template2 from "./template2/ResumeTemplate2";

// Add PrimeReact imports
import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.min.css";
import "primeflex/primeflex.css";

function App() {
  const params = useParams();
  const [template, setTemplate] = React.useState("template1");
  const pageId = params.id; // Get ID from router

  return (
    <ResumeProvider pageId={pageId}>
      <div className="flex relative">
        <TemplateSelector setTemplate={setTemplate} />
        <div className="flex-1 p-4">
          <ThemeSelector />
          {template === "template1" ? <ResumePreview /> : <Template2/>}
        </div>
      </div>
    </ResumeProvider>
  );
}

export default App;
