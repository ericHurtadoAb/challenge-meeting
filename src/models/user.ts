export interface user {
  id: string;
  displayName: string;
  photoURL?: string | null;
  createdAt: Date;

  streak: number;
  totalCompleted: number;
  totalFailed: number;

  friendsCount: number;

  isAnonymous: boolean;
}
