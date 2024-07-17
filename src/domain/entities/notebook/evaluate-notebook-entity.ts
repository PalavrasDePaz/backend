import { NotebookEntity } from './notebook-entity';

export type EvaluateNotebookEntity = Omit<
  // eslint-disable-next-line prettier/prettier
  NotebookEntity, 'idcad' | 'studentName' | 'studentRegistration' | 'idpep' | 'reservationDate' | 'evaluatedDate' | 'notebookDirectory'
>;
