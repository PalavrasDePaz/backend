import {
  UpdateVolunteerValues,
  VolunteerRepository
} from '@src/domain/interfaces/repositories/volunteer-repository';
import { VolunteerEntity } from '@src/domain/entities/volunteer-entity';
import { VolunteerAPI } from '@src/presentation/routers/volunteer/volunteeer-api';
import { Application, Router } from 'express';
import { App } from '@src/server';
import VolunteerRouter from '@src/presentation/routers/volunteer';
import request from 'supertest';

describe('Volunteer Router', () => {
  class MockVolunteerController implements VolunteerRepository {
    updateVolunteer(
      email: string,
      values: UpdateVolunteerValues
    ): Promise<boolean> {
      throw new Error('Method not implemented.');
    }
    getVolunteerByEmail(email: string): Promise<VolunteerEntity | null> {
      throw new Error('Method not implemented.');
    }
    getAllVolunteers(): Promise<VolunteerEntity[]> {
      throw new Error('Method not implemented.');
    }
    createVolunteer(volunteer: VolunteerEntity): Promise<VolunteerEntity> {
      throw new Error('Method not implemented.');
    }
    deleteVolunteerByEmail(email: string): Promise<number> {
      throw new Error('Method not implemented.');
    }
  }

  let server: Application;
  let volunteerController: VolunteerRepository;
  beforeAll(() => {
    volunteerController = new MockVolunteerController();
    const volunteerAPI = new VolunteerAPI(volunteerController);
    const router = Router();
    router.use('/volunteer', new VolunteerRouter(volunteerAPI).routes());
    server = new App(router).server;
  });

  it('Should get a user by the email and return status 200', async () => {
    const volunteer: VolunteerEntity = {
      email: 'test@gmail.com',
      name: 'test'
    };

    jest
      .spyOn(volunteerController, 'getVolunteerByEmail')
      .mockImplementation((email: string): Promise<VolunteerEntity> => {
        return new Promise(() => {
          return volunteer;
        });
      });

    const response = await request(server)
      .get('/volunteer')
      .send({ email: 'test@gmail.com' });

    expect(response.status).toBe(200);
    expect(response.body.volunteer).toEqual(volunteer);
  });
});
