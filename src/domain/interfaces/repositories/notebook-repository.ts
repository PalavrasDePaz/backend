import { NotebookEntity } from '@src/domain/entities/notebook-entity';

export interface NotebookRepository {
  getNotebooksByIdVol(idvol: number): Promise<{ count: number }>;

  getReservedNotebooksByIdVol(idvol: number): Promise<NotebookEntity[]>;

  getAvailableNotebooks(): Promise<NotebookEntity[]>;

  reserveNotebookForVolunteer(
    idvol: number,
    notebookId: number
  ): Promise<NotebookEntity | null>;

  getNotebookById(notebookId: number): Promise<NotebookEntity | null>;
}
