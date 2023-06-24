import { VolunteerRepository } from '@src/domain/interfaces/repositories/volunteer-repository';
import { VolunteerEntity } from '@src/domain/entities/volunteer/volunteer-entity';
import { Volunteer } from '@src/services/database/models/volunteer';
import {
  volunteerModelToEntity,
  updateVolunteerEntityToUpdateModel,
  volunteerModelToAuthEntity,
  createVolunteerEntityToCreationModel
} from '@src/services/database/mappers/volunteer';
import { VolunteerError } from '@src/domain/errors/volunteer';
import { VolunteerWithAuthEntity } from '@src/domain/entities/volunteer/volunteer-with-auth-entity';
import { UniqueConstraintError } from 'sequelize';
import { UpdateVolunteerEntity } from '@src/domain/entities/volunteer/update-volunteer-entity';
import { provideSingleton } from '@src/helpers/provide-singleton';
import { hashString } from '@src/helpers/message-hashing';
import { CreateVolunteerEntity } from '@src/domain/entities/volunteer/create-volunteer-entity';

@provideSingleton(SequelizeVolunteerRepository)
export class SequelizeVolunteerRepository implements VolunteerRepository {
  async updateOrCreatePasswordForEmail(
    email: string,
    password: string
  ): Promise<boolean> {
    const updatedRows = (
      await Volunteer.update(
        { senha: hashString(password) },
        { where: { 'e-mail': email } }
      )
    )[0];
    return updatedRows ? true : false;
  }

  async getVolunteerWithAuthDataByEmail(
    email: string
  ): Promise<VolunteerWithAuthEntity | null> {
    const volunteer = await Volunteer.findOne({ where: { 'e-mail': email } });
    return volunteer ? volunteerModelToAuthEntity(volunteer) : null;
  }

  async updateVolunteer(
    volunteer: UpdateVolunteerEntity,
    email: string
  ): Promise<VolunteerEntity | null> {
    const updatedRows = (
      await Volunteer.update(updateVolunteerEntityToUpdateModel(volunteer), {
        where: { 'e-mail': email }
      })
    )[0];

    return updatedRows ? await this.getVolunteerByEmail(email) : null;
  }

  async getVolunteerByEmail(email: string): Promise<VolunteerEntity | null> {
    const volunteer = await Volunteer.findOne({ where: { 'e-mail': email } });
    return volunteer ? volunteerModelToEntity(volunteer) : null;
  }

  async getVolunteerById(id: number): Promise<VolunteerEntity | null> {
    const volunteer = await Volunteer.findOne({ where: { idvol: id } });
    return volunteer ? volunteerModelToEntity(volunteer) : null;
  }

  async getAllVolunteers(): Promise<VolunteerEntity[]> {
    const volunteers = await Volunteer.findAll();
    return volunteers.map(volunteerModelToEntity);
  }

  async createVolunteer(
    volunteer: CreateVolunteerEntity
  ): Promise<VolunteerEntity> {
    try {
      const result = await Volunteer.create(
        createVolunteerEntityToCreationModel(volunteer)
      );
      return volunteerModelToEntity(result);
    } catch (error) {
      if (error instanceof UniqueConstraintError) {
        throw new VolunteerError({
          name: 'VOLUNTEER_ALREADY_EXISTS',
          message: `Volunteer with email ${volunteer.email} already exists`
        });
      }
      throw new VolunteerError({
        name: 'UNSPECIFIED_ERROR',
        message: 'not specified error',
        details: error
      });
    }
  }

  async deleteVolunteerByEmail(email: string): Promise<boolean> {
    const deletedVolunteers = await Volunteer.destroy({
      where: { 'e-mail': email }
    });

    return deletedVolunteers ? true : false;
  }
}
