import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import crypto from 'crypto';

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const image = formData.get('image') as File | null;
    const pdf = formData.get('pdf') as File | null;
    
    // Uploads target directory
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
    
    // Ensure the directory exists
    try {
      await fs.access(uploadsDir);
    } catch {
      await fs.mkdir(uploadsDir, { recursive: true });
    }

    let imageUrl = '';
    let pdfUrl = '';

    // Process image
    if (image) {
      // Create Buffer from arrayBuffer chunks
      const bytes = await image.arrayBuffer();
      const buffer = Buffer.from(bytes);
      
      const ext = path.extname(image.name) || '.jpg';
      const filename = `blog_img_${crypto.randomUUID()}${ext}`;
      const filePath = path.join(uploadsDir, filename);
      
      await fs.writeFile(filePath, buffer);
      imageUrl = `/uploads/${filename}`;
    }

    // Process PDF
    if (pdf) {
      const bytes = await pdf.arrayBuffer();
      const buffer = Buffer.from(bytes);
      
      const filename = `blog_pdf_${crypto.randomUUID()}.pdf`;
      const filePath = path.join(uploadsDir, filename);
      
      await fs.writeFile(filePath, buffer);
      pdfUrl = `/uploads/${filename}`;
    }

    return NextResponse.json({ success: true, imageUrl, pdfUrl });

  } catch (error) {
    console.error('File Upload Pipeline Error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error processing files.' }, 
      { status: 500 }
    );
  }
}
