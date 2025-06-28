import { NextResponse } from 'next/server';
import { uploadToCloudinary } from '@/lib/cloudinary';

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file');
    
    if (!file) {
      return NextResponse.json(
        { error: 'No se ha proporcionado ningún archivo' },
        { status: 400 }
      );
    }

    // Convertir el archivo a un formato que pueda ser procesado por la Server Action
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    
    // Convertir a base64 para poder pasarlo a Cloudinary
    const base64Data = `data:${file.type};base64,${buffer.toString('base64')}`;
    
    // Subir a Cloudinary usando la Server Action
    const imageUrl = await uploadToCloudinary(base64Data);
    
    return NextResponse.json({ url: imageUrl });
  } catch (error) {
    console.error('Error al subir la imagen:', error);
    return NextResponse.json(
      { error: 'Error al procesar la imagen' },
      { status: 500 }
    );
  }
}
