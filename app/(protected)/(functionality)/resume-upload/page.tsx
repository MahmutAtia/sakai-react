'use client';

import React, { useRef } from 'react';
import { FileUpload } from 'primereact/fileupload';
import { Toast } from 'primereact/toast';

const FileDemo = () => {
    const toast = useRef<Toast | null>(null);

    const onUpload = () => {
        toast.current?.show({
            severity: 'info',
            summary: 'Success',
            detail: 'File Uploaded',
            life: 3000
        });
    };

    return (
        <div className="grid">
            <Toast ref={toast}></Toast>
            <div className="col-12">
                <div className="card">
                    <h5>Advanced</h5>
                    <FileUpload name="demo[]" url="/api" onUpload={onUpload} multiple accept=".txt,.pdf,.docx"  maxFileSize={1000000}  emptyTemplate={<p className="m-0">Drag and drop files to here to upload.</p>}
                     />

                </div>
            </div>
        </div>
    );
};

export default FileDemo;