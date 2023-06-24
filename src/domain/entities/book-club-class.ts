/**
 * @example {
 * "idclass": 1,
 * "place": 1,
 * "reportReceiveDate": 2023-06-22,
 * "loanDate": 2023-06-23,
 * "returnDate": 2023-06-24,
 * "reportElaborationDate": 2023-06-25,
 * "received": "Presencial",
 * "yesList": "Sim",
 * "presenceList": 15,
 * "qrl": 2,
 * "sendDateParec": 2023-06-26,
 * "presSedex": "Presencial",
 * "sendDateFunap": 2023-06-27,
 * "presSedex2": "Presencial",
 * "endEvaluationDate": 2023-06-28,
 * "parec": "Name",
 * "idvol": 1,
 * "folderLink": "drive-link"
 * }
 */
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
  endEvaluationDate: Date | null | undefined;
  parec: string | undefined;
  idvol: number | undefined;
  folderLink: string | undefined;
}
