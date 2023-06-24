import { AvailableNotebookRowEntity } from '@src/domain/entities/available-notebook-row-entity';
import { NotebookEntity } from '@src/domain/entities/notebook-entity';

export const formatAvailableNotebookToTableRow = (
  notebook: NotebookEntity
): AvailableNotebookRowEntity => {
  return {
    notebookId: notebook.idcad,
    studentName: notebook.studentName,
    reservationDate: notebook.reservationDate,
    notebookPath: notebook.notebookDirectory
      ? `${notebook.notebookDirectory}/${notebook.studentName}.pdf`
      : null
  };
};
