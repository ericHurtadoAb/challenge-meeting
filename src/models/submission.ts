export type submissionResult = 'pending' | 'approved' | 'failed';
export type submissionVisibility = 'public' | 'friends';

export interface submission {
  id: string;
  userId: string;
  challengeId: string;

  userName: string;
  userImage?: string | null;

  mediaUrl: string;
  mediaType: 'image' | 'video';

  votesUp: number;
  votesDown: number;

  result: submissionResult;
  visibility: submissionVisibility;

  createdAt: Date;

  public_id: string;
}
