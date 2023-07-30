import BookClubClassEntity, {
  AssociatedBCCEntity
} from '@src/domain/entities/book-club-class/book-club-class';
import { BookClubClass } from '../models/book-club-class';

export const BCCModelToEntity = (
  bookClubClass: BookClubClass
): BookClubClassEntity => ({
  idclass: bookClubClass.idturma,
  place: bookClubClass.placeId,
  reportReceiveDate: bookClubClass.datarecebrelatorio,
  loanDate: bookClubClass.emprestimo,
  returnDate: bookClubClass.devolucao,
  reportElaborationDate: bookClubClass.dataelabrelatorio,
  received: bookClubClass.recebido,
  yesList: bookClubClass.simlista,
  presenceList: bookClubClass.listapresenca,
  qrl: bookClubClass.qrl,
  sendDateParec: bookClubClass.datainvioparec,
  presSedex: bookClubClass.pressedex,
  sendDateFunap: bookClubClass.datainviofunap,
  presSedex2: bookClubClass.pressedex2,
  endEvaluationDate: bookClubClass.datafimaval,
  parec: bookClubClass.parec,
  idvol: bookClubClass.idvol,
  folderLink: bookClubClass.linkpasta
});

export const AssociatedBCCModelToEntity = (
  bookClubClass: BookClubClass
): AssociatedBCCEntity => ({
  idclass: bookClubClass.idturma,
  place: bookClubClass.place,
  reportReceiveDate: bookClubClass.datarecebrelatorio,
  loanDate: bookClubClass.emprestimo,
  returnDate: bookClubClass.devolucao,
  reportElaborationDate: bookClubClass.dataelabrelatorio,
  received: bookClubClass.recebido,
  yesList: bookClubClass.simlista,
  presenceList: bookClubClass.listapresenca,
  qrl: bookClubClass.qrl,
  sendDateParec: bookClubClass.datainvioparec,
  presSedex: bookClubClass.pressedex,
  sendDateFunap: bookClubClass.datainviofunap,
  presSedex2: bookClubClass.pressedex2,
  endEvaluationDate: bookClubClass.datafimaval,
  parec: bookClubClass.parec,
  idvol: bookClubClass.idvol,
  folderLink: bookClubClass.linkpasta
});
