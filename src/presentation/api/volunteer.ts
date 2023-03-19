import { VolunteerRepository } from '@src/domain/interfaces/repositories/volunteer-repository';
import { VolunteerEntity } from '@src/domain/entities/volunteer-entity';
import { Request, Response } from 'express';
import { sign } from 'jsonwebtoken';
import { JWT_SECRET_KEY } from '@src/config/server';
import { checkPasswordWithHash } from '@src/helpers/password_hashing';
import { JWTPayload } from '../types/jwt-payload';

export class VolunteerAPI {
  private volunteerRepository: VolunteerRepository;

  constructor(volunteerRepository: VolunteerRepository) {
    this.volunteerRepository = volunteerRepository;
  }

  login = async (request: Request, response: Response) => {
    const email = request.body.email;
    const password = request.body.password;

    const volunteer = await this.volunteerRepository.getVolunteerByEmail(email);

    if (volunteer && checkPasswordWithHash(password, volunteer.password)) {
      const payload: JWTPayload = { email: email };
      const token = sign(payload, JWT_SECRET_KEY, { expiresIn: '2h' });
      response.status(201).json({ volunteer: { email: email }, token: token });
    } else {
      response.status(400).json({ error: 'Email or Password incorrect' });
    }
  };

  updateVolunteer = async (request: Request, response: Response) => {
    try {
      const volunteer: VolunteerEntity = request.body;
      const successUpdate = await this.volunteerRepository.updateVolunteer(
        volunteer.email,
        volunteer
      );

      successUpdate
        ? response.status(200).send({ volunteer })
        : response.status(400).send({ error: 'Volunteer not updated' });
    } catch (error) {
      response.status(400).send({ error: error });
    }
  };

  createVolunteer = async (request: Request, response: Response) => {
    try {
      const volunteer: VolunteerEntity = request.body;
      const createdVolunteer = await this.volunteerRepository.createVolunteer(
        volunteer
      );

      response.status(201).send({ volunteer: createdVolunteer });
    } catch (error) {
      response.status(400).send({ error: error });
    }
  };

  getAllVolunteers = async (_: Request, response: Response) => {
    const volunteers = await this.volunteerRepository.getAllVolunteers();
    response.status(200).send({ volunteers: volunteers });
  };

  getVolunteerByEmail = async (request: Request, response: Response) => {
    const email = request.params.email;
    const volunteer = await this.volunteerRepository.getVolunteerByEmail(email);
    if (volunteer == null)
      response
        .status(404)
        .send({ error: `Volunteer with email ${email} not found` });
    else response.status(200).send({ volunteer: volunteer });
  };
}
