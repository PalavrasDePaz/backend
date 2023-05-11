/**
 * @example {
 * "email": "test@gmail.com",
 * "name": "test",
 * "birthDate": "2023-03-01T02:27:27.610Z",
 * "phoneNumber": "test",
 * "country": "test",
 * "state": "test",
 * "city": "test",
 * "ethnicity": "test",
 * "gender": "test",
 * "howFoundPep": "test",
 * "knowledgePep": "test",
 * "workshops": [
 *   "test"
 * ],
 * "schooling": "test",
 * "studiesKnowlegde": "test",
 * "lifeExperience": "test",
 * "desires": "test",
 * "rolesPep": [
 *   "test"
 * ],
 * "weekAvailability": 20,
 * "meetingAvailability": "test",
 * "contribution": "test",
 * "needDeclaration": false
 * }
 */
export type VolunteerEntity = {
  /**
   * @pattern ^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$ must be a valid email
   */
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
