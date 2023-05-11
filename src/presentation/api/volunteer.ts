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

  login = async (
    request: TypedRequestBody<{ email: string; password: string }>,
    response: TypedResponse<{ token: string }, AuthError>
  ) => {
    const email = request.body.email;
    const password = request.body.password;

    try {
      const volunteer =
        await this.volunteerRepository.getVolunteerWithAuthDataByEmail(email);
      if (checkPasswordWithHash(password, volunteer.password)) {
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
    } catch (error) {
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
    try {
      const volunteer = request.body;
      const email = request.params.email;

      const updatedVolunteer = await this.volunteerRepository.updateVolunteer(
        volunteer,
        email
      );
      response.status(200).json(updatedVolunteer);
    } catch (error) {
      response.status(400).json(error as VolunteerError);
    }
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
    try {
      const volunteer = await this.volunteerRepository.getVolunteerByEmail(
        email
      );
      response.status(200).json(volunteer);
    } catch (error) {
      response.status(400).json(error as VolunteerError);
    }
  };

  deleteVolunteer = async (
    request: TypedRequestParams<{ email: string }>,
    response: TypedResponse<null, VolunteerError>
  ) => {
    const email = request.params.email;
    try {
      await this.volunteerRepository.deleteVolunteerByEmail(email);
      response.status(204).json();
    } catch (error) {
      response.status(400).json(error as VolunteerError);
    }
  };

  sendEmail = async (
    request: TypedRequestParams<{ email: string }>,
    response: TypedResponse<object, VolunteerError>
  ) => {
    const email = request.body.email;
    try {
      await this.volunteerRepository.sendEamilToVolunteer(email);
      response.status(200).json({ message: 'email sent' });
    } catch (error) {
      response.status(400).json(error as VolunteerError);
    }
  };
}
