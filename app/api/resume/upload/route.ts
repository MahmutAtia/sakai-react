// app/api/resume/upload/route.ts
import { NextResponse } from 'next/server';
import mammoth from 'mammoth';
import { getServerSession } from "next-auth/next"
import { authOptions } from "../../auth/[...nextauth]/options"
import { TextItem } from 'pdfjs-dist/types/src/display/api';
import pdfjsDist from 'https://cdn.jsdelivr.net/npm/pdfjs-dist@4.10.38/+esm'

// Configure PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc =  'https://cdn.jsdelivr.net/npm/pdfjs-dist@4.10.38/build/pdf.worker.min.js';

export const config = {
    api: {
        bodyParser: false,
    },
};

export async function POST(request: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const formData = await request.formData();
        const file = formData.get('resume') as File;

        if (!file) {
            return NextResponse.json(
                { error: 'No file provided' },
                { status: 400 }
            );
        }

        let text = '';
        const buffer = Buffer.from(await file.arrayBuffer());
        const fileType = file.type;

        // Handle PDF files
        if (fileType === 'application/pdf') {
            try {
                const loadingTask = pdfjs.getDocument(buffer);
                const pdfDoc = await loadingTask.promise;

                for (let i = 1; i <= pdfDoc.numPages; i++) {
                    const page = await pdfDoc.getPage(i);
                    const textContent = await page.getTextContent();
                    text += textContent.items
                        .map((item: TextItem) => item.str)
                        .join(' ') + '\n';
                }
            } catch (pdfError) {
                console.error("PDF Parsing Error:", pdfError);
                return NextResponse.json(
                    { error: 'Failed to parse PDF document' },
                    { status: 400 }
                );
            }
        }
        // Handle DOCX/DOC files
        else if (
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
        }
        // Handle plain text files
        else if (fileType === 'text/plain') {
            text = buffer.toString('utf-8');
        }
        // Unsupported file types
        else {
            return NextResponse.json(
                { error: 'Unsupported file type' },
                { status: 400 }
            );
        }

        // Process form data
        const formDataEntry = formData.get('formData');
        if (!formDataEntry || typeof formDataEntry !== 'string') {
            return NextResponse.json(
                { error: 'Invalid form data' },
                { status: 400 }
            );
        }

        const parsedData = JSON.parse(formDataEntry);
        const input_data = {
            input_text: text,
            job_description: parsedData.description,
            language: parsedData.targetLanguage,
            docs_instructions: Object.entries(parsedData.documentPreferences)
                .filter(([_, value]) => value)
                .map(([key]) => `Write a ${key} tailored to the job description`)
                .join(' ')
        };

        // Process resume text with backend
        const response = await processResumeText(input_data, session.accessToken);

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

async function processResumeText(inputData: any, token: string) {
    try {
        const response = await fetch(`${process.env.BACKEND_URL}/api/resumes/generate_from_job_desc/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({ input: inputData }),
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
