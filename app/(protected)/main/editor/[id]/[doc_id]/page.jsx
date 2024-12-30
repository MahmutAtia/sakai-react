"use client";
import React, { useState, useEffect, useRef } from 'react';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { ProgressSpinner } from 'primereact/progressspinner';
import AIAssistant from '../../components/AIAssistant';

const DocEditor = ({ params }) => {
    const [loading, setLoading] = useState(true);
    const [document, setDocument] = useState({ title: '', content: '' });
    const [isEditing, setIsEditing] = useState(false);
    const toast = useRef(null);
    const historyRef = useRef([]);

    useEffect(() => {
        const fetchDocument = async () => {
            setLoading(true);
            try {
                // Get data from localStorage
                const data = localStorage.getItem('data');
                if (data) {
                    const docs = JSON.parse(data).find((item) =>
                        item.id === Number(params.id)
                    )?.other_docs;

                    const doc = docs?.find(d => d.id === params.doc_id);
                    if (doc) {
                        setDocument({ title: doc.title, content: doc.content || '' });
                    }
                }
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

        fetchDocument();
    }, [params.id, params.doc_id]);

    const handleInputChange = (field, value) => {
        historyRef.current.push({ ...document });
        setDocument(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleUndo = () => {
        if (historyRef.current.length > 0) {
            const previousState = historyRef.current.pop();
            setDocument(previousState);
        }
    };

    const toggleEdit = () => {
        setIsEditing(!isEditing);
    };

    if (loading) return <div className="flex justify-content-center"><ProgressSpinner /></div>;

    return (
        <div className="surface-ground min-h-screen">
            <Toast ref={toast} />

            <div className="flex justify-content-between align-items-center p-4 surface-card shadow-1 mb-4">
                <h1 className="text-2xl font-semibold m-0">Document Editor</h1>
                <div className="flex gap-2">
                    <Button
                        icon="pi pi-undo"
                        tooltip="Undo"
                        onClick={handleUndo}
                        disabled={historyRef.current.length === 0}
                        className="p-button-outlined"
                    />
                    <Button
                        icon={isEditing ? "pi pi-check" : "pi pi-pencil"}
                        onClick={toggleEdit}
                        className={isEditing ? "p-button-success" : "p-button-outlined"}
                    />
                </div>
            </div>

            <div className="p-4">
                <div className="surface-card p-4 shadow-2 border-round">
                    <div className="flex flex-column gap-4">
                        <div className="field">
                            <label htmlFor="title" className="block text-lg font-medium mb-2">Title</label>
                            <InputText
                                id="title"
                                value={document.title}
                                onChange={(e) => handleInputChange('title', e.target.value)}
                                disabled={!isEditing}
                                className="w-full"
                            />
                        </div>

                        <div className="field">
                            <label htmlFor="content" className="block text-lg font-medium mb-2">Content</label>
                            <InputTextarea
                                id="content"
                                value={document.content}
                                onChange={(e) => handleInputChange('content', e.target.value)}
                                disabled={!isEditing}
                                rows={20}
                                className="w-full"
                            />
                        </div>

                        {isEditing && (
                            <AIAssistant
                                content={document.content}
                                onSuggestionApply={(newContent) => handleInputChange('content', newContent)}
                            />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DocEditor;
