import { provideSingleton } from '@src/helpers/provide-singleton';
import { BookEvaluationRepository } from '@src/domain/interfaces/repositories/book-evaluation-repository';
import { CreateBookEvaluationEntity } from '@src/domain/entities/book-evaluation/create-book-evaluation-entity';
import { BookEvaluation } from '../database/models/book-evaluation';
import { createBookEvaluationEntityToCreationModel } from '../database/mappers/book-evaluation';
import { BookEvaluationError } from '@src/domain/errors/book-evaluation';

@provideSingleton(SequelizeBookEvaluationRepository)
export class SequelizeBookEvaluationRepository
  implements BookEvaluationRepository
{
  async createBookEvaluations(
    bookEvaluations: CreateBookEvaluationEntity[]
  ): Promise<void> {
    try {
      await BookEvaluation.bulkCreate(
        bookEvaluations.map((bookEvaluation) =>
          createBookEvaluationEntityToCreationModel(bookEvaluation)
        )
      );
    } catch (error) {
      throw new BookEvaluationError({
        name: 'UNSPECIFIED_ERROR',
        message: 'Not specified error',
        details: error
      });
    }
  }
}
