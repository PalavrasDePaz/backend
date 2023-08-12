import { BookClubClassRepository } from '@src/domain/interfaces/repositories/book-club-class-repository';
import { provideSingleton } from '@src/helpers/provide-singleton';
import { BookClubClass } from '../database/models/book-club-class';
import { Op } from 'sequelize';
import { AssociatedBCCModelToEntity } from '../database/mappers/book-class-club';
import AvailableClassRowEntity from '@src/domain/entities/book-club-class/available-class-row-entity';
import { AssociatedBCCEntity } from '@src/domain/entities/book-club-class/book-club-class';
import { formatAvailableBCClass } from '@src/domain/entity-formatters/format-available-bcc';

@provideSingleton(SequelizeBCCRepository)
export class SequelizeBCCRepository implements BookClubClassRepository {
  async countEvaluatedClassesByIdVol(
    idvol: number
  ): Promise<{ count: number }> {
    const count = await BookClubClass.count({
      where: { idvol, datafimaval: { [Op.ne]: null } }
    });
    return { count };
  }

  async getAvailableClasses(): Promise<AvailableClassRowEntity[]> {
    const availableEssays = await BookClubClass.findAll({
      include: BookClubClass.associations.place,
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
    idvol: number
  ): Promise<AvailableClassRowEntity[]> {
    const availableEssays = await BookClubClass.findAll({
      include: BookClubClass.associations.place,
      where: { idvol }
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
        { idvol, datainvioparec: new Date() },
        { where: { idturma: idclass, datainvioparec: null, datafimaval: null } }
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
    const book = await BookClubClass.findByPk(idclass);
    return book ? AssociatedBCCModelToEntity(book) : null;
  }
}
