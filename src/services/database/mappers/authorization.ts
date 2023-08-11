import { PermissionEntity } from '@src/domain/entities/volunteer/permission-entity';
import { Authorization } from '../models/authorization';

export const authorizationModelToEntity = (
  authorization: Authorization
): PermissionEntity => {
  return {
    name: authorization.name,
    permissions: {
      attendanceModulePermission: authorization['mod presenca'],
      manageVolunteerModulePermission: authorization['mod ger vol'],
      determineVolunteerModulePermission: authorization['mod det vol'],
      essayModulePermission: authorization['mod bo redacao'],
      notebookModulePermission: authorization['mod bo cadernos']
    }
  };
};
