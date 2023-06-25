import { EvaluateNotebookEntity } from '@src/domain/entities/notebook/evaluate-notebook-entity';
import { NotebookEntity } from '@src/domain/entities/notebook/notebook-entity';

export interface NotebookRepository {
  countEvaluatedNotebooksByIdVol(idvol: number): Promise<{ count: number }>;

  getReservedNotebooksByIdVol(idvol: number): Promise<NotebookEntity[]>;

  getAvailableNotebooks(): Promise<NotebookEntity[]>;

  saveNotebookEvaluation(
    notebookId: number,
    notebookData: EvaluateNotebookEntity
  ): Promise<NotebookEntity | null>;

  reserveNotebookForVolunteer(
    idvol: number,
    notebookId: number
  ): Promise<NotebookEntity | null>;

  getNotebookById(notebookId: number): Promise<NotebookEntity | null>;
}
