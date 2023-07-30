export default interface AvailableEssayRowEntity {
  idclass: number;
  place: string | undefined;
  dateReserved: Date | null | undefined;
  dateConcluded: Date | null | undefined;
  folderLink: string | undefined;
}
