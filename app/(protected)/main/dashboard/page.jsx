"use client";
import React, { useState, useEffect } from 'react';
import { Card } from 'primereact/card';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { useRouter } from 'next/navigation';
import { ProgressSpinner } from 'primereact/progressspinner';
import { useSession } from 'next-auth/react';

const PositionTemplatesPage = () => {


    const { data: session, status } = useSession();
    const router = useRouter();
    const [showTemplates, setShowTemplates] = useState(false);
    const [selectedPosition, setSelectedPosition] = useState(null);
    const [positions, setPositions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);


    const handlePositionSelect = (position) => {
        setSelectedPosition(position);
        setShowTemplates(true);
    };

    const handleTemplateSelect = (selectedPosition) => {
     router.push(`/editor/${selectedPosition.id}`);
    };
    // Add these helper functions
    const getDocumentIcon = (type) => {
        const icons = {
            resume: 'pi pi-file',
            coverLetter: 'pi pi-envelope',
            motivation: 'pi pi-heart',
            portfolio: 'pi pi-briefcase'
        };
        return icons[type] || 'pi pi-file';
    };

    const getDocumentDescription = (type) => {
        const descriptions = {
            resume: 'Professional summary of your experience and skills',
            coverLetter: 'Compelling introduction to potential employers',
            motivation: 'Personal statement of career goals',
            portfolio: 'Showcase of your best work and achievements'
        };
        return descriptions[type] || '';
    }

    useEffect(() => {
        if (status === "unauthenticated") {
            router.push('/login');
            return;
        }

        const fetchPositions = async () => {
            try {
                if (!process.env.NEXT_PUBLIC_BACKEND_URL) {
                    throw new Error('Backend URL not configured');
                }

                const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/resumes/`, {
                    headers: {
                        'Authorization': `Bearer ${session?.accessToken}`,
                        'Content-Type': 'application/json',
                    }
                });

                if (response.status === 401) {
                    router.push('/auth/login');
                    return;
                }

                if (!response.ok) {
                    throw new Error('Failed to fetch positions');
                }

                const data = await response.json();
                setPositions(data);
                setLoading(false);

                // add data to local storage
                localStorage.setItem('data', JSON.stringify(data));
            } catch (err) {
                console.error('Error fetching positions:', err);
                setError(err.message);
                setLoading(false);
            }
        };

        if (status === "authenticated") {
            fetchPositions();
        }
    }, [status, session, router]);

    if (status === "loading" || loading) {
        return (
            <div className="flex justify-content-center align-items-center min-h-screen">
                <ProgressSpinner />
            </div>
        );
    }

    // ... rest of your existing code

    if (error) {
        return (
            <div className="flex justify-content-center align-items-center min-h-screen">
                <div className="surface-card p-4 shadow-2 border-round">
                    <h2 className="text-red-500">Error: {error}</h2>
                    <Button label="Retry" onClick={() => window.location.reload()} />
                </div>
            </div>
        );
    }

    return (
        <div className="surface-ground min-h-screen p-4">
            <div className="flex flex-column align-items-center max-w-6xl mx-auto">
                <h1 className="text-4xl font-bold mb-4 text-center">Choose Your Career Path</h1>
                <p className="text-700 text-xl mb-6 text-center">
                    Select your position to view tailored document templates
                </p>

                <div className="grid">




                    {/* other docs */}
                    {positions.map((position) => (
                        <div key={position.id} className="col-12 md:col-6 lg:col-4 p-3">
                            <Card
                                className="surface-card shadow-2 border-round-xl cursor-pointer transition-colors transition-duration-300 hover:surface-hover"
                                onClick={() => handlePositionSelect(position)}
                            >
                                <div className="flex flex-column align-items-center gap-3 p-3">
                                    <i className={`${position.primeicon} text-4xl text-primary`}></i>
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
                header={selectedPosition?.title + " Documents"}
                style={{ width: '90vw', maxWidth: '1200px' }}
                maximizable
                className="p-fluid"
            >
                <div className="grid">

                <div className="col-12 md:col-6 lg:col-3 p-3">
                        <Card
                            className="h-full cursor-pointer transform transition-all hover:shadow-8"
                        >
                            <div className="flex flex-column gap-3">
                                <div className="relative">
                                    <img
                                        src="/path/to/resume-preview.png"
                                        alt="Resume"
                                        className="w-full border-round-lg shadow-2"
                                        style={{ height: '200px', objectFit: 'cover' }}
                                    />
                                </div>
                                <div className="flex align-items-center gap-2 px-2">
                                    <i className="pi pi-file text-2xl text-primary"></i>
                                    <span className="text-xl font-medium">Resume</span>
                                    </div>
                                <p className="text-600 line-height-3 m-0 px-2 pb-3">
                                    Professional summary of your experience and skills
                                </p>
                                <Button
                                    icon="pi pi-arrow-right"
                                    label="Go to Editor"
                                    className="p-button-rounded p-button-outlined mt-3"
                                    onClick={() => handleTemplateSelect(selectedPosition)}
                                />
                            </div>
                        </Card>
                    </div>










                    {selectedPosition?.other_docs.map((doc) => (
                        <div key={doc.id} className="col-12 md:col-6 lg:col-3 p-3">
                            <Card
                                className="h-full cursor-pointer transform transition-all hover:shadow-8"
                                onClick={() => handleTemplateSelect(doc)}
                            >
                                <div className="flex flex-column gap-3">
                                    {/* Preview Image */}
                                    <div className="relative">
                                        <img
                                            src={doc.preview}
                                            alt={doc.title}
                                            className="w-full border-round-lg shadow-2"
                                            style={{ height: '200px', objectFit: 'cover' }}
                                        />
                                    </div>

                                    {/* Document Info */}
                                    <div className="flex align-items-center gap-2 px-2">
                                        <i className={`${getDocumentIcon(doc.id)} text-2xl text-primary`}></i>
                                        <span className="text-xl font-medium">{doc.title}</span>
                                    </div>

                                    {/* Description */}
                                    <p className="text-600 line-height-3 m-0 px-2 pb-3">
                                        {getDocumentDescription(doc.type)}
                                    </p>
                                </div>
                            </Card>
                        </div>
                    ))}
                </div>
            </Dialog>
        </div>
    );
};

export default PositionTemplatesPage;
