import QRCode from 'qrcode';
import { supabase } from '@/lib/supabase';

export const generateQR = async (text: string): Promise<string> => {
  try {
    // Generar el QR como Data URL (base64)
    const qrDataUrl = await QRCode.toDataURL(text, {
      width: 256,
      margin: 1,
      color: {
        dark: '#000000',
        light: '#ffffff'
      }
    });

    // Convertir la Data URL a un Blob
    const response = await fetch(qrDataUrl);
    const qrBlob = await response.blob();

    // Generar nombre único para el archivo
    const fileName = `qr_${Date.now()}_${Math.random().toString(36).substring(2, 15)}.png`;
    const filePath = `qr_codes/${fileName}`;

    // Subir a Supabase Storage
    const { error } = await supabase.storage
      .from('qr_codes')
      .upload(filePath, qrBlob, {
        contentType: 'image/png',
        cacheControl: '3600',
        upsert: false
      });

    if (error) throw error;

    // Obtener URL pública
    const { data: { publicUrl } } = supabase.storage
      .from('qr_codes')
      .getPublicUrl(filePath);

    return publicUrl;
  } catch (error) {
    console.error('Error generando QR:', error);
    throw error;
  }
};
