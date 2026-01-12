export interface dailyChallenge {
  id: string; // YYYY-MM-DD
  title: string;
  description: string;
  startsAt: Date;
  endsAt: Date;
  isActive: boolean;
}
