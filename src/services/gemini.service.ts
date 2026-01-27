// Servicio de verificación de retos con Gemini AI
// NOTA: Esta es la Opción A (cliente directo) para desarrollo
// Para producción, migrar a Cloud Functions (Opción B)

import { GoogleGenerativeAI } from '@google/generative-ai';

// TODO: Mover a variables de entorno antes de producción
const GEMINI_API_KEY = 'AIzaSyCaClkoinRRUeIyy1qqhep-4Gknmc8EXD0';

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

export interface VerificationResult {
    approved: boolean;
    confidence: number;
    reason: string;
}

/**
 * Verifica si una imagen cumple con el reto usando Gemini Vision
 */
export const verifyChallenge = async (
    imageUrl: string,
    challengeTitle: string,
    challengeDescription: string
): Promise<VerificationResult> => {
    try {
        const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

        const prompt = `
Eres un juez de retos diarios. Analiza esta imagen y determina si el usuario ha completado el reto.

RETO: ${challengeTitle}
DESCRIPCIÓN: ${challengeDescription}

INSTRUCCIONES:
1. Analiza la imagen cuidadosamente
2. Determina si muestra evidencia de que el reto fue completado
3. Sé razonablemente flexible pero no aceptes trampas obvias

Responde ÚNICAMENTE con un JSON válido en este formato:
{
  "approved": true/false,
  "confidence": 0.0-1.0,
  "reason": "Explicación breve de tu decisión"
}
`;

        // Obtener imagen desde URL y convertir a base64
        const imageResponse = await fetch(imageUrl);
        const imageBlob = await imageResponse.blob();

        // Convertir blob a base64
        const base64Image = await new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => {
                const result = reader.result as string;
                // Remover el prefijo "data:image/...;base64,"
                const base64 = result.split(',')[1];
                resolve(base64);
            };
            reader.onerror = reject;
            reader.readAsDataURL(imageBlob);
        });

        const imagePart = {
            inlineData: {
                data: base64Image,
                mimeType: 'image/jpeg'
            }
        };

        const result = await model.generateContent([prompt, imagePart]);
        const response = result.response.text();

        // Parsear JSON de la respuesta
        const jsonMatch = response.match(/\{[\s\S]*\}/);
        if (!jsonMatch) {
            console.error('Respuesta inválida del modelo:', response);
            throw new Error('Respuesta inválida del modelo');
        }

        const verification: VerificationResult = JSON.parse(jsonMatch[0]);

        return verification;
    } catch (error) {
        console.error('Error en verificación IA:', error);
        // En caso de error, marcar como pendiente para revisión manual
        return {
            approved: false,
            confidence: 0,
            reason: 'Error en verificación automática. Pendiente de revisión manual.'
        };
    }
};
