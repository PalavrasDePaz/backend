import { VolunteerEntity } from '@src/domain/entities/volunteer-entity';

export class VolunteerNotFoundError extends Error {}
export class VolunteerAlreadyExistsError extends Error {}
export class WrongEmailFormatError extends Error {
  message = '';
}

export interface VolunteerRepository {
  updateVolunteer(email: string, volunteer: VolunteerEntity): Promise<boolean>;

  getVolunteerByEmail(email: string): Promise<VolunteerEntity | null>;

  getAllVolunteers(): Promise<VolunteerEntity[]>;

  createVolunteer(volunteer: VolunteerEntity): Promise<VolunteerEntity>;

  deleteVolunteerByEmail(email: string): Promise<number>;
}
