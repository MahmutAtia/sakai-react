"use client";
import React, { useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Toast } from 'primereact/toast';
import { Button } from 'primereact/button';
import EditableResumeTemplate from './EditableResumeTemplate';
import { ResumeProvider } from './ResumeContext';
import { useEffect, useState } from 'react';

const ResumeEditorPage = () => {
    const router = useRouter();
    const toast = useRef(null);



    const [resumeData, setResumeData] = useState(null);

    useEffect(() => {
        const data = localStorage.getItem('resumeData');
        if (data) {
            setResumeData(JSON.parse(data));
        } else {
            console.error("No resume data found in local storage.");
            // Optionally, redirect back to the dashboard or show an error message
        }
    }, []);

    if (!resumeData) return <div>No resume data provided</div>;

    return (
        <div className="surface-ground min-h-screen">
            <Toast ref={toast} />

            <div className="flex justify-content-between align-items-center p-4 surface-card shadow-1 mb-4">
                <h1 className="text-2xl font-semibold m-0">Resume Editor</h1>
                <div className="flex gap-2">
                    <Button
                        icon="pi pi-download"
                        label="Export"
                        className="p-button-outlined"
                    />
                    <Button
                        icon="pi pi-save"
                        label="Save"
                        severity="success"
                    />
                </div>
            </div>

            <div className="p-4">
                <ResumeProvider initialData={resumeData}>
                    <EditableResumeTemplate />
                </ResumeProvider>
            </div>
        </div>
    );
};

export default ResumeEditorPage;
