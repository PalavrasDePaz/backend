import { provideSingleton } from '@src/helpers/provide-singleton';
import { BookEvaluationRepository } from '@src/domain/interfaces/repositories/book-evaluation-repository';
import { CreateBookEvaluationEntity } from '@src/domain/entities/book-evaluation/create-book-evaluation-entity';
import { BookEvaluation } from '../database/models/book-evaluation';
import {
  bookEvaluationModelToEntity,
  createBookEvaluationEntityToCreationModel,
  updateBookEvaluationEntityToUpdateModel
} from '../database/mappers/book-evaluation';
import { BookEvaluationError } from '@src/domain/errors/book-evaluation';
import { BookEvaluationEntity } from '@src/domain/entities/book-evaluation/book-evaluation-entity';
import { UpdateBookEvaluationEntity } from '@src/domain/entities/book-evaluation/update-book-evaluation-entity';

@provideSingleton(SequelizeBookEvaluationRepository)
export class SequelizeBookEvaluationRepository
  implements BookEvaluationRepository
{
  async updatedBookEvaluation(
    evaluationId: number,
    bookEvaluation: UpdateBookEvaluationEntity
  ): Promise<BookEvaluationEntity | null> {
    const updatedRows = (
      await BookEvaluation.update(
        updateBookEvaluationEntityToUpdateModel(bookEvaluation),
        {
          where: { idavLivro: evaluationId }
        }
      )
    )[0];

    return updatedRows ? await this.getBookEvaluationById(evaluationId) : null;
  }

  async getBookEvaluationById(
    evaluationId: number
  ): Promise<BookEvaluationEntity | null> {
    const evaluation = await BookEvaluation.findByPk(evaluationId);

    return evaluation ? bookEvaluationModelToEntity(evaluation) : null;
  }

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
