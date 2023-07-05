import AvailableEssayRowEntity from '@src/domain/entities/book-club-class/available-essay-row-entity';
import { AssociatedBCCEntity } from '@src/domain/entities/book-club-class/book-club-class';

export interface BookClubClassRepository {
  countEvaluatedBookClubClassByIdVol(idvol: number): Promise<{ count: number }>;

  getAvailableEssays(): Promise<AvailableEssayRowEntity[]>;

  getReservedEssaysByIdVol(idvol: number): Promise<AvailableEssayRowEntity[]>;

  reserveEssayForVolunteer(
    idvol: number,
    idclass: number
  ): Promise<AvailableEssayRowEntity | null>;

  getBookClubClassById(idclass: number): Promise<AssociatedBCCEntity | null>;
}
