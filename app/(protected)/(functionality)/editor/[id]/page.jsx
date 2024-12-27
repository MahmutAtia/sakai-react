"use client";
import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { ProgressSpinner } from 'primereact/progressspinner';
import { Toast } from 'primereact/toast';
import { Button } from 'primereact/button';
import EditableResumeTemplate from '../EditableResumeTemplate';
import { ResumeProvider } from '../ResumeContext';

const ResumeEditorPage = ({ params }) => {
    const [loading, setLoading] = useState(true);
    const [resumeData, setResumeData] = useState(null);
    const router = useRouter();
    const toast = useRef(null);

    useEffect(() => {
        const fetchResumeData = async () => {
            try {
                const response = await fetch(`http://localhost:8000/api/resumes/${params.id}`);
                if (!response.ok) throw new Error('Failed to load resume');

                const res = await response.json();
                const { data } = res;
                setResumeData(data);
            } catch (error) {
                toast.current.show({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'Failed to load resume data'
                });
                router.push('/');
            } finally {
                setLoading(false);
            }
        };

        fetchResumeData();
    }, [params.id]);

    console.log("resumeData", resumeData);

    if (loading) {
        return (
            <div className="flex align-items-center justify-content-center min-h-screen surface-ground">
                <div className="flex flex-column align-items-center gap-4">
                    <ProgressSpinner />
                    <span className="text-xl font-medium">Loading your resume...</span>
                </div>
            </div>
        );
    }

    if (!resumeData) {
        return null;
    }

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
                {resumeData && (
                    <ResumeProvider initialData={resumeData}>
                        <EditableResumeTemplate />
                    </ResumeProvider>
                )}
            </div>
        </div>
    );
};

export default ResumeEditorPage;
