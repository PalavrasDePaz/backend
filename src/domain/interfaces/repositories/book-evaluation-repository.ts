import {
  BookEvaluationEntity,
  BookEvaluationList,
  BookEvaluationListDownload
} from '@src/domain/entities/book-evaluation/book-evaluation-entity';
import { CreateBookEvaluationEntity } from '@src/domain/entities/book-evaluation/create-book-evaluation-entity';
import { UpdateBookEvaluationEntity } from '@src/domain/entities/book-evaluation/update-book-evaluation-entity';
import { PaginationParams } from '@src/presentation/types/paginationParams';
import { PaginationResult } from '@src/services/repositories/helpers/wrapPagination';

export interface BookEvaluationRepository {
  getBookEvaluationList(
    pagination: PaginationParams
  ): Promise<PaginationResult<BookEvaluationList[]>>;

  getBookEvaluationListDownload(
    pagination: PaginationParams
  ): Promise<BookEvaluationListDownload[]>;

  createBookEvaluations(
    bookEvaluations: CreateBookEvaluationEntity[]
  ): Promise<void>;

  updatedBookEvaluation(
    evaluationId: number,
    bookEvaluation: UpdateBookEvaluationEntity
  ): Promise<BookEvaluationEntity | null>;

  getBookEvaluationById(
    evaluationId: number
  ): Promise<BookEvaluationEntity | null>;

  getBookEvaluationByClassId(
    evaluationId: number
  ): Promise<BookEvaluationEntity | null>;

  deleteBookEvaluation(evaluationId: number): Promise<boolean>;
  getRelevantPhrases(date: string): Promise<string[]>;
}
