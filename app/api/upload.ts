import { createRouter } from 'next-connect';
import multer from 'multer';
import { NextApiRequest, NextApiResponse  } from 'next';
import { NextResponse } from 'next/server';





export async function GET(req, res) {
   return NextResponse.json({ message: 'Hello World' });
}









// Extended request interface
interface MulterRequest extends NextApiRequest {
  file?: Express.Multer.File;
}

// Set up multer to store files in memory
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Update handler type to use MulterRequest
const handler = createRouter<MulterRequest, NextApiResponse>();

handler.use(async (req, res, next) => {
    try {
        await new Promise<void>((resolve, reject) => {
            upload.single('file')(req as any, res as any, (err: any) => {
              if (err) reject(err);
              resolve(); // This is fine now because we specified void
            });
      });
      return next();
    } catch (error) {
      return res.status(500).json({ message: 'Error uploading file' });
    }
  });
handler.post((req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }

  if (req.file.mimetype !== 'text/plain') {
    return res.status(400).json({ message: 'Only .txt files are allowed' });
  }

  const fileContent = req.file.buffer.toString('utf-8');
  return res.status(200).json({ message: 'File uploaded successfully', content: fileContent });
});

export default handler;