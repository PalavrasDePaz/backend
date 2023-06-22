export type AvailableNotebookRowEntity = {
  notebookId: number;
  studentName: string;
  reservationDate?: Date | null;
  notebookPath?: string | null;
};
