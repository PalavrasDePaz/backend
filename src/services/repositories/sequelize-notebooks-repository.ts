import { NotebooksRepository } from '@src/domain/interfaces/repositories/notebooks-repository';
import { Notebooks } from '../database/models/notebooks';
import { provideSingleton } from '@src/helpers/provide-singleton';

@provideSingleton(SequelizeNotebooksRepository)
export class SequelizeNotebooksRepository implements NotebooksRepository {
  async getNotebooksByIdVol(idvol: number): Promise<{ count: number }> {
    const count = await Notebooks.count({ where: { idvol } });
    return { count };
  }
}
