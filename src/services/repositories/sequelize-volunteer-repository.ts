import {
  VolunteerAlreadyExistsError,
  VolunteerRepository,
  WrongEmailFormatError
} from '@src/domain/interfaces/repositories/volunteer-repository';
import { VolunteerEntity } from '@src/domain/entities/volunteer-entity';
import { Volunteer } from '@src/services/database/models/volunteer';
import { ValidationError } from 'sequelize';
import {
  volunteerEntityToModel,
  volunteerModelToEntity
} from '@src/services/database/dao/volunteer';

export class SequelizeVolunteerRepository implements VolunteerRepository {
  async updateVolunteer(
    email: string,
    volunteer: VolunteerEntity
  ): Promise<boolean> {
    const updatedRows = await Volunteer.update(
      volunteerEntityToModel(volunteer),
      {
        where: { 'e-mail': email }
      }
    );

    if (updatedRows[0] != 1) return false;
    return true;
  }
  async getVolunteerByEmail(email: string): Promise<VolunteerEntity | null> {
    const volunteer = await Volunteer.findOne({ where: { 'e-mail': email } });
    return volunteer ? volunteerModelToEntity(volunteer) : null;
  }

  async getAllVolunteers(): Promise<VolunteerEntity[]> {
    const volunteers = await Volunteer.findAll();
    return volunteers.map(volunteerModelToEntity);
  }

  async createVolunteer(volunteer: VolunteerEntity): Promise<VolunteerEntity> {
    try {
      const result = await Volunteer.create(volunteerEntityToModel(volunteer));

      return volunteerModelToEntity(result);
    } catch (error: unknown) {
      if (error instanceof ValidationError) {
        throw new WrongEmailFormatError();
      }
      throw new VolunteerAlreadyExistsError(
        `Volunteer with email ${volunteer.email} already exists`
      );
    }
  }

  async deleteVolunteerByEmail(email: string): Promise<number> {
    return Volunteer.destroy({ where: { 'e-mail': email } });
  }
}
