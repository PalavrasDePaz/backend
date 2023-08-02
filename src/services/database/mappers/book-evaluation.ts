import { CreateBookEvaluationEntity } from '@src/domain/entities/book-evaluation/create-book-evaluation-entity';
import { CreationAttributes } from 'sequelize';
import { BookEvaluation } from '../models/book-evaluation';

export const createBookEvaluationEntityToCreationModel = (
  bookEvaluation: CreateBookEvaluationEntity
): CreationAttributes<BookEvaluation> => {
  return {
    idvol: bookEvaluation.evaluatorId,
    nturma: bookEvaluation.classId,
    matricula: bookEvaluation.readerRegistration,
    leitor: bookEvaluation.readerName,
    estetica: bookEvaluation.textAestheticsAvaliation,
    dignidade: bookEvaluation.textReliabilityAvaliation,
    clareza: bookEvaluation.textClarityAvaliation,
    plagio: bookEvaluation.isAppropriation ? 'SIM' : 'NÃO',
    observ: bookEvaluation.observations,
    conceito: bookEvaluation.concept,
    opiniao: bookEvaluation.bookCriticalAnalysisAvaliation,
    sociedade: bookEvaluation.societyCriticalAnalysisAvaliation,
    plagioparcial: bookEvaluation.isParcialPlagiarism ? 'SIM' : 'NÃO',
    relevantes: bookEvaluation.relevantPhrases,
    redacao: bookEvaluation.syntheticAvaliation,
    portug: bookEvaluation.grammarAvaliation,
    'hist-observ': bookEvaluation.observedHistories,
    'hist-relat': bookEvaluation.readHistories.join(', ')
  };
};
