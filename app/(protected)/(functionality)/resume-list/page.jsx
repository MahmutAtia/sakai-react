"use client";
import React, { useState } from 'react';
import { Card } from 'primereact/card';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { TabView, TabPanel } from 'primereact/tabview';
import { useRouter } from 'next/navigation';

const PositionTemplatesPage = () => {
    const [showTemplates, setShowTemplates] = useState(false);
    const [selectedPosition, setSelectedPosition] = useState(null);
    const router = useRouter();

    const positions = [
        {
            id: 'software-engineer',
            title: 'Software Engineer',
            icon: 'pi pi-code',
            description: 'Tech-focused templates for software development roles',
            documents: {
                resume: [
                    { id: 'tech-modern', name: 'Modern Tech Resume', preview: '/tech-modern.png' },
                    { id: 'tech-minimal', name: 'Clean Code Resume', preview: '/tech-minimal.png' }
                ],
                coverLetter: [
                    { id: 'tech-letter', name: 'Tech Cover Letter', preview: '/tech-letter.png' },
                    { id: 'startup-letter', name: 'Startup Style', preview: '/startup-letter.png' }
                ],
                portfolio: [
                    { id: 'dev-portfolio', name: 'Developer Portfolio', preview: '/dev-portfolio.png' }
                ]
            }
        },
        {
            id: 'product-manager',
            title: 'Product Manager',
            icon: 'pi pi-chart-line',
            description: 'Strategic templates highlighting product leadership',
            documents: {
                resume: [
                    { id: 'pm-strategic', name: 'Strategic PM Resume', preview: '/pm-strategic.png' },
                    { id: 'pm-data', name: 'Data-Driven PM Resume', preview: '/pm-data.png' }
                ],
                coverLetter: [
                    { id: 'pm-letter', name: 'PM Cover Letter', preview: '/pm-letter.png' }
                ],
                casestudy: [
                    { id: 'product-case', name: 'Product Case Study', preview: '/product-case.png' }
                ]
            }
        },
        // Add more positions...
    ];

    const handlePositionSelect = (position) => {
        setSelectedPosition(position);
        setShowTemplates(true);
    };

    const handleTemplateSelect = (template, type) => {
        router.push(`/editor?template=${template.id}&position=${selectedPosition.id}&type=${type}`);
    };

    return (
        <div className="surface-ground min-h-screen p-4">
            <div className="flex flex-column align-items-center max-w-6xl mx-auto">
                <h1 className="text-4xl font-bold mb-4 text-center">Choose Your Career Path</h1>
                <p className="text-700 text-xl mb-6 text-center">
                    Select your position to view tailored document templates
                </p>

                <div className="grid">
                    {positions.map((position) => (
                        <div key={position.id} className="col-12 md:col-6 lg:col-4 p-3">
                            <Card
                                className="surface-card shadow-2 border-round-xl cursor-pointer transition-colors transition-duration-300 hover:surface-hover"
                                onClick={() => handlePositionSelect(position)}
                            >
                                <div className="flex flex-column align-items-center gap-3 p-3">
                                    <i className={`${position.icon} text-4xl text-primary`}></i>
                                    <h2 className="text-xl font-semibold m-0">{position.title}</h2>
                                    <p className="text-700 text-center m-0">{position.description}</p>
                                </div>
                            </Card>
                        </div>
                    ))}
                </div>
            </div>

            <Dialog
                visible={showTemplates}
                onHide={() => setShowTemplates(false)}
                header={selectedPosition?.title}
                className="w-full md:w-8 lg:w-6"
            >
                <TabView>
                    {selectedPosition && Object.entries(selectedPosition.documents).map(([type, templates]) => (
                        <TabPanel key={type} header={type.charAt(0).toUpperCase() + type.slice(1)}>
                            <div className="grid">
                                {templates.map((template) => (
                                    <div key={template.id} className="col-12 md:col-6 p-3">
                                        <Card
                                            className="surface-card shadow-1 border-round-xl cursor-pointer transition-all transition-duration-300 hover:shadow-3"
                                            onClick={() => handleTemplateSelect(template, type)}
                                        >
                                            <div className="flex flex-column gap-3">
                                                <img
                                                    src={template.preview}
                                                    alt={template.name}
                                                    className="w-full border-round-lg"
                                                />
                                                <div className="flex align-items-center justify-content-between">
                                                    <span className="text-lg font-medium">{template.name}</span>
                                                    <Button
                                                        icon="pi pi-arrow-right"
                                                        className="p-button-rounded p-button-text"
                                                    />
                                                </div>
                                            </div>
                                        </Card>
                                    </div>
                                ))}
                            </div>
                        </TabPanel>
                    ))}
                </TabView>
            </Dialog>
        </div>
    );
};

export default PositionTemplatesPage;
