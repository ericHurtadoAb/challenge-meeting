import { submission } from "../models/submission";
import { user } from "../models/user";
import { createSubmission } from "./submissions.service";

export const CLOUDINARY_UPLOAD_URL = "https://api.cloudinary.com/v1_1/du4oppckv/";
export const CLOUDINARY_REMOVE_URL = "https://api.cloudinary.com/v1_1/du4oppckv/";
export const UPLOAD_PRESET = "unsigned_upload";
export const API_KEY = "182169399123492";
export const API_SECRET = "rgJOq4QzCoZHWDwl7HFV7aNS48o";

const MAX_SIZE_MB = 10; // tamaño máximo 10 MB

/**
 * Subir imagen o video a Cloudinary y crear submission en Firestore
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
