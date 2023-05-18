import { UpdateVolunteerEntity } from '@src/domain/entities/update-volunteer-entity';
import { VolunteerEntity } from '@src/domain/entities/volunteer-entity';
import { VolunteerWithAuthEntity } from '@src/domain/entities/volunteer-with-auth-entity';

export interface VolunteerRepository {
  updateVolunteer(
    volunteer: UpdateVolunteerEntity,
    email: string
  ): Promise<VolunteerEntity | null>;

  getVolunteerByEmail(email: string): Promise<VolunteerEntity | null>;

  getVolunteerWithAuthDataByEmail(
    email: string
  ): Promise<VolunteerWithAuthEntity | null>;

  getAllVolunteers(): Promise<VolunteerEntity[]>;

  createVolunteer(volunteer: VolunteerWithAuthEntity): Promise<VolunteerEntity>;

  deleteVolunteerByEmail(email: string): Promise<boolean>;

  sendEmailToVolunteer(email: string): Promise<void>;

  updateOrCreatePasswordForEmail(
    email: string,
    password: string
  ): Promise<boolean>;
}
