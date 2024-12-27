// app/api/resume/upload/route.ts
import { NextResponse } from 'next/server';
import { PDFDocument } from 'pdf-lib';
import mammoth from 'mammoth';
import { convert } from 'html-to-text';

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
        const file = formData.get('file') as File;

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
                const pdfDoc = await PDFDocument.load(buffer);
                const pages = pdfDoc.getPages();
                text = await pages.map(page => page.getText()).join('\n');
            } catch (pdfError) {
                console.error("PDF Parsing Error:", pdfError);
                return NextResponse.json(
                    { error: 'Failed to parse PDF' },
                    { status: 400 }
                );
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


        // Here   we will process the text to extract the resume data
        const resumeData = await processResumeText(text);

        // For now, we'll just return the ID
        return NextResponse.json({
            resumeId : resumeData.id,
            success: true,
            expiresAt: resumeData.expires_at,
        });

    } catch (error) {
        console.error("Upload Error:", error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}



async function processResumeText(text: string) {
    const response = await fetch('http://localhost:8000/api/resumes/generate/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ input: { input_text: text } }),
    });

    if (!response.ok) {
      throw new Error('Failed to process resume text');
    }

    const data = await response.json();
    console.log("data from processResumeText", data);
    return data;
  }

