"use client";
import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { ProgressSpinner } from 'primereact/progressspinner';
import { Toast } from 'primereact/toast';
import { Button } from 'primereact/button';
import EditableResumeTemplate from '../EditableResumeTemplate';
import { ResumeProvider } from '../ResumeContext';
import axios from 'axios';
import { useSession } from 'next-auth/react';

const ResumeEditorPage = ({ params }) => {
    const [loading, setLoading] = useState(true);
    const [resumeData, setResumeData] = useState(null);
    const router = useRouter();
    const toast = useRef(null);
    const { data: session, status } = useSession();
    useEffect(() => {
        const fetchResumeData = async () => {
            if (status === 'loading') return;

            setLoading(true);

            // If data is in local storage, get the resume data with the id from local storage
            const data = localStorage.getItem('data');


            if (data) {
                // Data is an array of objects which contains the resume
                console.log(data);
                const resume = JSON.parse(data).find((item) => item.id === Number(params.id));
                setResumeData(resume.resume);
                setLoading(false);
                return;
            }

            try {
                const response = await axios.get(
                    `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/resumes/${params.id}`,
                    {
                        headers: {
                            'Content-Type': 'application/json',
                            ...(session?.accessToken && {
                                'Authorization': `Bearer ${session.accessToken}`
                            })
                        }
                    }
                );
                console.log(response);
                const resume = response.data.resume;
                setResumeData(resume);
                console.log(resume);
            } catch (error) {
                toast.current?.show({
                    severity: 'error',
                    summary: 'Error',
                    detail: error.message,
                    life: 3000
                });
            } finally {
                setLoading(false);
            }
        };

        fetchResumeData();
    }, [params.id, session, status]);

    if (loading) return <div> <ProgressSpinner /> </div>;
    if (!resumeData) return <div>No resume found</div>;


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
