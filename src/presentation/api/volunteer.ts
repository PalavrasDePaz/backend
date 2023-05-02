import { VolunteerRepository } from '@src/domain/interfaces/repositories/volunteer-repository';
import { VolunteerEntity } from '@src/domain/entities/volunteer-entity';
import { Request } from 'express';
import { sign } from 'jsonwebtoken';
import { JWT_SECRET_KEY } from '@src/config/server';
import { checkPasswordWithHash } from '@src/helpers/password_hashing';
import { VolunteerJWTPayload } from '../types/volunteer-jwt-payload';
import {
  TypedRequest,
  TypedRequestBody,
  TypedRequestParams,
  TypedResponse
} from '../types/typed-express';
import { VolunteerWithAuthEntity } from '@src/domain/entities/volunteer-with-auth-entity';
import { VolunteerError } from '@src/domain/errors/volunteer';
import { AuthError } from '@src/domain/errors/auth';

export class VolunteerAPI {
  private volunteerRepository: VolunteerRepository;

  constructor(volunteerRepository: VolunteerRepository) {
    this.volunteerRepository = volunteerRepository;
  }

  createOrUpdatePassword = async (
    request: TypedRequest<{ email: string }, { password: string }>,
    response: TypedResponse<null, VolunteerError>
  ) => {
    const email = request.params.email;
    const password = request.body.password;

    const success =
      await this.volunteerRepository.updateOrCreatePasswordForEmail(
        email,
        password
      );

    success
      ? response.status(204).json()
      : response.status(400).json(
          new VolunteerError({
            name: 'VOLUNTEER_NOT_FOUND',
            message:
              'Could not create or update volunteer password because it was not found'
          })
        );
  };

  login = async (
    request: TypedRequestBody<{ email: string; password: string }>,
    response: TypedResponse<{ token: string }, AuthError>
  ) => {
    const email = request.body.email;
    const password = request.body.password;

    const volunteer =
      await this.volunteerRepository.getVolunteerWithAuthDataByEmail(email);

    if (volunteer && checkPasswordWithHash(password, volunteer.password)) {
      const payload: VolunteerJWTPayload = {
        email: volunteer.email,
        bookPermission: volunteer.bookPermission,
        authorPermission: volunteer.authorPermission,
        certificationPermission: volunteer.certificationPermission,
        readPermission: volunteer.readPermission
      };
      const token = sign(payload, JWT_SECRET_KEY, { expiresIn: '2h' });
      response.status(200).json({ token: token });
    } else {
      response.status(400).json(
        new AuthError({
          name: 'EMAIL_OR_PASSWORD_WRONG_ERROR',
          message: 'Email or Password wrong'
        })
      );
    }
  };

  updateVolunteer = async (
    request: TypedRequest<{ email: string }, VolunteerEntity>,
    response: TypedResponse<VolunteerEntity, VolunteerError>
  ) => {
    const volunteer = request.body;
    const email = request.params.email;

    const updatedVolunteer = await this.volunteerRepository.updateVolunteer(
      volunteer,
      email
    );

    updatedVolunteer
      ? response.status(200).json(updatedVolunteer)
      : response.status(400).json(
          new VolunteerError({
            name: 'VOLUNTEER_NOT_UPDATED',
            message: `Volunteer with email ${email} not updated`
          })
        );
  };

  createVolunteer = async (
    request: TypedRequestBody<VolunteerWithAuthEntity>,
    response: TypedResponse<VolunteerEntity, VolunteerError>
  ) => {
    try {
      const volunteer = request.body;
      const createdVolunteer = await this.volunteerRepository.createVolunteer(
        volunteer
      );
      response.status(201).json(createdVolunteer);
    } catch (error) {
      response.status(400).json(error as VolunteerError);
    }
  };

  getAllVolunteers = async (
    _: Request,
    response: TypedResponse<VolunteerEntity[], VolunteerError>
  ) => {
    const volunteers = await this.volunteerRepository.getAllVolunteers();
    response.status(200).json(volunteers);
  };

  getVolunteerByEmail = async (
    request: TypedRequestParams<{ email: string }>,
    response: TypedResponse<VolunteerEntity, VolunteerError>
  ) => {
    const email = request.params.email;

    const volunteer = await this.volunteerRepository.getVolunteerByEmail(email);

    volunteer
      ? response.status(200).json(volunteer)
      : response.status(400).json(
          new VolunteerError({
            name: 'VOLUNTEER_NOT_FOUND',
            message: `Volunteer with email ${email} not found`
          })
        );
  };

  deleteVolunteer = async (
    request: TypedRequestParams<{ email: string }>,
    response: TypedResponse<null, VolunteerError>
  ) => {
    const email = request.params.email;
    const volunteerIsDeleted =
      await this.volunteerRepository.deleteVolunteerByEmail(email);

    volunteerIsDeleted
      ? response.status(204).json()
      : response.status(400).json(
          new VolunteerError({
            name: 'VOLUNTEER_NOT_DELETED',
            message: `Volunteer with email ${email} not deleted`
          })
        );
  };
}
