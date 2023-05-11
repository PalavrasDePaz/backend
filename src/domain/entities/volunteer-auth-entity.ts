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
export type VolunteerAuthDataEntity = {
  email: string;
  password: string;
  authorPermission?: string;
  readPermission?: boolean;
  bookPermission?: boolean;
  certificationPermission?: boolean;
};
