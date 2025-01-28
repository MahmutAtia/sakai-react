"use client";
import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { ProgressSpinner } from 'primereact/progressspinner';
import { Button } from 'primereact/button';
import EditableResumeTemplate from '../EditableResumeTemplate';
import { ResumeProvider } from '../ResumeContext';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import 'primeflex/primeflex.css';

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
                const resume = JSON.parse(data).find((item) => item.id === Number(params.id));
                if (!resume) {
                    router.push('/main/dashboard');
                    return;
                }
                setResumeData(resume.resume);
                setLoading(false);
                return;
            }

            // get the resume data from the backend if not exists in local storage
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



    return (
        <div className="h-screen overflow-hidden surface-ground">


            {/* Content */}
            {resumeData && (
                <ResumeProvider initialData={resumeData}>
                    <EditableResumeTemplate resumeId={params.id} />
                </ResumeProvider>
            )}

        </div>
    );
};

export default ResumeEditorPage;
