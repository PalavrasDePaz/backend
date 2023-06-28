import { AttendanceEntity } from '@src/domain/entities/attendance-entity';
import { Attendance } from '../models/attendance';

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
  expressYourself: attendance.expressões
});
