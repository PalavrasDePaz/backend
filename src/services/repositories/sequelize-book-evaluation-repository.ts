import { provideSingleton } from '@src/helpers/provide-singleton';
import { BookEvaluationRepository } from '@src/domain/interfaces/repositories/book-evaluation-repository';
import { CreateBookEvaluationEntity } from '@src/domain/entities/book-evaluation/create-book-evaluation-entity';
import { BookEvaluation } from '../database/models/book-evaluation';
import {
  bookEvaluationModelToEntity,
  bookEvaluationToBookEvaluationListEntity,
  createBookEvaluationEntityToCreationModel,
  updateBookEvaluationEntityToUpdateModel
} from '../database/mappers/book-evaluation';
import { BookEvaluationError } from '@src/domain/errors/book-evaluation';
import {
  BookEvaluationEntity,
  BookEvaluationList
} from '@src/domain/entities/book-evaluation/book-evaluation-entity';
import { UpdateBookEvaluationEntity } from '@src/domain/entities/book-evaluation/update-book-evaluation-entity';
import { wrapPagination } from './helpers/wrapPagination';
import { PaginationParams } from '@src/presentation/types/paginationParams';
import { Volunteer } from '../database/models/volunteer';

@provideSingleton(SequelizeBookEvaluationRepository)
export class SequelizeBookEvaluationRepository
  implements BookEvaluationRepository
{
  getBookEvaluationList = wrapPagination(
    async (
      pagination: PaginationParams
    ): Promise<[BookEvaluationList[], number]> => {
      const { offset, limit } = pagination;
      const booksEvaluation = await BookEvaluation.findAll<
        BookEvaluation & { 'volunteer.nome'?: string }
      >({
        include: [{ model: Volunteer, as: 'volunteer', attributes: ['nome'] }],
        offset,
        limit,
        raw: true
      });

      const totalCount = await BookEvaluation.count();

      return [
        booksEvaluation.map(bookEvaluationToBookEvaluationListEntity),
        totalCount
      ];
    }
  );

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
