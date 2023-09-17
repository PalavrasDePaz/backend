import BookClubClassEntity, {
  AssociatedBCCEntity
} from '@src/domain/entities/book-club-class/book-club-class';
import { BookClubClass } from '../models/book-club-class';
import { UpdateBCClassEntity } from '@src/domain/entities/book-club-class/update-class-entity';
import updateModel from './helpers/update-model-type';

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

export const updateBCClassEntityToUpdateModel = (
  bookClubClass: UpdateBCClassEntity
): updateModel<BookClubClass> => {
  return {
    datarecebrelatorio: bookClubClass.reportReceiveDate,
    emprestimo: bookClubClass.loanDate,
    devolucao: bookClubClass.returnDate,
    dataelabrelatorio: bookClubClass.reportElaborationDate,
    recebido: bookClubClass.received,
    simlista: bookClubClass.yesList,
    listapresenca: bookClubClass.presenceList,
    qrl: bookClubClass.qrl,
    datainvioparec: bookClubClass.sendDateParec,
    pressedex: bookClubClass.presSedex,
    datainviofunap: bookClubClass.sendDateFunap,
    pressedex2: bookClubClass.presSedex2,
    datafimaval: bookClubClass.endEvaluationDate,
    parec: bookClubClass.parec,
    linkpasta: bookClubClass.folderLink
  };
};
