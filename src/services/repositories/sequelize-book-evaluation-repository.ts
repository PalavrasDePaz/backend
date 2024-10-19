import {
  BookEvaluationEntity,
  BookEvaluationList,
  BookEvaluationListDownload
} from '@src/domain/entities/book-evaluation/book-evaluation-entity';
import { CreateBookEvaluationEntity } from '@src/domain/entities/book-evaluation/create-book-evaluation-entity';
import { UpdateBookEvaluationEntity } from '@src/domain/entities/book-evaluation/update-book-evaluation-entity';
import { BookEvaluationError } from '@src/domain/errors/book-evaluation';
import { BookEvaluationRepository } from '@src/domain/interfaces/repositories/book-evaluation-repository';
import { provideSingleton } from '@src/helpers/provide-singleton';
import { PaginationParams } from '@src/presentation/types/paginationParams';
import {
  bookEvaluationModelToEntity,
  bookEvaluationToBookEvaluationListDownloadEntity,
  bookEvaluationToBookEvaluationListEntity,
  createBookEvaluationEntityToCreationModel,
  updateBookEvaluationEntityToUpdateModel
} from '../database/mappers/book-evaluation';
import { BookEvaluation } from '../database/models/book-evaluation';
import { Volunteer } from '../database/models/volunteer';
import { wrapPagination } from './helpers/wrapPagination';
import { FindOptions, Op } from 'sequelize';

@provideSingleton(SequelizeBookEvaluationRepository)
export class SequelizeBookEvaluationRepository
  implements BookEvaluationRepository
{
  getBookEvaluationList = wrapPagination(
    async (
      pagination: PaginationParams
    ): Promise<[BookEvaluationList[], number]> => {
      const { offset, limit, filter } = pagination;
      const options: FindOptions = {
        include: [{ model: Volunteer, as: 'volunteer', attributes: ['nome'] }],
        offset,
        limit,
        raw: true,
        order: [['Carimbo de data/hora', 'DESC']]
      };
      if (filter && filter?.classes) {
        options.where = { NTURMA: { [Op.in]: filter.classes } };
      }
      const booksEvaluation = await BookEvaluation.findAll<
        BookEvaluation & { 'volunteer.nome'?: string }
      >(options);

      const totalCount = await BookEvaluation.count(options);

      return [
        booksEvaluation.map(bookEvaluationToBookEvaluationListEntity),
        totalCount
      ];
    }
  );

  getBookEvaluationListDownload = async (
    pagination: PaginationParams
  ): Promise<BookEvaluationListDownload[]> => {
    const { filter } = pagination;
    const options: FindOptions = {
      include: [{ model: Volunteer, as: 'volunteer', attributes: ['nome'] }],
      raw: true,
      order: [['Carimbo de data/hora', 'DESC']]
    };
    if (filter && filter?.classes) {
      options.where = { NTURMA: { [Op.in]: filter.classes } };
    }
    const booksEvaluation = await BookEvaluation.findAll<
      BookEvaluation & { 'volunteer.nome'?: string }
    >(options);

    return booksEvaluation.map(
      bookEvaluationToBookEvaluationListDownloadEntity
    );
  };

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

  async getBookEvaluationByClassId(
    classId: number
  ): Promise<BookEvaluationEntity | null> {
    const evaluation = await BookEvaluation.findOne({
      where: { nturma: classId }
    });

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

  async deleteBookEvaluation(evaluationId: number): Promise<boolean> {
    const deletedBookEvaluatino = await BookEvaluation.destroy({
      where: { idavLivro: evaluationId }
    });

    return deletedBookEvaluatino ? true : false;
  }
}
