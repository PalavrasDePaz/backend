import { BookClubClassRepository } from '@src/domain/interfaces/repositories/book-club-class-repository';
import { provideSingleton } from '@src/helpers/provide-singleton';
import { BookClubClass } from '../database/models/book-club-class';
import { Op } from 'sequelize';
import { AssociatedBCCModelToEntity } from '../database/mappers/book-class-club';
import AvailableEssayRowEntity from '@src/domain/entities/book-club-class/available-essay-row-entity';
import { formatAvailableEssay } from '@src/helpers/format-available-essay';

@provideSingleton(SequelizeBCCRepository)
export class SequelizeBCCRepository implements BookClubClassRepository {
  async countEvaluatedBookClubClassByIdVol(
    idvol: number
  ): Promise<{ count: number }> {
    const count = await BookClubClass.count({
      where: { idvol, datafimaval: { [Op.ne]: null } }
    });
    return { count };
  }

  async getAvailableEssays(): Promise<AvailableEssayRowEntity[]> {
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
      .map(formatAvailableEssay);
  }

  async getReservedEssaysByIdVol(
    idvol: number
  ): Promise<AvailableEssayRowEntity[]> {
    const availableEssays = await BookClubClass.findAll({
      include: BookClubClass.associations.place,
      where: { idvol }
    });
    return availableEssays
      .map(AssociatedBCCModelToEntity)
      .map(formatAvailableEssay);
  }
}
