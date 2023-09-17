import AvailableClassRowEntity from '@src/domain/entities/book-club-class/available-class-row-entity';
import { AssociatedBCCEntity } from '@src/domain/entities/book-club-class/book-club-class';
import { UpdateBCClassEntity } from '@src/domain/entities/book-club-class/update-class-entity';

export interface BookClubClassRepository {
  countEvaluatedClassesByIdVol(idvol: number): Promise<{ count: number }>;

  getAvailableClasses(): Promise<AvailableClassRowEntity[]>;

  getReservedClassesByIdVol(idvol: number): Promise<AvailableClassRowEntity[]>;

  reserveClassForVolunteer(
    idvol: number,
    idclass: number
  ): Promise<AvailableClassRowEntity | null>;

  getBookClubClassById(idclass: number): Promise<AssociatedBCCEntity | null>;

  getClassesFromId(classId: number): Promise<AssociatedBCCEntity[]>;

  updatedClass(
    classId: number,
    bookClubClass: UpdateBCClassEntity
  ): Promise<AssociatedBCCEntity | null>;
}
