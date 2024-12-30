'use client';

import React, { useRef } from 'react';
import { FileUpload } from 'primereact/fileupload';
import { Toast } from 'primereact/toast';
import { useSession } from 'next-auth/react';
import { signIn } from 'next-auth/react';

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
const {data: session, status} = useSession();

    return(
        <>
        {session ?(
        <div className="card">
            <h5>Advanced</h5>
            <FileUpload name="demo[]" url="./upload.php" onUpload={onUpload} multiple accept="image/*" maxFileSize={1000000} />
        </div>)
        : (<div className="p-d-flex p-jc-center p-ai-center" style={{height: '100vh'}}>
            <div className="p-text-center">
                <h1>Access Denied</h1>
                <p>You need to be logged in to access this page</p>
                <button className="p-button p-button-primary" onClick={() => signIn("google")}>Sign In</button>
            </div>
            </div>)}

        </>
    )
}
export default FileDemo;
