import notebooksEntity from '@src/domain/entities/notebooks-entity';
import { NotebooksRepository } from '@src/domain/interfaces/repositories/notebooks-repository';
import { notebookModelToEntity } from '../database/mappers/notebooks';
import { Notebooks } from '../database/models/notebooks';
import { provideSingleton } from '@src/helpers/provide-singleton';

@provideSingleton(SequelizeNotebooksRepository)
export class SequelizeNotebooksRepository implements NotebooksRepository {
  getReservedNotebooksByIdVol(idvol: number): Promise<notebooksEntity[]> {
    throw new Error('Method not implemented.');
  }
  getAvailableNotebooks(): Promise<notebooksEntity[]> {
    throw new Error('Method not implemented.');
  }
  async getNotebooksByIdVol(idvol: number): Promise<notebooksEntity[]> {
    const notebooks = await Notebooks.findAll({ where: { idvol } });
    return notebooks.map(notebookModelToEntity);
  }
}
