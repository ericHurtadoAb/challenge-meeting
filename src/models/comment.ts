export interface comment {
  id: string;
  userId: string;
  submissionId: string;
  userName: string;
  photoUrl?: string | null;
  text: string;
  createdAt: Date;
}
