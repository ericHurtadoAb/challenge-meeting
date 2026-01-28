export type friendshipStatus = 'pending' | 'accepted';

export interface friendship {
  id: string;
  friendIds: string[];
  status: friendshipStatus;
  actionBy: string;
  createdAt: Date;
}
