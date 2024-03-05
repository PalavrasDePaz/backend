export type PepClassEntity = {
  id: number;
  placeId: number;
  place?: string;
  groupName?: string;
  report?: boolean;
  receivedDay?: Date;
  releasedDay?: Date;
  facilitatorName?: string;
  classOneDate?: Date;
  classTenDate?: Date;
  numEnrolled?: number;
  numEnrolledGotCertificate?: number;
  notebookDirectory?: string;
};

export type PepClassWithPlace = Omit<PepClassEntity, 'place'> & {
  fullName: string;
};
