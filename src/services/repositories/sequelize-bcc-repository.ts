import { BookClubClassRepository } from '@src/domain/interfaces/repositories/book-club-class-repository';
import { provideSingleton } from '@src/helpers/provide-singleton';
import { BookClubClass } from '../database/models/book-club-class';

@provideSingleton(SequelizeBCCRepository)
export class SequelizeBCCRepository implements BookClubClassRepository {
  async getBookClubClassById(idvol: number): Promise<{ count: number }> {
    const count = await BookClubClass.count({ where: { idvol } });
    return { count };
  }
}
