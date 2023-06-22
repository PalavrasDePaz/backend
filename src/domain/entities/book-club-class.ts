export default interface BookClubClassEntity {
  idclass: number;
  place: number;
  reportReceiveDate: Date;
  loanDate: Date | undefined;
  returnDate: Date | undefined;
  reportElaborationDate: Date | undefined;
  received: string | undefined;
  yesList: string | undefined;
  presenceList: number | undefined;
  qrl: number;
  sendDateParec: Date | undefined;
  presSedex: string | undefined;
  sendDateFunap: Date | undefined;
  presSedex2: string | undefined;
  endEvaluationDate: Date | undefined;
  parec: string | undefined;
  idvol: number | undefined;
  folderLink: string | undefined;
}
