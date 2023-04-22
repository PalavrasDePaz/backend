export type VolunteerAuthDataEntity = {
  email: string;
  password: string;
  authorPermission?: string;
  readPermission?: boolean;
  bookPermission?: boolean;
  certificationPermission?: boolean;
};
