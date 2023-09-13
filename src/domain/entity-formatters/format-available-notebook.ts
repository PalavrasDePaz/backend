import { AvailableNotebookRowEntity } from '@src/domain/entities/notebook/available-notebook-row-entity';
import { NotebookEntity } from '@src/domain/entities/notebook/notebook-entity';

export const formatAvailableNotebookToTableRow = (
  notebook: NotebookEntity
): AvailableNotebookRowEntity => {
  return {
    notebookId: notebook.idcad,
    studentId: notebook.studentRegistration,
    idPep: notebook.idpep,
    classId: notebook.idpep ?? -1,
    studentName: notebook.studentName,
    reservationDate: notebook.reservationDate,
    notebookPath: notebook.notebookDirectory
      ? `${notebook.notebookDirectory}/${notebook.studentName}.pdf`
      : null
  };
};
