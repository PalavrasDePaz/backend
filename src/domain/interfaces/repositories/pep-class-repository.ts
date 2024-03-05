import {
  PepClassEntity,
  PepClassWithPlace
} from '@src/domain/entities/pep-class/pep-class-entity';
import { UpdatePepClassEntity } from '@src/domain/entities/pep-class/update-pep-class-entity';
import { PaginationParams } from '@src/presentation/types/paginationParams';
import { PaginationResult } from '@src/services/repositories/helpers/wrapPagination';
export interface PepClassRepository {
  getClassesFromId(classId: number): Promise<PepClassEntity[]>;

  getPepClassById(classId: number): Promise<PepClassEntity | null>;

  updatedClass(
    classId: number,
    pepClass: UpdatePepClassEntity
  ): Promise<PepClassEntity | null>;

  getAllPepClasses(
    pagination: PaginationParams
  ): Promise<PaginationResult<PepClassWithPlace[]>>;
}
