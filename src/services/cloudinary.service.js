"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.submitChallengeCloudinary = exports.API_SECRET = exports.API_KEY = exports.UPLOAD_PRESET = exports.CLOUDINARY_REMOVE_URL = exports.CLOUDINARY_UPLOAD_URL = void 0;
const submissions_service_1 = require("./submissions.service");
exports.CLOUDINARY_UPLOAD_URL = "https://api.cloudinary.com/v1_1/du4oppckv/";
exports.CLOUDINARY_REMOVE_URL = "https://api.cloudinary.com/v1_1/du4oppckv/";
exports.UPLOAD_PRESET = "unsigned_upload";
exports.API_KEY = "182169399123492";
exports.API_SECRET = "rgJOq4QzCoZHWDwl7HFV7aNS48o";
const MAX_SIZE_MB = 10; // tamaño máximo 10 MB
/**
 * Subir imagen o video a Cloudinary y crear submission en Firestore
 */
const submitChallengeCloudinary = async (fileUri, fileType, user, challengeId) => {
    try {
        if (!user)
            return null;
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
        data.append("file", file);
        data.append("upload_preset", exports.UPLOAD_PRESET);
        const url = exports.CLOUDINARY_UPLOAD_URL + fileType + '/upload';
        const res = await fetch(url, {
            method: "POST",
            body: data,
        });
        const json = await res.json();
        if (!json.secure_url)
            throw new Error("Upload failed");
        const submissionData = {
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
        const submission = await (0, submissions_service_1.createSubmission)(submissionData);
        return submission;
    }
    catch (error) {
        console.error("Cloudinary upload error:", error);
        return null;
    }
};
exports.submitChallengeCloudinary = submitChallengeCloudinary;
//# sourceMappingURL=cloudinary.service.js.map