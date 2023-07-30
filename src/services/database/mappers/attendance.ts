import { AttendanceEntity } from '@src/domain/entities/attendance-entity';
import { Attendance } from '../models/attendance';
import { SubmitAttendanceEntity } from '@src/domain/entities/submit-attendance-entity';
import { CreationAttributes } from 'sequelize';

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

export const SubmitAttendanceEntityToCreationModel = (
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
