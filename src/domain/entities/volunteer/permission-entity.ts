export type PermissionUnionType =
  | 'attendanceModulePermission'
  | 'manageVolunteerModulePermission'
  | 'determineVolunteerModulePermission'
  | 'essayModulePermission'
  | 'notebookModulePermission';

export type PermissionEntity = {
  name: string;
  permissions: Record<PermissionUnionType, boolean | undefined>;
};
