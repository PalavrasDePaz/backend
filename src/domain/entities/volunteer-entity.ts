export type VolunteerEntity = {
  email: string;
  name: string;
  pep?: number;
  birthDate: Date;
  phoneNumber: string;
  country: string;
  state: string;
  city: string;
  ethnicity: string;
  disability?: string;
  gender: string;
  sex?: string;
  socialName?: string;
  howFoundPep: string;
  knowledgePep: string;
  workshops: string[];
  schooling: string;
  bachelor?: string;
  studiesKnowlegde: string;
  lifeExperience: string;
  desires: string;
  rolesPep: string[];
  weekAvailability: number;
  meetingAvailability: string;
  interestFutureRoles?: string[];
  contribution: string;
  needDeclaration: boolean;
};