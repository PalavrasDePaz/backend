import { provideSingleton } from '@src/helpers/provide-singleton';
import { Op } from 'sequelize';
import { PepClassRepository } from '@src/domain/interfaces/repositories/pep-class-repository';
import { PepClassEntity } from '@src/domain/entities/pep-class/pep-class-entity';
import { Pep } from '../database/models/class';
import { UpdatePepClassEntity } from '@src/domain/entities/pep-class/update-pep-class-entity';
import {
  pepClassModelToEntity,
  updatePepClassEntityToUpdateModel
} from '../database/mappers/pep-class';

@provideSingleton(SequelizePepClassRepository)
export class SequelizePepClassRepository implements PepClassRepository {
  async getClassesFromId(classId: number): Promise<PepClassEntity[]> {
    const classes = await Pep.findAll({
      where: {
        id: { [Op.gte]: classId }
      }
    });

    return classes.map(pepClassModelToEntity);
  }

  async getPepClassById(classId: number): Promise<PepClassEntity | null> {
    const pepClass = await Pep.findByPk(classId);
    return pepClass ? pepClassModelToEntity(pepClass) : null;
  }

  async updatedClass(
    classId: number,
    pepClass: UpdatePepClassEntity
  ): Promise<PepClassEntity | null> {
    const updatedRows = (
      await Pep.update(updatePepClassEntityToUpdateModel(pepClass), {
        where: { id: classId }
      })
    )[0];

    return updatedRows ? await this.getPepClassById(classId) : null;
  }
}
