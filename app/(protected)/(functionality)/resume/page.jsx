"use client";
import React, { useState, useRef } from 'react';
import { FileUpload } from 'primereact/fileupload';
import { ProgressSpinner } from 'primereact/progressspinner';
import { Toast } from 'primereact/toast';
import { Card } from 'primereact/card';
import { useRouter } from 'next/navigation';

const LandingPage = () => {
    const [isProcessing, setIsProcessing] = useState(false);
    const [processingStatus, setProcessingStatus] = useState('');
    const toast = useRef(null);
    const router = useRouter();

    const handleFileUpload = async (event) => {
        const file = event.files[0];
        setIsProcessing(true);

        try {
            // Create FormData
            const formData = new FormData();
            formData.append('file', file);
            setProcessingStatus('Uploading your resume...');

            // Upload file
            const response = await fetch('/api/resume/upload', {
                method: 'POST',
                body: formData
            });

            if (!response.ok) throw new Error('Upload failed');

            setProcessingStatus('Processing your resume...');
            const data = await response.json();

            // Redirect to editor
            router.push(`/editor/${data.resumeId}`);

        } catch (error) {
            toast.current.show({
                severity: 'error',
                summary: 'Upload Failed',
                detail: 'Please try again'
            });
        } finally {
            setIsProcessing(false);
            setProcessingStatus('');
        }
    };

    return (
        <div className="flex align-items-center justify-content-center min-h-screen surface-ground">
            <Toast ref={toast} />

            <Card className="surface-card p-5 border-round-xl shadow-2 w-full md:w-8 lg:w-6">
                <div className="flex flex-column align-items-center gap-4">
                    <h1 className="text-3xl font-bold text-center m-0">
                        Create Your Professional Resume
                    </h1>

                    <p className="text-700 text-center line-height-3 m-0">
                        Start by uploading your existing resume or create a new one from scratch
                    </p>

                    <div className="w-full">
                        {isProcessing ? (
                            <div className="flex flex-column align-items-center gap-3 py-5">
                                <ProgressSpinner
                                    style={{width: '50px', height: '50px'}}
                                    animationDuration=".5s"
                                />
                                <span className="text-lg">{processingStatus}</span>
                            </div>
                        ) : (
                            <FileUpload
                                mode="advanced"
                                accept=".pdf,.doc,.docx,.txt"
                                maxFileSize={5000000}
                                customUpload
                                uploadHandler={handleFileUpload}
                                auto
                                chooseLabel="Select Resume"
                                className="upload-custom"
                                emptyTemplate={
                                    <div className="flex flex-column align-items-center gap-3 py-5">
                                        <i className="pi pi-upload text-4xl text-500"></i>
                                        <span className="text-700">
                                            Drag and drop your resume here or click to browse
                                        </span>
                                        <span className="text-500 text-sm">
                                            Supported formats: PDF, DOC, DOCX, TXT (up to 5MB)
                                        </span>
                                    </div>
                                }
                            />
                        )}
                    </div>

                    <div className="flex gap-3">
                        <button
                            className="p-button p-button-text"
                            onClick={() => router.push('/editor')}
                        >
                            Start from scratch
                        </button>
                    </div>
                </div>
            </Card>
        </div>
    );
};

export default LandingPage;
