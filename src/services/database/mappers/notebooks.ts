import {
  EvaluateNotebookEntity,
  EvaluateNotebookEntityDownload
} from '@src/domain/entities/notebook/evaluate-notebook-entity';
import { NotebookEntity } from '@src/domain/entities/notebook/notebook-entity';
import { UpdateNotebookEntity } from '@src/domain/entities/notebook/update-notebook-entity';
import { Notebook } from '../models/notebook';
import UpdateModel from './helpers/update-model-type';

export const notebookModelToEntity = (notebook: Notebook): NotebookEntity => ({
  idcad: notebook.idcad,
  idvol: notebook.idvol,
  idpep: notebook.idpep,
  studentName: notebook['nome do(a) aluno(a)'],
  studentRegistration: Number(notebook['número de matrícula do(a) aluno(a)']),
  studentPrisonUnit: notebook['unidade prisional do(a) aluno(a)'],
  evaluatorName: notebook.volunteer?.nome ?? '',
  evaluatorEmail: notebook.volunteer?.['e-mail'],
  subject1: notebook['tema 1'],
  subject2: notebook['tema 2'],
  subject3: notebook['tema 3'],
  subject4: notebook['tema 4'],
  subject5: notebook['tema 5'],
  subject6: notebook['tema 6'],
  subject7: notebook['tema 7'],
  subject8: notebook['tema 8'],
  subject9: notebook['tema 9'],
  subject10: notebook['tema 10'],
  relevantContent: notebook['conteúdos relevantes'],
  a1: notebook.a1,
  a2: notebook.a2,
  a3: notebook.a3,
  a4: notebook.a4,
  a5: notebook.a5,
  a6: notebook.a6,
  a7: notebook.a7,
  a8: notebook.a8,
  a9: notebook.a9,
  a10: notebook.a10,
  a11: notebook.a11,
  a12: notebook.a12,
  a13: notebook.a13,
  approved: notebook.aprovado == 'SIM' ? true : false,
  conclusion: notebook['conclusão do avaliador'],
  archivesExclusion: notebook['exclusão de arquivos recebidos'] === 'SIM',
  evaluatedDate: notebook['Carimbo de data/hora'],
  reservationDate: notebook.datareserva ? String(notebook.datareserva) : null,
  notebookDirectory: notebook.pep?.directory
});

export const evalutionListNotebookModelToEntityDownload = (
  notebook: Notebook & {
    'pep.place.fullName'?: string;
    'volunteer.NOME'?: string;
  }
): EvaluateNotebookEntityDownload => ({
  'ID do caderno': notebook.idcad,
  'ID do voluntário': notebook.idvol ?? '',
  'Uni. prisional':
    notebook['pep.place.fullName'] ||
    notebook['unidade prisional do(a) aluno(a)'] ||
    '',
  'ID da turma': notebook.idpep ?? '',
  'Nome do voluntário': notebook['volunteer.NOME'] || '',
  'E-mail do voluntário': notebook.volunteer?.['e-mail'] ?? '',
  'Matrícula do aluno': notebook['número de matrícula do(a) aluno(a)'] ?? '',
  'Nome do(a) aluno(a)': notebook['nome do(a) aluno(a)'],
  'Carimbo de data/hora':
    notebook['Carimbo de data/hora']?.toLocaleString() ?? '',
  'Data e hora da reserva': notebook?.datareserva?.toLocaleString() ?? '',
  'Conteúdos relevantes': notebook['conteúdos relevantes'] ?? '',
  'Avaliação da Questão 1:': notebook.a1 ?? '',
  'Avaliação da Questão 2:': notebook.a2 ?? '',
  'Avaliação da Questão 3:': notebook.a3 ?? '',
  'Avaliação da Questão 4:': notebook.a4 ?? '',
  'Avaliação da Questão 5:': notebook.a5 ?? '',
  'Avaliação da Questão 6:': notebook.a6 ?? '',
  'Avaliação da Questão 7:': notebook.a7 ?? '',
  'Avaliação da Questão 8:': notebook.a8 ?? '',
  'Avaliação da Questão 9:': notebook.a9 ?? '',
  'Avaliação da Questão 10:': notebook.a10 ?? '',
  'Avaliação da Questão 11:': notebook.a11 ?? '',
  'Avaliação da Questão 12:': notebook.a12 ?? '',
  'Avaliação da Questão 13:': notebook.a13 ?? '',
  'Questão 1:': notebook['tema 1'] ?? '',
  'Questão 2:': notebook['tema 2'] ?? '',
  'Questão 3:': notebook['tema 3'] ?? '',
  'Questão 4:': notebook['tema 4'] ?? '',
  'Questão 5:': notebook['tema 5'] ?? '',
  'Questão 6:': notebook['tema 6'] ?? '',
  'Questão 7:': notebook['tema 7'] ?? '',
  'Questão 8:': notebook['tema 8'] ?? '',
  'Questão 9:': notebook['tema 9'] ?? '',
  'Questão 10:': notebook['tema 10'] ?? '',
  'Conclusão do avaliador': notebook['conclusão do avaliador'],
  Aprovado: notebook.aprovado ?? '',
  'Exclusão de arquivos recebidos':
    notebook['exclusão de arquivos recebidos'] ?? ''
});

export const evalutionListNotebookModelToEntity = (
  notebook: Notebook & {
    'pep.place.fullName'?: string;
    'volunteer.NOME'?: string;
  }
) => ({
  id: notebook.idcad,
  studentName: notebook['nome do(a) aluno(a)'] || '',
  studentRegistration: notebook['número de matrícula do(a) aluno(a)'] || '',
  fullName:
    notebook['pep.place.fullName'] ||
    notebook['unidade prisional do(a) aluno(a)'] ||
    '',
  evaluatorName: notebook['volunteer.NOME'] || '',
  idpep: notebook.idpep,
  evaluatedDate: notebook['Carimbo de data/hora'],
  reservationDate: notebook.datareserva
});

export const evaluateNotebookEntityToEvaluateNotebookModel = (
  notebook: EvaluateNotebookEntity
): UpdateModel<Notebook> => ({
  idvol: notebook.idvol,
  'unidade prisional do(a) aluno(a)': notebook.studentPrisonUnit,
  'tema 1': notebook.subject1,
  'tema 2': notebook.subject2,
  'tema 3': notebook.subject3,
  'tema 4': notebook.subject4,
  'tema 5': notebook.subject5,
  'tema 6': notebook.subject6,
  'tema 7': notebook.subject7,
  'tema 8': notebook.subject8,
  'tema 9': notebook.subject9,
  'tema 10': notebook.subject10,
  'conteúdos relevantes': notebook.relevantContent,
  a1: notebook.a1,
  a2: notebook.a2,
  a3: notebook.a3,
  a4: notebook.a4,
  a5: notebook.a5,
  a6: notebook.a6,
  a7: notebook.a7,
  a8: notebook.a8,
  a9: notebook.a9,
  a10: notebook.a10,
  a11: notebook.a11,
  a12: notebook.a12,
  a13: notebook.a13,
  'conclusão do avaliador': notebook.conclusion,
  'exclusão de arquivos recebidos': notebook.archivesExclusion ? 'SIM' : 'NÃO',
  'Carimbo de data/hora': new Date().toISOString()
});

export const updateNotebookEntityToUpdateModel = (
  notebook: UpdateNotebookEntity
): UpdateModel<Notebook> => {
  return {
    'tema 1': notebook.subject1,
    'tema 2': notebook.subject2,
    'tema 3': notebook.subject3,
    'tema 4': notebook.subject4,
    'tema 5': notebook.subject5,
    'tema 6': notebook.subject6,
    'tema 7': notebook.subject7,
    'tema 8': notebook.subject8,
    'tema 9': notebook.subject9,
    'tema 10': notebook.subject10,
    'conteúdos relevantes': notebook.relevantContent,
    aprovado: notebook.approved ? 'SIM' : 'NÃO',
    a1: notebook.a1,
    a2: notebook.a2,
    a3: notebook.a3,
    a4: notebook.a4,
    a5: notebook.a5,
    a6: notebook.a6,
    a7: notebook.a7,
    a8: notebook.a8,
    a9: notebook.a9,
    a10: notebook.a10,
    a11: notebook.a11,
    a12: notebook.a12,
    a13: notebook.a13,
    'conclusão do avaliador': notebook.conclusion,
    'exclusão de arquivos recebidos': notebook.archivesExclusion
      ? 'SIM'
      : 'NÃO',
    'Carimbo de data/hora': notebook.evaluatedDate
  };
};
