export default interface AvailableClassRowEntity {
  idclass: number;
  place?: string;
  dateReserved?: Date | null;
  dateConcluded?: Date | null;
  folderLink?: string;
  numEvaluations: number;
  totalEssays: number;
}
