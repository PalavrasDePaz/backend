import AvailableClassRowEntity from '@src/domain/entities/book-club-class/available-class-row-entity';
import {
  AssociatedBCCEntity,
  BookClassAllInfo
} from '@src/domain/entities/book-club-class/book-club-class';
import { UpdateBCClassEntity } from '@src/domain/entities/book-club-class/update-class-entity';
import { formatAvailableBCClass } from '@src/domain/entity-formatters/format-available-bcc';
import { BookClubClassRepository } from '@src/domain/interfaces/repositories/book-club-class-repository';
import { provideSingleton } from '@src/helpers/provide-singleton';
import { PaginationParams } from '@src/presentation/types/paginationParams';
import moment from 'moment';
import { Op } from 'sequelize';
import {
  AssociatedBCCModelToEntity,
  bookClubClassToBookClassAllInfoEntity,
  updateBCClassEntityToUpdateModel
} from '../database/mappers/book-class-club';
import { BookClubClass } from '../database/models/book-club-class';
import { BookEvaluation } from '../database/models/book-evaluation';
import { Place } from '../database/models/place';
import { Volunteer } from '../database/models/volunteer';
import { wrapPagination } from './helpers/wrapPagination';

@provideSingleton(SequelizeBCCRepository)
export class SequelizeBCCRepository implements BookClubClassRepository {
  getAllClasses = wrapPagination(
    async (
      pagination: PaginationParams
    ): Promise<[BookClassAllInfo[], number]> => {
      const { offset, limit } = pagination;
      const bookClasses = await BookClubClass.findAll<
        BookClubClass & { 'place.fullname'?: string; 'volunteer.nome'?: string }
      >({
        include: [
          { model: Place, as: 'place', attributes: ['fullname'] },
          { model: Volunteer, as: 'volunteer', attributes: ['nome'] }
        ],
        offset,
        limit,
        raw: true,
        order: [['IDTURMA', 'DESC']]
      });

      const totalCount = await BookClubClass.count();

      return [
        bookClasses.map(bookClubClassToBookClassAllInfoEntity),
        totalCount
      ];
    }
  );

  async countEvaluatedClassesByIdVol(
    idvol: number
  ): Promise<{ count: number }> {
    const count = await BookEvaluation.count({
      where: { idvol }
    });
    return { count };
  }

  async getAvailableClasses(): Promise<AvailableClassRowEntity[]> {
    const availableEssays = await BookClubClass.findAll({
      include: [
        { model: Place, as: 'place' },
        { model: BookEvaluation, as: 'bookEvaluations' }
      ],
      where: {
        [Op.and]: {
          datainvioparec: { [Op.is]: null },
          datafimaval: { [Op.is]: null }
        }
      }
    });

    return availableEssays
      .map(AssociatedBCCModelToEntity)
      .map(formatAvailableBCClass);
  }

  async getReservedClassesByIdVol(
    idvol: number,
    hasDataInvioFunap: boolean
  ): Promise<AvailableClassRowEntity[]> {
    const queryWhereForAvailableEssaysByIdVol = hasDataInvioFunap
      ? { idvol }
      : { [Op.and]: { idvol, datainviofunap: { [Op.is]: null } } };

    const availableEssays = await BookClubClass.findAll({
      include: [
        { model: Place, as: 'place' },
        { model: BookEvaluation, as: 'bookEvaluations' }
      ],
      where: {
        ...queryWhereForAvailableEssaysByIdVol
      }
    });
    return availableEssays
      .map(AssociatedBCCModelToEntity)
      .map(formatAvailableBCClass);
  }

  async reserveClassForVolunteer(
    idvol: number,
    idclass: number
  ): Promise<AvailableClassRowEntity | null> {
    const updatedEssay = (
      await BookClubClass.update(
        { idvol, datainvioparec: moment() },
        { where: { idturma: idclass, datainvioparec: null, datafimaval: null } }
      )
    )[0];

    const updatedClass = await this.getBookClubClassById(idclass);
    return updatedEssay && updatedClass
      ? formatAvailableBCClass(updatedClass)
      : null;
  }
  async revertReserveClassForVolunteer(
    idclass: number
  ): Promise<AvailableClassRowEntity | null> {
    const updatedEssay = (
      await BookClubClass.update(
        { idvol: null, datainvioparec: null },
        {
          where: {
            idturma: idclass,
            datainvioparec: { [Op.not]: null }
          }
        }
      )
    )[0];

    const updatedClass = await this.getBookClubClassById(idclass);
    return updatedEssay && updatedClass
      ? formatAvailableBCClass(updatedClass)
      : null;
  }

  async getBookClubClassById(
    idclass: number
  ): Promise<AssociatedBCCEntity | null> {
    const book = await BookClubClass.findByPk(idclass, {
      include: [
        { model: Place, as: 'place' },
        { model: BookEvaluation, as: 'bookEvaluations' }
      ]
    });
    return book ? AssociatedBCCModelToEntity(book) : null;
  }

  async getClassesFromId(classId: number): Promise<AssociatedBCCEntity[]> {
    const classes = await BookClubClass.findAll({
      where: {
        idturma: { [Op.gte]: classId }
      },
      include: [
        { model: Place, as: 'place' },
        { model: BookEvaluation, as: 'bookEvaluations' }
      ]
    });

    return classes.map(AssociatedBCCModelToEntity);
  }

  async updatedClass(
    classId: number,
    bookClubClass: UpdateBCClassEntity
  ): Promise<AssociatedBCCEntity | null> {
    const updatedRows = (
      await BookClubClass.update(
        updateBCClassEntityToUpdateModel(bookClubClass),
        {
          where: { idturma: classId }
        }
      )
    )[0];

    return updatedRows ? await this.getBookClubClassById(classId) : null;
  }

  async updateConcluded(
    classId: number,
    evaluationDate: Date
  ): Promise<AssociatedBCCEntity | null> {
    const endEvaluationDate = evaluationDate ? moment() : null;

    const updatedField = (
      await BookClubClass.update(
        { datafimaval: endEvaluationDate },
        {
          where: { idturma: classId }
        }
      )
    )[0];

    return updatedField ? await this.getBookClubClassById(classId) : null;
  }
}
