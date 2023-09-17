import { BookEvaluationEntity } from '@src/domain/entities/book-evaluation/book-evaluation-entity';
import { CreateBookEvaluationEntity } from '@src/domain/entities/book-evaluation/create-book-evaluation-entity';
import { UpdateBookEvaluationEntity } from '@src/domain/entities/book-evaluation/update-book-evaluation-entity';

export interface BookEvaluationRepository {
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
