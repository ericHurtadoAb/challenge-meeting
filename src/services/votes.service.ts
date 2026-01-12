import { doc, setDoc } from 'firebase/firestore';
import { db } from '../../firebase-config';
import { vote } from '../models/vote';

export const voteSubmission = async (
  submissionId: string,
  vote: vote
) => {
  const ref = doc(db, 'submissions', submissionId, 'votes', vote.userId);
  await setDoc(ref, vote);
};
