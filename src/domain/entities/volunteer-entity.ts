/**
 * @example {
 * "email": "test@gmail.com",
 * "name": "test",
 * "birthDate": "2023-03-01T02:27:27.610Z",
 * "phoneNumber": "test",
 * "country": "test",
 * "state": "test",
 * "city": "test",
 * "disability": "test",
 * "howFoundPep": "test",
 * "knowledgePep": "test",
 * "schooling": "test",
 * "bachelor": "test",
 * "studiesKnowledge": "test",
 * "lifeExperience": "test",
 * "desires": "test",
 * "rolesPep": ["test"],
 * "interestFutureRoles": ["test"],
 * "needDeclaration": false
 * }
 */
export interface VolunteerEntity {
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
  disability?: string;
  howFoundPep: string;
  knowledgePep: string;
  schooling: string;
  bachelor?: string;
  studiesKnowledge: string;
  lifeExperience: string;
  desires: string;
  rolesPep: string[];
  interestFutureRoles: string[];
  needDeclaration: boolean;
  idvol?: number;
}
