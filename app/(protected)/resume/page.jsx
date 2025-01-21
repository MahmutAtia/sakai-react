'use client';
import React, { useState, useRef, useCallback } from 'react';
import { Steps } from 'primereact/steps';
import { Card } from 'primereact/card';
import { RadioButton } from 'primereact/radiobutton';
import { Dropdown } from 'primereact/dropdown';
import { InputTextarea } from 'primereact/inputtextarea';
import { FileUpload } from 'primereact/fileupload';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { motion, AnimatePresence } from 'framer-motion';
import { Checkbox } from 'primereact/checkbox';
import { useRouter } from 'next/navigation';
import debounce from 'lodash/debounce';


const ResumeBuilder = () => {
    const [activeIndex, setActiveIndex] = useState(0);
    // Update formData structure
    const [formData, setFormData] = useState({
        purpose: '',
        targetLanguage: '',
        description: '',
        documentPreferences: {
            coverLetter: false,
            motivationLetter: false,
            recommendationLetter: false
        }
    });

    const debouncedUpdate = useCallback(
        debounce((value) => {
            setFormData(prev => ({ ...prev, description: value }));
        }, 300),
        []
    );
    const toast = useRef(null);
    const router = useRouter();

    const steps = [
        { label: 'Purpose' },
        { label: 'Target Details' },
        { label: 'Additional Documents' },
        { label: 'Final Resume' }
    ];

    const languages = [
        { label: 'English', value: 'English' },
        { label: 'German', value: 'German' },
        { label: 'French', value: 'French' },
        { label: 'Spanish', value: 'Spanish' },
        { label: 'Italian', value: 'Italian' },
        { label: 'Arabic', value: 'Arabic' },
        { label: 'Portuguese', value: 'Portuguese' },
        { label: 'Russian', value: 'Russian' },
        { label: 'Chinese', value: 'Chinese' },
        { label: 'Japanese', value: 'Japanese' }


    ];

    const StepContent = ({ children }) => (
        <div className="p-4">
            {children}
        </div>
    );

    const renderStep = () => {
        switch (activeIndex) {
            case 0:
                return (
                    <StepContent>
                        <h2 className="text-2xl font-bold mb-4">What's your purpose?</h2>
                        <div className="flex flex-column gap-4">
                            {['job', 'scholarship'].map((type) => (
                                <motion.div
                                    key={type}
                                    whileHover={{ scale: 1.02 }}
                                    className="surface-card p-4 border-round shadow-1 cursor-pointer"
                                    onClick={() => setFormData({ ...formData, purpose: type })}
                                >
                                    <RadioButton
                                        inputId={type}
                                        name="purpose"
                                        value={type}
                                        onChange={(e) => setFormData({ ...formData, purpose: e.value })}
                                        checked={formData.purpose === type}
                                    />
                                    <label htmlFor={type} className="ml-2 font-medium capitalize">
                                        {type} Application
                                    </label>
                                </motion.div>
                            ))}
                        </div>
                    </StepContent>
                );

            case 1:
                return (
                    <StepContent>
                        <h2 className="text-2xl font-bold mb-4">Target Details</h2>
                        <div className="flex flex-column gap-4">
                            <div className="field">
                                <label className="block mb-2">Target Language</label>
                                <Dropdown
                                    value={formData.targetLanguage}
                                    options={languages}
                                    onChange={(e) => setFormData({ ...formData, targetLanguage: e.value })}
                                    placeholder="Select Language"
                                    className="w-full"
                                />
                            </div>
                            <div className="field">
                                <label className="block mb-2">
                                    {formData.purpose === 'job' ? 'Job Description' : 'Scholarship Details'}
                                </label>
                                <div className="flex flex-column gap-2">
                                    <InputTextarea
                                        value={formData.description}
                                        onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                                        rows={5}
                                        className="w-full"
                                    />
                                    <Button
                                        icon="pi pi-paste"
                                        label="Paste"
                                        className="p-button-outlined"
                                        onClick={async () => {
                                            try {
                                                const text = await navigator.clipboard.readText();
                                                setFormData(prev => ({ ...prev, description: text }));
                                            } catch (err) {
                                                console.error('Failed to read clipboard:', err);
                                            }
                                        }}
                                    />
                                </div>
                            </div>
                        </div>
                    </StepContent>

                );



            case 2:
                return (
                    <StepContent>
                        <h2 className="text-2xl font-bold mb-4">Which documents would you like to generate?</h2>
                        <div className="flex flex-column gap-4">
                            {[
                                {
                                    id: 'coverLetter',
                                    label: 'Cover Letter',
                                    description: 'A professional letter introducing your qualifications'
                                },
                                {
                                    id: 'motivationLetter',
                                    label: 'Motivation Letter',
                                    description: 'Express your motivation and goals'
                                },
                                {
                                    id: 'recommendationLetter',
                                    label: 'Recommendation Letter Template',
                                    description: 'A template for your recommender'
                                }
                            ].map((doc) => (
                                <motion.div
                                    key={doc.id}
                                    whileHover={{ scale: 1.02 }}
                                    className={`surface-card p-4 border-round shadow-1 cursor-pointer ${formData.documentPreferences[doc.id] ? 'border-primary border-2' : ''
                                        }`}
                                    onClick={() => {
                                        setFormData({
                                            ...formData,
                                            documentPreferences: {
                                                ...formData.documentPreferences,
                                                [doc.id]: !formData.documentPreferences[doc.id]
                                            }
                                        });
                                    }}
                                >
                                    <div className="flex align-items-center justify-content-between">
                                        <div className="flex flex-column gap-2">
                                            <div className="flex align-items-center">
                                                <Checkbox
                                                    checked={formData.documentPreferences[doc.id]}
                                                    onChange={(e) => {
                                                        setFormData({
                                                            ...formData,
                                                            documentPreferences: {
                                                                ...formData.documentPreferences,
                                                                [doc.id]: e.checked
                                                            }
                                                        });
                                                    }}
                                                />
                                                <label className="ml-2 font-medium text-lg">{doc.label}</label>
                                            </div>
                                            <span className="text-500 ml-6">{doc.description}</span>
                                        </div>
                                        {formData.documentPreferences[doc.id] && (
                                            <i className="pi pi-check text-primary text-xl"></i>
                                        )}
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </StepContent>
                );


            case 3:
                return (
                    <StepContent>
                        <h2 className="text-2xl font-bold mb-4">Upload Your Resume</h2>
                        <FileUpload
                            mode="advanced"
                            accept=".pdf,.doc,.docx,.txt"
                            maxFileSize={5000000}
                            customUpload
                            uploadHandler={handleFinalSubmit}
                            chooseLabel="Select Resume"
                            className="w-full"
                        />
                    </StepContent>
                );
        }
    };

    const handleFinalSubmit = async (event) => {
        try {
            const finalFormData = new FormData();
            finalFormData.append('resume', event.files[0]);
            finalFormData.append('formData', JSON.stringify(formData));

        console.log('finalFormData', finalFormData);
            const response = await fetch('/api/resume/upload', {
                method: 'POST',
                body: finalFormData
            });

            if (!response.ok) throw new Error('Upload failed');

            const data = await response.json();
            router.push(`/main/editor/${data.resumeId}`);
        } catch (error) {
            toast.current.show({
                severity: 'error',
                summary: 'Upload Failed',
                detail: 'Please try again'
            });
        }
    };

    return (
        <div className="surface-ground px-4 py-8 md:px-6 lg:px-8 min-h-screen">
            <Toast ref={toast} />
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex justify-content-center"
            >
                <Card className="w-full md:w-8 lg:w-6">
                    <Steps
                        model={steps}
                        activeIndex={activeIndex}
                        onSelect={(e) => setActiveIndex(e.index)}
                        className="mb-6"
                    />
                    <AnimatePresence mode="wait">
                        {renderStep()}
                    </AnimatePresence>
                    <div className="flex justify-content-between mt-4">
                        <Button
                            label="Back"
                            icon="pi pi-angle-left"
                            onClick={() => setActiveIndex(activeIndex - 1)}
                            disabled={activeIndex === 0}
                            className="p-button-secondary"
                        />
                        <Button
                            label={activeIndex === steps.length - 1 ? 'Submit' : 'Next'}
                            icon="pi pi-angle-right"
                            iconPos="right"
                            onClick={() => setActiveIndex(activeIndex + 1)}
                            disabled={activeIndex === steps.length - 1}
                        />
                    </div>
                </Card>
            </motion.div>
        </div>
    );
};

export default ResumeBuilder;
