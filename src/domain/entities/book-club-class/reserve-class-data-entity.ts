import { VolunteerEntity } from '../volunteer/volunteer-entity';
import BookClubClassEntity from './book-club-class';

export type ReserveClassDataEntity = Pick<VolunteerEntity, 'idvol'> &
  Pick<BookClubClassEntity, 'idclass'>;
