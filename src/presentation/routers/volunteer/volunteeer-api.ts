import { VolunteerRepository } from '@src/domain/interfaces/repositories/volunteer-repository';
import { VolunteerEntity } from '@src/domain/entities/volunteer-entity';
import { Request, Response } from 'express';

export class VolunteerAPI {
  private volunterController: VolunteerRepository;

  constructor(volunteerControler: VolunteerRepository) {
    this.volunterController = volunteerControler;
  }

  async createVolunteer(request: Request, response: Response) {
    try {
      const volunteer: VolunteerEntity = request.body.volunteer;
      const createdVolunteer = await this.volunterController.createVolunteer(
        volunteer
      );
      response.status(201).send({ volunteer: createdVolunteer });
    } catch (error) {
      response.status(400).send({ error: error });
    }
  }

  async getAllVolunteers(_: Request, response: Response) {
    const volunteers = await this.volunterController.getAllVolunteers();
    response.status(200).send({ volunteers: volunteers });
  }

  async getVolunteerByEmail(request: Request, response: Response) {
    const email = request.body.email;
    const volunteer = await this.volunterController.getVolunteerByEmail(email);
    if (volunteer == null)
      response
        .status(404)
        .send({ error: `Volunteer with email ${email} not found` });
    else response.status(200).send({ volunteer: volunteer });
  }
}
