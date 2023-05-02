import { UpdateVolunteerEntity } from '@src/domain/entities/update-volunteer-entity';
import { VolunteerEntity } from '@src/domain/entities/volunteer-entity';
import { VolunteerWithAuthEntity } from '@src/domain/entities/volunteer-with-auth-entity';

export interface VolunteerRepository {
  updateVolunteer(
    volunteer: UpdateVolunteerEntity,
    email: string
  ): Promise<VolunteerEntity>;

  getVolunteerByEmail(email: string): Promise<VolunteerEntity>;

  getVolunteerWithAuthDataByEmail(
    email: string
  ): Promise<VolunteerWithAuthEntity>;

  getAllVolunteers(): Promise<VolunteerEntity[]>;

  createVolunteer(volunteer: VolunteerWithAuthEntity): Promise<VolunteerEntity>;

  deleteVolunteerByEmail(email: string): Promise<void>;

  createPasswordForEmail(email: string): Promise<void>;

  sendEamilToVolunteer(email: string): Promise<void>;
}
