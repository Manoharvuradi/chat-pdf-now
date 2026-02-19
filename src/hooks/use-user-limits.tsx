import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';

export function useUserLimits() {
  const user = useQuery(api.users.getCurrentUser);

  if (!user) {
    return {
      canUploadPDF: false,
      canAskQuestion: false,
      pdfCount: 0,
      pdfLimit: 3,
      questionsRemaining: 0,
      creditBalance: 0,
      isPremium: false,
      isLoading: true,
    };
  }

  const isPremium = user.subscriptionStatus === 'active';
  const hasCredits = (user.creditBalance || 0) > 0;
  const pdfCount = user.pdfCount || 0;
  const freeQuestions = user.freeQuestionsRemaining || 0;
  const credits = user.creditBalance || 0;

  return {
    canUploadPDF: isPremium || hasCredits || pdfCount < 3,
    canAskQuestion: isPremium || freeQuestions > 0 || credits > 0,
    pdfCount,
    pdfLimit: isPremium || hasCredits ? Infinity : 3,
    questionsRemaining: freeQuestions,
    creditBalance: credits,
    isPremium,
    isLoading: false,
  };
}