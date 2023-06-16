/**
 * @example {
 *  "email": "test@gmail.com",
 *  "password": "test",
 *  "authorPermission": "author",
 *  "readPermission": false,
 *  "bookPermission": false,
 *  "certificationPermission": false
 * }
 */
export interface VolunteerAuthDataEntity {
  /**
   * @pattern ^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$ must be a valid email
   * @example "test@gmail.com"
   */
  email: string;
  password: string;
  authorPermission?: string;
  readPermission?: boolean;
  bookPermission?: boolean;
  certificationPermission?: boolean;
}
