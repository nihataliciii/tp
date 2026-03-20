import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Get file extension
    const ext = file.name.split('.').pop() || 'png';
    const uuid = crypto.randomUUID();
    const filename = `${uuid}.${ext}`;
    
    // Path: public/uploads
    const uploadDir = path.join(process.cwd(), 'public', 'uploads');
    
    // Ensure the directory exists
    await fs.mkdir(uploadDir, { recursive: true });
    
    const filepath = path.join(uploadDir, filename);
    await fs.writeFile(filepath, buffer);

    const publicUrl = `/uploads/${filename}`;

    return NextResponse.json({ success: true, url: publicUrl });
  } catch (error) {
    console.error('Error uploading file:', error);
    return NextResponse.json({ error: 'Failed to upload file' }, { status: 500 });
  }
}
