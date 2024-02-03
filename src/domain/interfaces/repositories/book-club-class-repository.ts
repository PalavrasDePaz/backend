import AvailableClassRowEntity from '@src/domain/entities/book-club-class/available-class-row-entity';
import BookClubClassEntity, { AssociatedBCCEntity, BookClassAllInfo } from '@src/domain/entities/book-club-class/book-club-class';
import { UpdateBCClassEntity } from '@src/domain/entities/book-club-class/update-class-entity';
import { PaginationParams } from '@src/presentation/types/paginationParams';
import { PaginationResult } from '@src/services/repositories/helpers/wrapPagination';

export interface BookClubClassRepository {
  getAllClasses(pagination: PaginationParams): Promise<PaginationResult<BookClassAllInfo[]>>

  countEvaluatedClassesByIdVol(idvol: number): Promise<{ count: number }>;

  getAvailableClasses(): Promise<AvailableClassRowEntity[]>;

  getReservedClassesByIdVol(idvol: number): Promise<AvailableClassRowEntity[]>;

  reserveClassForVolunteer(
    idvol: number,
    idclass: number
  ): Promise<AvailableClassRowEntity | null>;

  revertReserveClassForVolunteer(
    idclass: number
  ): Promise<AvailableClassRowEntity | null>;

  getBookClubClassById(idclass: number): Promise<AssociatedBCCEntity | null>;

  getClassesFromId(classId: number): Promise<AssociatedBCCEntity[]>;

  updatedClass(
    classId: number,
    bookClubClass: UpdateBCClassEntity
  ): Promise<AssociatedBCCEntity | null>;
}
