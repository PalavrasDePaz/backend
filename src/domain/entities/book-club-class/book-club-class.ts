import { BookEvaluationEntity } from '../book-evaluation/book-evaluation-entity';
import { PlaceEntity } from '../place-entity';

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
interface BookClubClass {
  idclass: number;
  reportReceiveDate: Date;
  loanDate?: Date;
  returnDate?: Date;
  reportElaborationDate?: Date;
  received?: string;
  yesList?: string;
  presenceList?: number;
  qrl: number;
  sendDateParec?: Date | null;
  presSedex?: string;
  sendDateFunap?: Date;
  presSedex2?: string;
  endEvaluationDate?: Date | null;
  parec?: string;
  idvol?: number | null;
  folderLink?: string;
}

export interface BookClubClassModel {
  placeId: number;
  datarecebrelatorio: Date;
  emprestimo?: Date;
  devolucao?: Date;
  dataelabrelatorio?: Date;
  recebido?: string;
  simlista?: string;
  listapresenca?: number;
  qrl: number;
  datainvioparec?: Date | null;
  pressedex?: string;
  datainviofunap?: Date;
  pressedex2?: string;
  datafimaval?: Date | null;
  parec?: string;
  idvol?: number | null;
  linkpasta?: string;
}

export default interface BookClubClassEntity extends BookClubClass {
  place: number;
}

export interface AssociatedBCCEntity extends BookClubClass {
  place: PlaceEntity | undefined;
  bookEvaluations: BookEvaluationEntity[];
}

export interface BookClassAllInfo extends BookClubClassEntity {
  placeName: string | null;
  volunteerName: string | null;
}

export type CreateBookClass = Omit<BookClubClassEntity, 'idclass'>;
