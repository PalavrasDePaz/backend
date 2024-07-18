import { NotebookEntity } from './notebook-entity';

export type EvaluateNotebookEntity = Omit<
  // eslint-disable-next-line prettier/prettier
  NotebookEntity, 'idcad' | 'studentName' | 'studentRegistration' | 'idpep' | 'reservationDate' | 'evaluatedDate' | 'notebookDirectory'
>;
export type EvaluateNotebookEntityDownload = {
  'ID do caderno': number;
  'ID do voluntário': number | string;
  'Uni. prisional': string;
  'ID da turma': number | string;
  'Nome do voluntário': string;
  'E-mail do voluntário': string;
  'Matrícula do aluno': string;
  'Nome do(a) aluno(a)': string;
  'Carimbo de data/hora': Date | string;
  'Data e hora da reserva': Date | string;
  'Conteúdos relevantes': string;
  'Avaliação da Questão 1:': string;
  'Avaliação da Questão 2:': string;
  'Avaliação da Questão 3:': string;
  'Avaliação da Questão 4:': string;
  'Avaliação da Questão 5:': string;
  'Avaliação da Questão 6:': string;
  'Avaliação da Questão 7:': string;
  'Avaliação da Questão 8:': string;
  'Avaliação da Questão 9:': string;
  'Avaliação da Questão 10:': string;
  'Avaliação da Questão 11:': string;
  'Avaliação da Questão 12:': string;
  'Avaliação da Questão 13:': string;
  'Questão 1:': string;
  'Questão 2:': string;
  'Questão 3:': string;
  'Questão 4:': string;
  'Questão 5:': string;
  'Questão 6:': string;
  'Questão 7:': string;
  'Questão 8:': string;
  'Questão 9:': string;
  'Questão 10:': string;
  'Conclusão do avaliador': string;
  Aprovado: string;
  'Exclusão de arquivos recebidos': string;
};
