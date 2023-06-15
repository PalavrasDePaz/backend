import { AvailableNotebookRowEntity } from '@src/domain/entities/available-notebook-row-entity';
import NotebooksEntity from '@src/domain/entities/notebooks-entity';

export const formatAvailableNotebookToTableRow = (
  notebook: NotebooksEntity
): AvailableNotebookRowEntity => {
  return {
    studentName: notebook.studentName,
    reservationDate: notebook.reservationDate,
    notebookPath: ''
  };
};
