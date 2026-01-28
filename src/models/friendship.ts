export type friendshipStatus = 'pending' | 'accepted';

export interface friendship {
  id: string;
  user1: string;
  user2: string;
  status: friendshipStatus;
  actionBy: string;
  createdAt: Date;
}
