import { CreateBookEvaluationEntity } from '@src/domain/entities/book-evaluation/create-book-evaluation-entity';

export interface BookEvaluationRepository {
  createBookEvaluations(
    bookEvaluations: CreateBookEvaluationEntity[]
  ): Promise<void>;
}
