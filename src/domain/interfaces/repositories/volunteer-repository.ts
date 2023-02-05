import { VolunteerEntity } from '@src/domain/entities/volunteer-entity';

export class VolunteerNotFoundError extends Error {}
export class VolunteerAlreadyExistsError extends Error {}

export type UpdateVolunteerValues = {
  name?: string;
};

export interface VolunteerRepository {
  getVolunteerByEmail(email: string): Promise<VolunteerEntity | null>;

  getAllVolunteers(): Promise<VolunteerEntity[]>;

  createVolunteer(volunteer: VolunteerEntity): Promise<VolunteerEntity>;

  updateVolunteer(
    email: string,
    values: UpdateVolunteerValues
  ): Promise<boolean>;

  deleteVolunteerByEmail(email: string): Promise<number>;
}
