import AvailableClassRowEntity from '@src/domain/entities/book-club-class/available-essay-row-entity';
import { AssociatedBCCEntity } from '@src/domain/entities/book-club-class/book-club-class';

export interface BookClubClassRepository {
  countEvaluatedClassesByIdVol(idvol: number): Promise<{ count: number }>;

  getAvailableClasses(): Promise<AvailableClassRowEntity[]>;

  getReservedClassesByIdVol(idvol: number): Promise<AvailableClassRowEntity[]>;

  reserveClassForVolunteer(
    idvol: number,
    idclass: number
  ): Promise<AvailableClassRowEntity | null>;

  getBookClubClassById(idclass: number): Promise<AssociatedBCCEntity | null>;
}
