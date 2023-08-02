import { BookEvaluationEntity } from './book-evaluation-entity';

export type CreateBookEvaluationEntity = Omit<
  BookEvaluationEntity,
  'id' | 'createdAt'
>;
