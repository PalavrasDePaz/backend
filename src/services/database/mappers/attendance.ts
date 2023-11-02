import { AttendanceEntity } from '@src/domain/entities/attendance/attendance-entity';
import { Attendance } from '../models/attendance';
import { SubmitAttendanceEntity } from '@src/domain/entities/attendance/submit-attendance-entity';
import { CreationAttributes } from 'sequelize';
import { AttendanceInfoEntity } from '@src/domain/entities/attendance/attendence-info-entity';

export const attendanceModelToEntityFromDate = (
  attendance: Attendance & { 'Volunteer.nome'?: string }
): AttendanceInfoEntity => ({
  idvol: attendance.idvol,
  name: attendance['Volunteer.nome'] ?? null,
  idAttend: attendance.idpres,
  workshopSubject: attendance.tema,
  enoughTime: attendance.suff,
  studyRetention: attendance.aproveita,
  howCanWeImprove: attendance.melhor,
  applicableKnowledge: attendance.adquiridos,
  differentKnowledgeLearned: attendance.diferente,
  whatChallengedYou: attendance.desafio,
  expressYourself: attendance.expressões,
  submissionDate: attendance.createdAt
});

export const attendanceModelToEntity = (
  attendance: Attendance
): AttendanceEntity => ({
  idvol: attendance.idvol,
  idAttend: attendance.idpres,
  workshopSubject: attendance.tema,
  enoughTime: attendance.suff,
  studyRetention: attendance.aproveita,
  howCanWeImprove: attendance.melhor,
  applicableKnowledge: attendance.adquiridos,
  differentKnowledgeLearned: attendance.diferente,
  whatChallengedYou: attendance.desafio,
  expressYourself: attendance.expressões,
  submissionDate: attendance.createdAt
});

export const submitAttendanceEntityToCreationModel = (
  attendance: SubmitAttendanceEntity
): CreationAttributes<Attendance> => ({
  idvol: attendance.idvol,
  tema: attendance.workshopSubject,
  suff: attendance.enoughTime,
  aproveita: attendance.studyRetention,
  melhor: attendance.howCanWeImprove,
  adquiridos: attendance.applicableKnowledge,
  diferente: attendance.differentKnowledgeLearned,
  desafio: attendance.whatChallengedYou,
  expressões: attendance.expressYourself
});
