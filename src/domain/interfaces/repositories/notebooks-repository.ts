export interface NotebooksRepository {
  getNotebooksByIdVol(idvol: number): Promise<{ count: number }>;
}
