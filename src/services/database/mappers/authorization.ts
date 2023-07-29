import { PermissionEntity } from '@src/domain/entities/volunteer/permission-entity';
import { Authorization } from '../models/authorization';

export const authorizationModelToEntity = (
  authorization: Authorization
): PermissionEntity => {
  return {
    name: authorization.name,
    permissions: {
      attendance: authorization['mod presenca'],
      manageVolunteer: authorization['mod ger vol'],
      determineVolunteer: authorization['mod det vol'],
      essay: authorization['mod bo redacao'],
      notebook: authorization['mod bo cadernos']
    }
  };
};
