export type PermissionUnionType =
  | 'attendance'
  | 'manageVolunteer'
  | 'determineVolunteer'
  | 'essay'
  | 'notebook';

export type PermissionEntity = {
  name: string;
  permissions: Record<PermissionUnionType, boolean | undefined>;
};
