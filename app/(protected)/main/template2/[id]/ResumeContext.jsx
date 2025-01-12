"use client";
import React, { createContext, useState, useEffect } from "react";

// Create the context
export const ResumeContext = createContext();

// Context Provider Component
export const ResumeProvider = ({ children, pageId }) => {
    // State for resume data
    const [resumeData, setResumeData] = useState(null);
    const [theme, setTheme] = useState("light"); // Default theme


    // Load data from localStorage on component mount
    useEffect(() => {
        const storedData = localStorage.getItem("data");
        console.log("Stored data:", storedData); // Debug log

        if (storedData) {
            const parsedData = JSON.parse(storedData);
            console.log("Parsed data:", parsedData); // Debug log

            // Find resume by pageId
            const foundItem = parsedData.find(item => item.id === Number(pageId));
            console.log("Found item:", foundItem); // Debug log

            const selectedResume = foundItem?.resume;
            console.log("Selected resume:", selectedResume); // Debug log

            if (selectedResume) {
                setResumeData(selectedResume);
            } else {
                console.log("No resume found for pageId:", pageId); // Debug log
            }
        } else {
            console.log("No data found in localStorage"); // Debug log
        }
    }, [pageId]);

    return (
        <ResumeContext.Provider value={{ resumeData , theme, setTheme }}>
            {children}
        </ResumeContext.Provider>
    );
};

// Custom hook to use the context
export const useResume = () => React.useContext(ResumeContext);
