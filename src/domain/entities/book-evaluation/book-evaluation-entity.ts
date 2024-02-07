export type BookEvaluationEntity = {
  id: number;
  readerName: string;
  readerRegistration: number;
  classId: number;
  evaluatorId: number;
  isParcialPlagiarism: boolean;
  isAppropriation: boolean;
  textAestheticsAvaliation: string;
  textReliabilityAvaliation: string;
  textClarityAvaliation: string;
  bookCriticalAnalysisAvaliation: string;
  societyCriticalAnalysisAvaliation: string;
  grammarAvaliation: string;
  syntheticAvaliation: string;
  observations: string;
  concept: string;
  relevantPhrases?: string;
  readHistories: string[];
  observedHistories?: string;
  createdAt: Date;
};

export type BookEvaluationList = BookEvaluationEntity & {
  expirationDate: Date | null;
  volunteerName: string | null;
};
