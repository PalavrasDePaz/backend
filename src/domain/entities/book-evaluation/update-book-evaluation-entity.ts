import { BookEvaluationEntity } from './book-evaluation-entity';

export type UpdateBookEvaluationEntity = Omit<
  BookEvaluationEntity,
  'id' | 'classId' | 'evaluatorId'
>;
