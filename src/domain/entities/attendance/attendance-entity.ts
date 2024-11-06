export type AttendanceEntity = {
  idvol: number;
  idpep: number;
  idAttend: number;
  workshopSubject: string;
  enoughTime: string;
  studyRetention: string;
  howCanWeImprove?: string;
  applicableKnowledge?: string;
  differentKnowledgeLearned?: string;
  whatChallengedYou?: string;
  expressYourself?: string;
  submissionDate: Date;
};
