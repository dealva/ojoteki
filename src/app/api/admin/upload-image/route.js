import { NextResponse } from 'next/server';
import cloudinary from '@/lib/cloudinary';

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file');

    if (!file) {
      return NextResponse.json({ message: 'No file provided' }, { status: 400 });
    }

   
    // but since we get file as Blob from formData, we need to convert to buffer
    const buffer = Buffer.from(await file.arrayBuffer());

    // Upload to Cloudinary
    const uploadResult = await cloudinary.uploader.upload_stream(
      { folder: 'products' },
      (error, result) => {
        if (error) {
          throw error;
        }
        return result;
      }
    );

    
    // So use a Promise wrapper:
    const uploadPromise = () =>
      new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: 'products' },
          (error, result) => {
            if (error) return reject(error);
            resolve(result);
          }
        );
        stream.end(buffer);
      });

    const result = await uploadPromise();

    return NextResponse.json({ url: result.secure_url }, { status: 201 });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ message: 'Upload failed' }, { status: 500 });
  }
}
