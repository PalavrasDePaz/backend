import {
  EvaluateNotebookEntity,
  EvaluateNotebookEntityDownload
} from '@src/domain/entities/notebook/evaluate-notebook-entity';
import {
  NotebookEntity,
  NotebookWithPlaceAndVolunteer
} from '@src/domain/entities/notebook/notebook-entity';
import { UpdateNotebookEntity } from '@src/domain/entities/notebook/update-notebook-entity';
import { PaginationParams } from '@src/presentation/types/paginationParams';
import { PaginationResult } from '@src/services/repositories/helpers/wrapPagination';

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

  revertReserveNotebookForVolunteer(
    notebookId: number
  ): Promise<NotebookEntity | null>;

  getNotebookById(notebookId: number): Promise<NotebookEntity | null>;

  updatedNotebook(
    notebookId: number,
    notebook: UpdateNotebookEntity
  ): Promise<NotebookEntity | null>;

  getAllNotebookEvaluation(
    pagination: PaginationParams
  ): Promise<PaginationResult<NotebookWithPlaceAndVolunteer[]>>;

  getAllNotebookEvaluationDownload(
    pagination: PaginationParams
  ): Promise<EvaluateNotebookEntityDownload[]>;
}
