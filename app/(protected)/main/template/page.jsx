"use client";
import { useState } from 'react';
import ModernTemplate from './ModernTemplate';
import ClassicTemplate from './ClassicTemplate';
import { Button } from 'primereact/button';
import { Slider } from 'primereact/slider';
import './styles.css'
const CVPreview = () => {
    // get data from local storage
    const da = JSON.parse(localStorage.getItem('data'));
    const data = da[0].resume;

    const [selectedTemplate, setSelectedTemplate] = useState(0);

    const templates = [
        { label: 'Modern', value: 'modern' },
        { label: 'Classic', value: 'classic' }
    ];

    const renderTemplate = () => {
        switch (templates[selectedTemplate].value) {
            case 'classic':
                return <ClassicTemplate data={data} />;
            case 'modern':
            default:
                return <ModernTemplate data={data} />;
        }
    };

    const handlePrint = () => {
        document.querySelector('.controls').style.display = 'none';
        window.print();
        document.querySelector('.controls').style.display = 'flex';
    };

    return (
        <div className="p-4">
            <div className="controls flex justify-content-between align-items-center mb-4">
                <Slider
                    value={selectedTemplate}
                    onChange={(e) => setSelectedTemplate(e.value)}
                    min={0}
                    max={templates.length - 1}
                    step={1}
                    style={{ width: '200px' }}
                />
                <Button
                    label="Download PDF"
                    icon="pi pi-download"
                    onClick={handlePrint}
                    className="floating-button"
                />
            </div>
            {renderTemplate()}
        </div>
    );
};

export default CVPreview;
