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

export type BookEvaluationListDownload = {
  'ID do voluntário': number;
  'Nome do voluntário': string;
  'Matrícula do leitor': number;
  'Nome do leitor': string;
  'Número da turma': number;
  'Carimbo de data/hora': string;
  Estética: string;
  Fidedignidade: string;
  Clareza: string;
  'Apropriação indevida do Texto': string;
  'Plágio parcial': string;
  Observação: string;
  Conceito: string;
  'Frases relevantes': string;
  'Histórias lidas': string;
  'História observada': string;
  'Número da avaliação': number;
  Opinião: string;
  Sociedade: string;
  Gramática: string;
  Redação: string;
  'Data de expiração': string;
};

export type BookEvaluationsRelevantPhrases = {
  nturma: number;
  matricula: number;
  leitor: string;
  relevantes: string | undefined;
  placeFullName: string;
};
