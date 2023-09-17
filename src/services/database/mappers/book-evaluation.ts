import { CreateBookEvaluationEntity } from '@src/domain/entities/book-evaluation/create-book-evaluation-entity';
import { CreationAttributes } from 'sequelize';
import { BookEvaluation } from '../models/book-evaluation';
import { UpdateBookEvaluationEntity } from '@src/domain/entities/book-evaluation/update-book-evaluation-entity';
import UpdateModel from './helpers/update-model-type';
import { BookEvaluationEntity } from '@src/domain/entities/book-evaluation/book-evaluation-entity';

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

export const bookEvaluationModelToEntity = (
  bookEvaluation: BookEvaluation
): BookEvaluationEntity => {
  return {
    id: bookEvaluation.idavLivro,
    readerName: bookEvaluation.leitor,
    readerRegistration: bookEvaluation.matricula,
    classId: bookEvaluation.nturma,
    evaluatorId: bookEvaluation.idvol,
    isParcialPlagiarism: bookEvaluation.plagioparcial
      ? bookEvaluation.plagioparcial == 'NÃO'
      : false,
    isAppropriation: bookEvaluation.plagio
      ? bookEvaluation.plagio == 'NÃO'
      : false,
    textAestheticsAvaliation: bookEvaluation.estetica ?? '',
    textReliabilityAvaliation: bookEvaluation.dignidade ?? '',
    textClarityAvaliation: bookEvaluation.clareza ?? '',
    bookCriticalAnalysisAvaliation: bookEvaluation.opiniao ?? '',
    societyCriticalAnalysisAvaliation: bookEvaluation.sociedade ?? '',
    grammarAvaliation: bookEvaluation.portug ?? '',
    syntheticAvaliation: bookEvaluation.redacao ?? '',
    observations: bookEvaluation.observ ?? '',
    concept: bookEvaluation.conceito ?? '',
    relevantPhrases: bookEvaluation.relevantes ?? '',
    readHistories: bookEvaluation['hist-relat']?.split(',') ?? [],
    observedHistories: bookEvaluation['hist-observ'] ?? '',
    createdAt: bookEvaluation.createdAt
  };
};

export const updateBookEvaluationEntityToUpdateModel = (
  bookEvaluation: UpdateBookEvaluationEntity
): UpdateModel<BookEvaluation> => {
  return {
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
