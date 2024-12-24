import { createRouter } from 'next-connect';
import multer from 'multer';
import { NextApiRequest, NextApiResponse } from 'next';
import { NextResponse } from 'next/server';

// Extended request interface to include file information
interface MulterRequest extends NextApiRequest {
  file?: Express.Multer.File;
}

// Set up multer to store files in memory
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Create the next-connect handler with the extended request interface
const handler = createRouter<MulterRequest, NextApiResponse>();

// Middleware to handle file upload
handler.use(async (req, res, next) => {
  try {
    // Handling file upload asynchronously with multer
    await new Promise<void>((resolve, reject) => {
      upload.single('file')(req as any, res as any, (err: any) => {
        if (err) reject(err);
        resolve(); // Proceed to the next middleware or route handler
      });
    });
    return next(); // Move to the next middleware or handler
  } catch (error) {
    // Handle file upload errors
    return res.status(500).json({ message: 'Error uploading file', error: error.message });
  }
});

// POST request handler to process uploaded file
handler.post((req, res) => {
  // Check if a file is uploaded
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }

  // Validate file type (only .txt files are allowed)
  if (req.file.mimetype !== 'text/plain') {
    return res.status(400).json({ message: 'Only .txt files are allowed' });
  }

  // Convert file buffer to string and respond
  const fileContent = req.file.buffer.toString('utf-8');
  console.log(fileContent);
  return res.status(200).json({
    message: 'File uploaded successfully',
    content: fileContent,
  });
});

export default handler;
