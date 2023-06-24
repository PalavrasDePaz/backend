/**
 * @example {
 * "notebookId": 1,
 * "studentName": "Test Name",
 * "reservationDate": "2023-06-22",
 * "notebookPath": "path-to-notebok/Test Name.pdf"
 * }
 */
export type AvailableNotebookRowEntity = {
  notebookId: number;
  studentId: number;
  idPep?: number;
  studentName: string;
  reservationDate?: Date | null;
  notebookPath?: string | null;
};
