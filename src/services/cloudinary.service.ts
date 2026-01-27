import { db } from "@/firebase-config";
import * as crypto from "expo-crypto";
import { collection, deleteDoc, doc, getDocs, query, where } from "firebase/firestore";
import { dailyChallenge } from "../models/daily-challenge";
import { AIVerification, submission } from "../models/submission";
import { user } from "../models/user";
import { VerificationResult, verifyChallenge } from "./gemini.service";
import { createSubmission } from "./submissions.service";

const CLOUDINARY_UPLOAD_URL = "https://api.cloudinary.com/v1_1/du4oppckv/";
const CLOUDINARY_REMOVE_URL = "https://api.cloudinary.com/v1_1/du4oppckv/";
const UPLOAD_PRESET = "unsigned_upload";
const API_KEY = "182169399123492";
const API_SECRET = "rgJOq4QzCoZHWDwl7HFV7aNS48o";

const MAX_SIZE_MB = 10; // tamaño máximo 10 MB

/**
 * Subir imagen o video a Cloudinary, verificar con IA y crear submission en Firestore
 */
export const submitChallengeCloudinary = async (
  fileUri: string,
  fileType: "image" | "video",
  user: user | null,
  challengeId: string,
  challenge?: dailyChallenge // Nuevo parámetro para verificación IA
): Promise<submission | null> => {
  try {
    if (!user) return null;
    //BORRAR SUBMISSIONS ANTERIORES DEL USUARIO
    const submissionsRef = collection(db, "submissions");

    const q = query(submissionsRef, where("userId", "==", user.id));
    const snapshot = await getDocs(q);

    for (const docSnap of snapshot.docs) {
      const data = docSnap.data();

      const timestamp = Math.floor(Date.now() / 1000);
      const toSign = `public_id=${data.public_id}&timestamp=${timestamp}${API_SECRET}`;
      const signature = await crypto.digestStringAsync(
        crypto.CryptoDigestAlgorithm.SHA1,
        toSign
      );
      const delete_url = CLOUDINARY_REMOVE_URL + data.mediaType + "/destroy";

      if (data.public_id) {
        const resu = await fetch(delete_url, {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: `public_id=${data.public_id}&timestamp=${timestamp}&api_key=${API_KEY}&signature=${signature}`,
        });
      }

      const commentsQuery = query(
        collection(db, "comments"),
        where("submissionId", "==", docSnap.id)
      );

      const commentsSnapshot = await getDocs(commentsQuery);

      for (const commentDoc of commentsSnapshot.docs) {
        await deleteDoc(doc(db, "comments", commentDoc.id));
      }

      await deleteDoc(doc(db, "submissions", docSnap.id));//as
    }

    //SUBIR NUEVA SUBMISSION
    const response = await fetch(fileUri);
    const blob = await response.blob();

    const sizeMB = blob.size / (1024 * 1024);
    if (sizeMB > MAX_SIZE_MB) {
      alert(`El archivo es demasiado grande (${sizeMB.toFixed(2)} MB). Máximo permitido: ${MAX_SIZE_MB} MB.`);
      return null;
    }

    const file = {
      uri: fileUri,
      name: fileType === "image" ? "photo.jpg" : "video.mp4",
      type: fileType === "image" ? "image/jpeg" : "video/mp4",
    };

    const data = new FormData();
    data.append("file", file as any);
    data.append("upload_preset", UPLOAD_PRESET);

    const url = CLOUDINARY_UPLOAD_URL + fileType + '/upload';

    const res = await fetch(url, {
      method: "POST",
      body: data,
    });

    const json = await res.json();
    if (!json.secure_url) throw new Error("Upload failed");

    // NUEVO: Verificar con IA si es imagen y tenemos info del reto
    let verificationResult: VerificationResult = {
      approved: false,
      confidence: 0,
      reason: 'Pendiente de verificación'
    };

    if (fileType === 'image' && challenge) {
      console.log('🤖 Verificando imagen con IA...');
      verificationResult = await verifyChallenge(
        json.secure_url,
        challenge.title,
        challenge.description
      );
      console.log('🤖 Resultado IA:', verificationResult);
    }

    // Determinar resultado basado en verificación
    // approved=true → approved
    // approved=false con confidence > 0.5 → failed (IA rechazó)
    // approved=false con confidence <= 0.5 → pending (revisar manualmente)
    let result: 'approved' | 'pending' | 'failed' = 'pending';
    if (verificationResult.approved) {
      result = 'approved';
    } else if (verificationResult.confidence > 0.5) {
      result = 'failed';
    }

    // Preparar metadata de verificación IA
    const aiVerification: AIVerification | undefined = challenge ? {
      confidence: verificationResult.confidence,
      reason: verificationResult.reason,
      verifiedAt: new Date()
    } : undefined;

    const submissionData: Omit<submission, "id"> = {
      userId: user.id,
      userName: user.displayName,
      userImage: user.photoURL,
      challengeId,
      mediaUrl: json.secure_url,
      mediaType: fileType,
      votesUp: 0,
      votesDown: 0,
      result,
      visibility: "public",
      createdAt: new Date(),
      public_id: json.public_id,
      aiVerification, // NUEVO: Guardar metadata de verificación
    };

    const submission = await createSubmission(submissionData);
    return submission;
  } catch (error) {
    console.error("Cloudinary upload error:", error);
    return null;
  }
};

