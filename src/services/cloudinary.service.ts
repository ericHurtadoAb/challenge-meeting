import { db } from "@/firebase-config";
import * as crypto from "expo-crypto";
import { collection, deleteDoc, doc, getDocs, limit, orderBy, query, where } from "firebase/firestore";
import { submission } from "../models/submission";
import { user } from "../models/user";
import { createSubmission } from "./submissions.service";

export const CLOUDINARY_UPLOAD_URL = "https://api.cloudinary.com/v1_1/du4oppckv/";
export const CLOUDINARY_REMOVE_URL = "https://api.cloudinary.com/v1_1/du4oppckv/";
export const UPLOAD_PRESET = "unsigned_upload";
export const API_KEY = "182169399123492";
export const API_SECRET = "rgJOq4QzCoZHWDwl7HFV7aNS48o";

const MAX_SIZE_MB = 10; // tamaño máximo 10 MB
const MAX_SUBMISSIONS = 5;

/**
 * Eliminar submission y subir imagen o video a Cloudinary y crear submission en Firestore
 */

export const submitChallengeCloudinary = async (
  fileUri: string,
  fileType: "image" | "video",
  user: user | null,
  challengeId: string
): Promise<submission | null> => {
  try {
    if (!user) return null;
    
    const response = await fetch(fileUri);
    const blob = await response.blob();

    const sizeMB = blob.size / (1024 * 1024);
    if (sizeMB > MAX_SIZE_MB) {
      alert(`El archivo es demasiado grande (${sizeMB.toFixed(2)} MB). Máximo permitido: ${MAX_SIZE_MB} MB.`);
      return null;
    }

    //ELIMINAR SUBMISSIONS ANTIGUAS
    const submissionsRef = collection(db, "submissions");

    const excessQuery = query(
      submissionsRef,
      where("userId", "==", user.id),
      orderBy("createdAt", "asc"),
      limit(100)
    );

    const snapshot = await getDocs(excessQuery);

    const excessCount = snapshot.size - (MAX_SUBMISSIONS - 1);

    if (excessCount > 0) {
      const submissionsToDelete = snapshot.docs.slice(0, excessCount);

      for (const docSnap of submissionsToDelete) {
        const data = docSnap.data();
        const submissionId = docSnap.id;

        //BORRAR EN CLOUDINARY
        if (data.public_id) {
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
              console.log(`Media eliminada para submission ${docSnap.id}:`, await resu.json());
          }
        }

        //BORRAR COMENTARIOS
        const commentsRef = collection(db, "comments");
        const commentsQuery = query(
          commentsRef,
          where("submissionId", "==", submissionId)
        );

        const commentsSnap = await getDocs(commentsQuery);
        for (const comment of commentsSnap.docs) {
          await deleteDoc(comment.ref);
        }

        //BORRAR SUBMISSIONS
        await deleteDoc(doc(db, "submissions", submissionId));
      }
    }

    //SUBIR A CLOUDINARY
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

    //CREAR SUBMISSION
    const submissionData: Omit<submission, "id"> = {
      userId: user.id,
      userName: user.displayName,
      userImage: user.photoURL,
      challengeId,
      mediaUrl: json.secure_url,
      mediaType: fileType,
      votesUp: 0,
      votesDown: 0,
      result: "pending",
      visibility: "public",
      createdAt: new Date(),
      public_id: json.public_id,
    };

    const submission = await createSubmission(submissionData);
    return submission;
  } catch (error) {
    console.error("Cloudinary upload error:", error);
    return null;
  }
};
