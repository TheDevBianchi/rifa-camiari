'use client'

import emailjs from '@emailjs/browser';

// Configuración de EmailJS
const emailjsConfig = {
  serviceId: process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID,
  templateId: process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID,
  publicKey: process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY,
};

// Hook para enviar emails desde el cliente
export function useSendEmail() {
  const sendEmail = async (templateParams) => {
    const { serviceId, templateId, publicKey } = emailjsConfig;

    console.log('Enviando email con los siguientes parámetros:', templateParams);

    if (!serviceId || !templateId || !publicKey) {
      console.error('Configuración de EmailJS incompleta. Verifica las variables de entorno.');
      throw new Error('Configuración de EmailJS incompleta.');
    }

    if (!templateParams.to_email) {
      console.error('Error: "to_email" está vacío o no está definido en los parámetros del template.');
      throw new Error('La dirección del destinatario (to_email) está vacía.');
    }

    try {
      // Enviar email usando el SDK de EmailJS para el navegador
      const response = await emailjs.send(
        serviceId,
        templateId,
        templateParams,
        publicKey
      );

      if (response.status === 200) {
        return {
          success: true,
          message: 'Email enviado exitosamente'
        };
      } else {
        throw new Error(`Error al enviar el email: ${response.text}`);
      }
    } catch (error) {
      console.error('Error al enviar el correo desde el cliente:', error);
      // El objeto error de EmailJS contiene el status y el texto
      const errorMessage = error.text || 'Ocurrió un error desconocido al enviar el correo.';
      throw new Error(errorMessage);
    }
  };

  return { sendEmail };
}
