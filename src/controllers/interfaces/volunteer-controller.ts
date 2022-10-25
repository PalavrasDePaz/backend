import { VolunteerEntity } from '@src/entities/volunteer-entity';

export class VolunteerNotFoundError extends Error {}
export class VolunteerAlreadyExistsError extends Error {}

export interface VolunteerController {
  getVolunteerByEmail(email: string): Promise<VolunteerEntity | null>;

  getAllVolunteers(): Promise<VolunteerEntity[]>;

  createVolunteer(volunteer: VolunteerEntity): Promise<VolunteerEntity>;

  deleteVolunteerByEmail(email: string): Promise<number>;
}
