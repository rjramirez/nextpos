import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export const config = {
  api: {
    bodyParser: false,
  },
};

export async function POST(req: NextRequest) {
  // Ensure the transaction_proofs directory exists
  const uploadDir = path.join(process.cwd(), 'transaction_proofs');
  
  // Create directory if it doesn't exist
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  // Convert NextRequest to a format compatible with file upload
  const formData = await req.formData();
  const file = formData.get('file') as File | null;

  if (!file) {
    return NextResponse.json({ 
      error: 'No file uploaded' 
    }, { status: 400 });
  }

  // Generate a unique filename to prevent overwrites
  const timestamp = Date.now();
  const originalName = file.name || 'uploaded_file';
  const newFilename = `${timestamp}-${originalName}`;

  // Write the file
  const buffer = await file.arrayBuffer();
  const filePath = path.join(uploadDir, newFilename);
  
  try {
    fs.writeFileSync(filePath, Buffer.from(buffer));

    return NextResponse.json({ 
      message: 'File uploaded successfully', 
      filename: newFilename 
    }, { status: 200 });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ 
      error: 'File upload failed', 
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }}
