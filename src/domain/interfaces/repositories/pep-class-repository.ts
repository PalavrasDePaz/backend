import { PepClassEntity } from '@src/domain/entities/pep-class/pep-class-entity';
import { UpdatePepClassEntity } from '@src/domain/entities/pep-class/update-pep-class-entity';

export interface PepClassRepository {
  getClassesFromId(classId: number): Promise<PepClassEntity[]>;

  getPepClassById(classId: number): Promise<PepClassEntity | null>;

  updatedClass(
    classId: number,
    pepClass: UpdatePepClassEntity
  ): Promise<PepClassEntity | null>;
}
