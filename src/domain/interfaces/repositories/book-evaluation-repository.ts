import { BookEvaluationEntity, BookEvaluationList } from '@src/domain/entities/book-evaluation/book-evaluation-entity';
import { CreateBookEvaluationEntity } from '@src/domain/entities/book-evaluation/create-book-evaluation-entity';
import { UpdateBookEvaluationEntity } from '@src/domain/entities/book-evaluation/update-book-evaluation-entity';
import { PaginationParams } from '@src/presentation/types/paginationParams';
import { PaginationResult } from '@src/services/repositories/helpers/wrapPagination';

export interface BookEvaluationRepository {
  getBookEvaluationList (
    pagination: PaginationParams
    ): Promise<PaginationResult<BookEvaluationList[]>> 

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
}
