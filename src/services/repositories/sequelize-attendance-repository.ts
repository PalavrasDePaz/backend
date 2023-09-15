import { AttendanceEntity } from '@src/domain/entities/attendance-entity';
import { AttendanceRepository } from '@src/domain/interfaces/repositories/attendance-repository';
import {
  SubmitAttendanceEntityToCreationModel,
  attendanceModelToEntity
} from '../database/mappers/attendance';
import { Attendance } from '../database/models/attendance';
import { provideSingleton } from '@src/helpers/provide-singleton';
import { SubmitAttendanceEntity } from '@src/domain/entities/submit-attendance-entity';
import { AttendanceError } from '@src/domain/errors/attendance';
import sequelize from '../database/sequelize';
import { Op, QueryTypes } from 'sequelize';
import attendanceThemeMap from '@src/helpers/attendance/attendance-theme-map';

@provideSingleton(SequelizeAttendanceRepository)
export class SequelizeAttendanceRepository implements AttendanceRepository {
  async getAttendancesFromDate(date: Date): Promise<AttendanceEntity[]> {
    const attendances = await Attendance.findAll({
      where: {
        createdAt: { [Op.gte]: date }
      },
      order: [['createdAt', 'DESC']]
    });

    return attendances.map(attendanceModelToEntity);
  }

  async getAllAttendancesByIdVol(idvol: number): Promise<AttendanceEntity[]> {
    const attendances = await Attendance.findAll({
      where: { idvol },
      order: [['createdAt', 'ASC']]
    });
    return attendances.map(attendanceModelToEntity);
  }

  async submitAttendance(
    attendance: SubmitAttendanceEntity
  ): Promise<AttendanceEntity> {
    try {
      const createdAttendance = await Attendance.create(
        SubmitAttendanceEntityToCreationModel(attendance)
      );

      return attendanceModelToEntity(createdAttendance);
    } catch (error) {
      throw new AttendanceError({
        name: 'UNSPECIFIED_ERROR',
        message: 'unknow error',
        details: error
      });
    }
  }

  formatThemesAsCountString(themesMap: Record<string, string>): string {
    const formatedThemesList = Object.entries(themesMap).map(
      ([theme, mappedTheme]) =>
        `COUNT(CASE WHEN Presenca.TEMA = "${theme}" THEN 1 ELSE NULL END) AS '${mappedTheme}'`
    );

    return formatedThemesList.join(', ');
  }

  async getVolunteersAttendanceMetrics(): Promise<unknown> {
    const formatedThemes = this.formatThemesAsCountString(attendanceThemeMap);
    const result = await sequelize.query(
      `SELECT i.nome, i.idvol, i.countCad as \`aval cadernos\`, i.countLivro as \`aval livro\`, i.cert, i.\`habil-leitura\`, i.\`habil-livro\`, COUNT(Presenca.TEMA) AS Npres, ${formatedThemes}, i.telefone, i.\`e-mail\`, i.\`Submission date\`
      FROM
      (
        SELECT s.idvol, s.nome, s.countCad, s.cert, s.\`habil-leitura\`, s.\`habil-livro\`, s.telefone, s.\`e-mail\`, s.\`Submission date\`, COUNT(TurmasClubeLivro.IDTurma) AS countLivro
        FROM
        (
          SELECT Volunteers.idvol, Volunteers.nome, Volunteers.cert, Volunteers.\`habil-leitura\`, Volunteers.\`habil-livro\`, Volunteers.telefone, Volunteers.\`e-mail\`, Volunteers.\`Submission date\`, COUNT(Cadernos.IDCAD) AS countCad
          FROM
          Volunteers LEFT JOIN Cadernos ON Cadernos.IDVOL = Volunteers.idvol
          WHERE Volunteers.idpep = 0
          GROUP BY Volunteers.idvol
        ) s LEFT JOIN TurmasClubeLivro ON TurmasClubeLivro.IDVOL = s.idvol
        GROUP BY s.IDVOL
      ) i LEFT JOIN Presenca ON Presenca.IDVOL = i.idvol
      GROUP BY i.idvol
      ORDER BY i.nome;`,
      {
        type: QueryTypes.SELECT
      }
    );

    return result;
  }
}
