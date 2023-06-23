import { AvailableNotebookRowEntity } from './available-notebook-row-entity';
import { VolunteerEntity } from './volunteer/volunteer-entity';

export type ReserveNotebookDataEntity = Pick<VolunteerEntity, 'idvol'> &
  Pick<AvailableNotebookRowEntity, 'notebookId'>;
