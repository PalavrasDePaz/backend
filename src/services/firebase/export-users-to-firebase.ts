import { VolunteerEntity } from '@src/domain/entities/volunteer-entity';
import admin from '@src/services/firebase';
import { v4 as uuidV4 } from 'uuid';

import {
  UserImportRecord,
  UserImportResult
} from 'firebase-admin/lib/auth/user-import-builder';

export const exportVolunteerstToFirebase = async function (
  volunteers: VolunteerEntity[]
): Promise<UserImportResult> {
  const usersToExport = volunteers.map(
    (volunteer: VolunteerEntity): UserImportRecord => {
      return {
        uid: uuidV4(),
        email: volunteer.email
      };
    }
  );

  return admin.auth().importUsers(usersToExport);
};
