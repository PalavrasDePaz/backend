import { VolunteerEntity } from '@src/entities/volunteer-entity';
import admin from '@src/services/firebase';
import { v4 as uuidV4 } from 'uuid';

import {
  UserImportRecord,
  UserImportResult
} from 'firebase-admin/lib/auth/user-import-builder';

export class FirebaseUsersHandler {
  async exportVolunteers(
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
  }
}
