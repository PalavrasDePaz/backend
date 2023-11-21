import { VolunteerRepository } from '@src/domain/interfaces/repositories/volunteer-repository';
import { VolunteerEntity } from '@src/domain/entities/volunteer/volunteer-entity';
import { Volunteer } from '@src/services/database/models/volunteer';
import {
  volunteerModelToEntity,
  updateVolunteerEntityToUpdateModel,
  volunteerModelToAuthEntity,
  createVolunteerEntityToCreationModel,
  volunteerModelToDownloadToEntity
} from '@src/services/database/mappers/volunteer';
import { VolunteerError } from '@src/domain/errors/volunteer';
import { VolunteerWithAuthEntity } from '@src/domain/entities/volunteer/volunteer-with-auth-entity';
import { Op, UniqueConstraintError } from 'sequelize';
import { UpdateVolunteerEntity } from '@src/domain/entities/volunteer/update-volunteer-entity';
import { provideSingleton } from '@src/helpers/provide-singleton';
import { hashString } from '@src/helpers/message-hashing';
import { CreateVolunteerEntity } from '@src/domain/entities/volunteer/create-volunteer-entity';
import { PermissionEntity } from '@src/domain/entities/volunteer/permission-entity';
import { Authorization } from '../database/models/authorization';
import { authorizationModelToEntity } from '../database/mappers/authorization';
import { VolunteerDownloadEntity } from '@src/domain/entities/volunteer/volunteer-download-entity';
import { PaginationParams } from '@src/presentation/types/paginationParams';
import { wrapPagination } from './helpers/wrapPagination';

@provideSingleton(SequelizeVolunteerRepository)
export class SequelizeVolunteerRepository implements VolunteerRepository {
  getVolunteersFromDate = wrapPagination(
    async (
      pagination: PaginationParams,
      date: Date
    ): Promise<[VolunteerEntity[], number]> => {
      const { filter, ...paginationRest } = pagination;
      const attendances = await Volunteer.findAll({
        where: {
          createdAt: { [Op.gte]: date },
          ...filter
        },
        ...paginationRest
      });

      const totalCount = await Volunteer.count({
        where: {
          createdAt: { [Op.gte]: date },
          ...filter
        }
      });

      return [attendances.map(volunteerModelToEntity), totalCount];
    }
  );

  async getVolunteersDownloadFromDate(
    date: Date
  ): Promise<VolunteerDownloadEntity[]> {
    const attendances = await Volunteer.findAll({
      where: {
        createdAt: { [Op.gte]: date }
      },
      order: [['createdAt', 'DESC']]
    });

    return attendances.map(volunteerModelToDownloadToEntity);
  }
  async getPermissionByAuthName(
    name: string
  ): Promise<PermissionEntity | null> {
    const permissions = await Authorization.findOne({ where: { name: name } });
    return permissions ? authorizationModelToEntity(permissions) : null;
  }

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
    const updatedVolunteer = updateVolunteerEntityToUpdateModel(volunteer);
    const updatedRows = (
      await Volunteer.update(updatedVolunteer, {
        where: { 'e-mail': email }
      })
    )[0];

    const emailUpdated = updatedVolunteer?.['e-mail']
      ? updatedVolunteer['e-mail']
      : email;

    return updatedRows ? await this.getVolunteerByEmail(emailUpdated) : null;
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
