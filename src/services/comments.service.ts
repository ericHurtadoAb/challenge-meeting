import { db } from "@/firebase-config";
import { addDoc, collection, getDocs, orderBy, query, serverTimestamp, where } from "firebase/firestore";
import { comment } from "../models/comment";
import { submission } from "../models/submission";

export const getCommentsBySubmission = async (
  submission: submission
) => {
  const commentsRef = collection(db, "comments");
  const q = query(
    commentsRef,
    where("submissionId", "==", submission.id),
    orderBy("createdAt", "asc")
  );

  const snapshot = await getDocs(q);
  const commentsData: comment[] = snapshot.docs.map((doc) => ({//as
    id: doc.id,
    ...doc.data(),
  })) as comment[];

  return commentsData;
};

export async function createComment(
  submissionId: string,
  userId: string,
  userName: string,
  photoUrl: string | null | undefined,
  text: string
) {
  const docRef = await addDoc(collection(db, "comments"), {
    submissionId,
    userId,
    userName,
    photoUrl,
    text,
    createdAt: serverTimestamp(),
  });

  return {
    id: docRef.id,
    submissionId,
    userId,
    userName,
    photoUrl,
    text,
    createdAt: new Date(),
  };
}