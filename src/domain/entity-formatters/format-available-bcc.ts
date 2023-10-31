import AvailableClassRowEntity from '@src/domain/entities/book-club-class/available-class-row-entity';
import { AssociatedBCCEntity } from '@src/domain/entities/book-club-class/book-club-class';

export const formatAvailableBCClass = (
  associatedBCCEntity: AssociatedBCCEntity
): AvailableClassRowEntity => {
  return {
    idclass: associatedBCCEntity.idclass,
    place: associatedBCCEntity.place?.fullName,
    dateReserved: associatedBCCEntity.sendDateParec,
    dateConcluded: associatedBCCEntity.endEvaluationDate,
    folderLink: associatedBCCEntity.folderLink,
    numEvaluations: associatedBCCEntity.bookEvaluations.length,
    totalEssays: associatedBCCEntity.qrl
  };
};
