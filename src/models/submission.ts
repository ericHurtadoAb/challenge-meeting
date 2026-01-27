export type submissionResult = 'pending' | 'approved' | 'failed';
export type submissionVisibility = 'public' | 'friends';

// Metadata de verificación por IA
export interface AIVerification {
  confidence: number;    // 0.0 - 1.0
  reason: string;        // Explicación de la IA
  verifiedAt: Date;
}

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

  // Verificación automática por IA (opcional)
  aiVerification?: AIVerification;
}
