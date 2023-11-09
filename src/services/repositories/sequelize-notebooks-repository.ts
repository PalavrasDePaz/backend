import { NotebookEntity } from '@src/domain/entities/notebook/notebook-entity';
import { NotebookRepository } from '@src/domain/interfaces/repositories/notebook-repository';
import {
  notebookModelToEntity,
  evaluateNotebookEntityToEvaluateNotebookModel,
  updateNotebookEntityToUpdateModel
} from '../database/mappers/notebooks';
import { Notebook } from '../database/models/notebook';
import { provideSingleton } from '@src/helpers/provide-singleton';
import { Op } from 'sequelize';
import { EvaluateNotebookEntity } from '@src/domain/entities/notebook/evaluate-notebook-entity';
import { Volunteer } from '../database/models/volunteer';
import { Pep } from '../database/models/class';
import { UpdateNotebookEntity } from '@src/domain/entities/notebook/update-notebook-entity';

@provideSingleton(SequelizeNotebookRepository)
export class SequelizeNotebookRepository implements NotebookRepository {
  async saveNotebookEvaluation(
    notebookId: number,
    notebookData: EvaluateNotebookEntity
  ): Promise<NotebookEntity | null> {
    await Notebook.update(
      evaluateNotebookEntityToEvaluateNotebookModel(notebookData),
      { where: { idcad: notebookId, 'Carimbo de data/hora': null } }
    );

    return this.getNotebookById(notebookId);
  }
  async getNotebookById(notebookId: number): Promise<NotebookEntity | null> {
    const notebook = await Notebook.findOne({
      include: [
        { model: Volunteer, as: 'volunteer' },
        { model: Pep, as: 'pep' }
      ],
      where: { idcad: notebookId }
    });
    return notebook ? notebookModelToEntity(notebook) : null;
  }
  async reserveNotebookForVolunteer(
    idvol: number,
    notebookId: number
  ): Promise<NotebookEntity | null> {
    await Notebook.update(
      { idvol, datareserva: new Date() },
      {
        where: {
          idcad: notebookId,
          datareserva: null,
          'Carimbo de data/hora': null,
          aprovado: 'SIM'
        }
      }
    );

    return this.getNotebookById(notebookId);
  }
  async revertReserveNotebookForVolunteer(
    notebookId: number
  ): Promise<NotebookEntity | null> {
    await Notebook.update(
      { idvol: null, datareserva: null },
      {
        where: {
          idcad: notebookId,
          datareserva: { [Op.not]: null },
          idvol: { [Op.not]: null }
        }
      }
    );
    return await this.getNotebookById(notebookId);
  }
  async getReservedNotebooksByIdVol(idvol: number): Promise<NotebookEntity[]> {
    const notebooks = await Notebook.findAll({
      include: { association: Notebook.associations.pep },
      where: {
        idvol,
        'Carimbo de data/hora': null,
        aprovado: 'SIM'
      }
    });
    return notebooks.map(notebookModelToEntity);
  }

  async getAvailableNotebooks(): Promise<NotebookEntity[]> {
    const notebooks = await Notebook.findAll({
      include: { association: Notebook.associations.pep },
      where: {
        datareserva: null,
        'Carimbo de data/hora': null,
        aprovado: 'SIM'
      }
    });

    return notebooks.map(notebookModelToEntity);
  }

  async countEvaluatedNotebooksByIdVol(
    idvol: number
  ): Promise<{ count: number }> {
    const count = await Notebook.count({
      where: { idvol, 'Carimbo de data/hora': { [Op.ne]: null } }
    });
    return { count };
  }

  async updatedNotebook(
    notebookId: number,
    notebook: UpdateNotebookEntity
  ): Promise<NotebookEntity | null> {
    await Notebook.update(updateNotebookEntityToUpdateModel(notebook), {
      where: { idcad: notebookId }
    });
    return await this.getNotebookById(notebookId);
  }
}
