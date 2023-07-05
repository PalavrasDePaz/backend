import { VolunteerEntity } from '../volunteer/volunteer-entity';
import BookClubClassEntity from './book-club-class';

export type ReserveEssayDataEntity = Pick<VolunteerEntity, 'idvol'> &
  Pick<BookClubClassEntity, 'idclass'>;
