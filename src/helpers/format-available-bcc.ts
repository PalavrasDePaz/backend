import AvailableClassRowEntity from '@src/domain/entities/book-club-class/available-class-row-entity';
import { AssociatedBCCEntity } from '@src/domain/entities/book-club-class/book-club-class';

export const formatAvailableBCClass = ({
  idclass,
  place,
  sendDateParec,
  endEvaluationDate,
  folderLink
}: AssociatedBCCEntity): AvailableClassRowEntity => ({
  idclass: idclass,
  place: place?.fullName,
  dateReserved: sendDateParec,
  dateConcluded: endEvaluationDate,
  folderLink
});
