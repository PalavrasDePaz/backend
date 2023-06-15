import NotebooksEntity from '@src/domain/entities/notebooks-entity';

export interface NotebooksRepository {
  getNotebooksByIdVol(idvol: number): Promise<NotebooksEntity[]>;

  getReservedNotebooksByIdVol(idvol: number): Promise<NotebooksEntity[]>;

  getAvailableNotebooks(): Promise<NotebooksEntity[]>;
}