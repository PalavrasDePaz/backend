import {
  PepClassEntity,
  PepClassWithPlace
} from '@src/domain/entities/pep-class/pep-class-entity';
import { UpdatePepClassEntity } from '@src/domain/entities/pep-class/update-pep-class-entity';
import { Pep } from '../models/class';
import UpdateModel from './helpers/update-model-type';

export const pepClassModelToEntity = (pepClass: Pep): PepClassEntity => {
  return {
    id: pepClass.id,
    placeId: pepClass.idPlace,
    groupName: pepClass.nGroup,
    report: pepClass['Report Y/N'] == 1,
    receivedDay: pepClass.dayReceived,
    releasedDay: pepClass.dayReleased,
    facilitatorName: pepClass.facil,
    classOneDate: pepClass.t1,
    classTenDate: pepClass.t10,
    numEnrolled: pepClass.total,
    numEnrolledGotCertificate: pepClass['total cert'],
    notebookDirectory: pepClass.directory
  };
};

export const pepClassPlaceModelToEntity = (
  pepClass: Pep & { 'place.fullName'?: string }
): PepClassWithPlace => ({
  id: pepClass.id,
  placeId: pepClass.idPlace,
  fullName: pepClass?.['place.fullName'] ?? '',
  groupName: pepClass.nGroup,
  classOneDate: pepClass.t1,
  classTenDate: pepClass.t10,
  numEnrolled: pepClass.total,
  numEnrolledGotCertificate: pepClass['total cert'],
  notebookDirectory: pepClass.directory
});

export const updatePepClassEntityToUpdateModel = (
  pepClass: UpdatePepClassEntity
): UpdateModel<Pep> => {
  return {
    nGroup: pepClass.groupName,
    'Report Y/N': pepClass.report ? 1 : 0,
    dayReceived: pepClass.receivedDay,
    dayReleased: pepClass.releasedDay,
    facil: pepClass.facilitatorName,
    t1: pepClass.classOneDate,
    t10: pepClass.classTenDate,
    total: pepClass.numEnrolled,
    'total cert': pepClass.numEnrolledGotCertificate,
    directory: pepClass.notebookDirectory
  };
};
