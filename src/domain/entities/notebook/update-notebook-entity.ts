import { NotebookEntity } from './notebook-entity';

export type UpdateNotebookEntity = Partial<
  Omit<
    NotebookEntity,
    | 'idcad'
    | 'idvol'
    | 'idpep'
    | 'studentName'
    | 'studentRegistration'
    | 'studentPrisonUnit'
    | 'evaluatorName'
    | 'evaluatorEmail'
    | 'notebookDirectory'
    | 'fullName'
  >
>;

