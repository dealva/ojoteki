import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { getSessionUser } from '@/lib/getSessionUser';
import cloudinary from '@/lib/cloudinary';
import { Readable } from 'stream';

function bufferToStream(buffer) {
  const readable = new Readable();
  readable._read = () => {};
  readable.push(buffer);
  readable.push(null);
  return readable;
}

export async function POST(req) {
  const { user } = await getSessionUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const data = await req.formData();
  const file = data.get('file');

  if (!file || typeof file === 'string') {
    return NextResponse.json({ error: 'Invalid file' }, { status: 400 });
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const uploadPromise = new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: 'profile_photos',
        public_id: `user-${user.id}`,
        overwrite: true,
        transformation: [
          { width: 300, height: 300, crop: 'thumb', gravity: 'face' },
        ],
      },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    );

    bufferToStream(buffer).pipe(stream);
  });

  try {
    const result = await uploadPromise;
    const imageUrl = result.secure_url;

    await query(
      'UPDATE users SET profile_photo = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2',
      [imageUrl, user.id]
    );

    // console.log(`Profile photo updated for user ${user.id}: ${imageUrl}`);
    return NextResponse.json({ success: true, url: imageUrl });
  } catch (error) {
    console.error('Cloudinary upload failed:', error);
    return NextResponse.json({ error: 'Image upload failed' }, { status: 500 });
  }
}
