import { VolunteerRepository } from '@src/domain/interfaces/repositories/volunteer-repository';
import { VolunteerEntity } from '@src/domain/entities/volunteer-entity';
import { Volunteer } from '@src/services/database/models/volunteer';
import {
  volunteerWithAuthEntityToCreationModel,
  volunteerModelToEntity,
  updateVolunteerEntityToUpdateModel,
  volunteerModelToAuthEntity
} from '@src/services/database/mappers/volunteer';
import { VolunteerError } from '@src/domain/errors/volunteer';
import { VolunteerWithAuthEntity } from '@src/domain/entities/volunteer-with-auth-entity';
import { ValidationError } from 'sequelize';
import { UpdateVolunteerEntity } from '@src/domain/entities/update-volunteer-entity';
import nodemailer from 'nodemailer';

export class SequelizeVolunteerRepository implements VolunteerRepository {
  createPasswordForEmail(_: string): Promise<void> {
    throw new Error('Method not implemented.');
  }

  async getVolunteerWithAuthDataByEmail(
    email: string
  ): Promise<VolunteerWithAuthEntity> {
    const volunteer = await Volunteer.findOne({ where: { 'e-mail': email } });
    if (volunteer == null) {
      throw new VolunteerError({
        name: 'VOLUNTEER_NOT_FOUND',
        message: 'Volunteer not found'
      });
    }
    return volunteerModelToAuthEntity(volunteer);
  }

  async updateVolunteer(
    volunteer: UpdateVolunteerEntity,
    email: string
  ): Promise<VolunteerEntity> {
    const updatedRows = await Volunteer.update(
      updateVolunteerEntityToUpdateModel(volunteer),
      {
        where: { 'e-mail': email }
      }
    );

    if (updatedRows[0] == 0) {
      throw new VolunteerError({
        name: 'VOLUNTEER_NOT_UPDATED',
        message: 'Volunteer not updated'
      });
    }
    const updatedVolunteer = await this.getVolunteerByEmail(email);
    return updatedVolunteer;
  }

  async getVolunteerByEmail(email: string): Promise<VolunteerEntity> {
    const volunteer = await Volunteer.findOne({ where: { 'e-mail': email } });
    if (volunteer == null) {
      throw new VolunteerError({
        name: 'VOLUNTEER_NOT_FOUND',
        message: 'Volunteer not found'
      });
    }
    return volunteerModelToEntity(volunteer);
  }

  async getAllVolunteers(): Promise<VolunteerEntity[]> {
    const volunteers = await Volunteer.findAll();
    return volunteers.map(volunteerModelToEntity);
  }

  async createVolunteer(
    volunteer: VolunteerWithAuthEntity
  ): Promise<VolunteerEntity> {
    try {
      const result = await Volunteer.create(
        volunteerWithAuthEntityToCreationModel(volunteer)
      );
      return volunteerModelToEntity(result);
    } catch (error) {
      if (
        error instanceof ValidationError &&
        error.errors.find(
          (sequelizeError) => sequelizeError.message == 'E-MAIL must be unique'
        )
      ) {
        throw new VolunteerError({
          name: 'VOLUNTEER_ALREADY_EXISTS',
          message: `Volunteer with email ${volunteer.email} already exists`,
          details: error
        });
      }
      throw new VolunteerError({
        name: 'UNSPECIFIED_ERROR',
        message: 'not specified error',
        details: error
      });
    }
  }

  async deleteVolunteerByEmail(email: string): Promise<void> {
    const deletedVolunteers = await Volunteer.destroy({
      where: { 'e-mail': email }
    });
    if (!deletedVolunteers) {
      throw new VolunteerError({
        name: 'VOLUNTEER_NOT_FOUND',
        message: 'Volunteer not found'
      });
    }
  }

  async sendEamilToVolunteer(email: string): Promise<void> {
    const transporter = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      auth: {
        user: 'godfrey.christiansen37@ethereal.email',
        pass: 'w3AYGATKTENVVDMrA9'
      }
    });

    const info = await transporter.sendMail({
      from: 'Administrador <eduardorsimoes@gmail.com>', // sender address
      to: email, // list of receivers
      subject: 'Cadastro Palavra da Paz', // Subject line
      html: '<p>Para finalizar  cadastr clique <a href="https://www.google.com/">aqui</a></p>' // html body
    });

    console.log(info.messageId);
  }
}
