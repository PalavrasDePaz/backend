import { NotebookEntity } from './notebook-entity';

export type EvaluateNotebookEntity = Omit<
  NotebookEntity,
  | 'idcad'
  | 'studentName'
  | 'studentRegistration'
  | 'idpep'
  | 'reservationDate'
  | 'evaluatedDate'
  | 'notebookDirectory'
  | 'approved'
>;
