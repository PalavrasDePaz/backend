export type PermissionUnionType =
  | 'attendanceModulePermission'
  | 'manageVolunteerModulePermission'
  | 'determineVolunteerModulePermission'
  | 'essayModulePermission'
  | 'notebookModulePermission'
  | 'moduleNewsPermission';

export type PermissionEntity = {
  name: string;
  permissions: Record<PermissionUnionType, boolean | undefined>;
};
