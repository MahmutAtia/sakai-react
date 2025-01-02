// app/api/resume/upload/route.ts
import { NextResponse } from 'next/server';
import mammoth from 'mammoth';
import { getServerSession } from "next-auth/next"
import { authOptions } from "../../auth/[...nextauth]/options"
import * as pdfjsLib from 'pdfjs-dist';
// Configure PDF.js worker
if (typeof window === 'undefined') {
    const pdfjsWorker = require('pdfjs-dist/legacy/build/pdf.worker.entry');
    pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker;
}


// Configure for larger file uploads
export const config = {
    api: {
        bodyParser: false,
        responseLimit: '5mb',
    },
};

export async function POST(request: Request) {



    try {

        // Get form data from request
        const formData = await request.formData();

        // pop the text from the file  from the form data

        const file = formData.get('resume') as File;

        if (!file) {
            return NextResponse.json(
                { error: 'No file provided' },
                { status: 400 }
            );
        }

        // Read file as buffer
        const buffer = Buffer.from(await file.arrayBuffer());
        let text = '';
        const fileType = file.type;

        // Process different file types
        if (fileType === 'application/pdf') {
            try {
                const formData = await request.formData();
                const file = formData.get('file') as File;

                if (!file) {
                    return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
                }

                const buffer = await file.arrayBuffer();
                const uint8Array = new Uint8Array(buffer);

                try {
                    const loadingTask = pdfjsLib.getDocument({ data: uint8Array });
                    const pdfDoc = await loadingTask.promise;
                    let text = '';

                    for (let i = 1; i <= pdfDoc.numPages; i++) {
                        const page = await pdfDoc.getPage(i);
                        const content = await page.getTextContent();
                        text += content.items.map((item: any) => item.str).join(' ');
                    }

                    return NextResponse.json({
                        success: true,
                        text: text
                    });

                } catch (pdfError) {
                    console.error("PDF Parsing Error:", pdfError);
                    return NextResponse.json({ error: 'PDF parsing failed' }, { status: 500 });
                }
            } catch (error) {
                console.error("Upload Error:", error);
                return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
            }


        } else if (
            fileType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
            fileType === 'application/msword'
        ) {
            try {
                const result = await mammoth.extractRawText({ buffer });
                text = result.value;
            } catch (docError) {
                console.error("DOCX/DOC Parsing Error:", docError);
                return NextResponse.json(
                    { error: 'Failed to parse document' },
                    { status: 400 }
                );
            }
        } else if (fileType === 'text/plain') {
            text = buffer.toString('utf-8');
        } else {
            return NextResponse.json(
                { error: 'Unsupported file type' },
                { status: 400 }
            );
        }

        //
        const data = formData.get('formData') as FormDataEntryValue | null;
        if (!data || typeof data !== 'string') {
            return NextResponse.json(
                { error: 'Invalid form data' },
                { status: 400 }
            );
        }
        const parsedData = JSON.parse(data);
        const input_data = {
            input_text: text,
            job_description: parsedData.description,
            language: parsedData.targetLanguage,
            docs_instructions: "".concat(...Array.from(Object.entries(parsedData.documentPreferences)).map(([key, value]) => value ? `write  a  ${key} and tailor it to the job description` : ''),

            )
        };
        const response = await processResumeText(input_data as any)






        // For now, we'll just return the ID
        return NextResponse.json({
            resumeId: response.id,
            success: true,
            expiresAt: response.expires_at,
        });

    } catch (error) {
        console.error("Upload Error:", error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }

}


async function processResumeText(input_data: any) {
    const session = await getServerSession(authOptions)

    const token = session?.accessToken;

    try {
        const response = await fetch(`${process.env.BACKEND_URL}/api/resumes/generate_from_job_desc/`
            , {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    ...(token ? { Authorization: `Bearer ${token}` } : {})

                },
                body: JSON.stringify(
                    {
                        input: input_data
                    }
                ),
            });

        if (!response.ok) {
            const errorData = await response.json();
            console.error('Backend Error:', errorData);
            throw new Error(`Backend error: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Process Error:', error);
        throw error;
    }
}


