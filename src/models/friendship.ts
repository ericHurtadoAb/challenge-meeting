export type friendshipStatus = 'pending' | 'accepted';

export interface friendship {
  id: string;
  requesterId: string;
  receiverId: string;
  status: friendshipStatus;
  createdAt: Date;
}
