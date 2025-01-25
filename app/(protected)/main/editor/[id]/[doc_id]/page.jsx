"use client";
import React, { useState, useEffect, useRef } from "react";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import { ProgressSpinner } from "primereact/progressspinner";
import { Dialog } from "primereact/dialog";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import styles from './DocEditor.module.css';
import AIAssistant from "../../components/AIAssistant";
const DocEditor = ({ params }) => {
    const [loading, setLoading] = useState(true);
    const [document, setDocument] = useState({ title: "", content: "" });
    const [isEditing, setIsEditing] = useState(false);
    const [aiPrompt, setAiPrompt] = useState("");
    const [isAIProcessing, setIsAIProcessing] = useState(false);
    const [showAIAssistant, setShowAIAssistant] = useState(false);
    const toast = useRef(null);
    const historyRef = useRef([]);

    useEffect(() => {
        const fetchDocument = async () => {
            setLoading(true);
            try {
                const data = localStorage.getItem("data");
                if (data) {
                    const docs = JSON.parse(data).find((item) => item.id === Number(params.id))?.other_docs;
                    const doc = docs?.find((d) => d.id === params.doc_id);
                    if (doc) {
                        setDocument({ title: doc.title, content: doc.content || "" });
                    }
                }
            } catch (error) {
                toast.current?.show({
                    severity: "error",
                    summary: "Error",
                    detail: error.message,
                    life: 3000,
                });
            } finally {
                setLoading(false);
            }
        };

        fetchDocument();
    }, [params.id, params.doc_id]);

    const handleInputChange = (field, value) => {
        historyRef.current.push({ ...document });
        setDocument((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    const handleUndo = () => {
        if (historyRef.current.length > 0) {
            const previousState = historyRef.current.pop();
            setDocument(previousState);
            toast.current.show({
                severity: "info",
                summary: "Undo",
                detail: "Previous state restored",
            });
        }
    };

    const handleAISubmit = async () => {
        if (!aiPrompt.trim()) return;
        setIsAIProcessing(true);
        try {
            const response = await fetch("http://localhost:8000/api/resumes/edit/", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    prompt: aiPrompt,
                    sectionData: document.content,
                    sectionTitle: document.title,
                }),
            });
            const data = await response.json();
            handleInputChange("content", data);
            setAiPrompt("");
            setShowAIAssistant(false);
        } catch (error) {
            console.error(error);
        }
        setIsAIProcessing(false);
    };

    if (loading) {
        return (
            <div className="flex justify-content-center align-items-center min-h-screen">
                <ProgressSpinner />
            </div>
        );
    }



    return (
        <div className="surface-ground min-h-screen p-5">
            {/* Header Section */}
            <div className={`${styles.letterhead} mb-6`}>
                {isEditing ? (
                    <InputText
                        value={document.title}
                        onChange={(e) => handleInputChange("title", e.target.value)}
                        className={`text-3xl font-bold ${styles.letterheadTitle}`}
                        placeholder="Document Title"
                    />
                ) : (
                    <h1 className={styles.letterheadTitle}>{document.title}</h1>
                )}
                <div className="flex justify-content-center gap-2 mt-4">
                    <Button
                        icon="pi pi-undo"
                        tooltip="Undo"
                        onClick={handleUndo}
                        disabled={historyRef.current.length === 0}
                        className="p-button-rounded p-button-text p-button-lg"
                    />
                    <Button
                        icon={isEditing ? "pi pi-check" : "pi pi-pencil"}
                        className={`p-button-rounded p-button-lg ${isEditing ? 'p-button-success' : 'p-button-secondary'
                            }`}
                        onClick={() => setIsEditing(!isEditing)}
                        tooltip={isEditing ? "Save Changes" : "Edit Document"}
                    />
                </div>
            </div>

            {/* A4 Document Area */}
            <div className={styles.bookPage}>
                <div className={styles.bookContent}>
                    {isEditing ? (
                        <InputTextarea
                            value={document.content}
                            onChange={(e) => handleInputChange("content", e.target.value)}
                            className="w-full border-none"
                            rows={35}
                            autoResize
                            placeholder="Start typing your document..."
                        />
                    ) : (
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                            {document.content}
                        </ReactMarkdown>
                    )}
                </div>
            </div>

            {/* AI Assistant Dialog */}
            {showAIAssistant && (
            <div className={styles.aiAssistant}>
                <AIAssistant
                    prompt={aiPrompt}
                    setPrompt={setAiPrompt}
                    onSubmit={handleAISubmit}
                    onClose={() => setShowAIAssistant(false)}
                    isProcessing={isAIProcessing}
                />
            </div>
        )}

            {/* Floating AI Button */}
            {isEditing && (
                <div className={styles.aiButtonContainer}>
                      <Button
            icon={showAIAssistant ? "pi pi-times" : "pi pi-comment"}
            className={`${styles.aiButton} p-button-help p-button-rounded p-button-lg`}
            onClick={() => setShowAIAssistant(!showAIAssistant)}
            tooltip="AI Assistant"
            tooltipOptions={{ position: "left" }}
        />
                </div>
            )}
        </div>
    );
};

export default DocEditor;



//    {/* Enhanced Floating AI Assistant */}
//    {isEditing && (
//     <div className={styles.aiContainer}>
//         {showAIAssistant && (
//             <div className={styles.aiAssistant}>
//                 <AIAssistant
//                     prompt={aiPrompt}
//                     setPrompt={setAiPrompt}
//                     onSubmit={handleAISubmit}
//                     onClose={() => setShowAIAssistant(false)}
//                     isProcessing={isAIProcessing}
//                 />
//             </div>
//         )}
//         <Button
//             icon={showAIAssistant ? "pi pi-times" : "pi pi-comment"}
//             className={`${styles.aiButton} p-button-help p-button-rounded p-button-lg`}
//             onClick={() => setShowAIAssistant(!showAIAssistant)}
//             tooltip="AI Assistant"
//             tooltipOptions={{ position: "left" }}
//         />
//     </div>
// )}
