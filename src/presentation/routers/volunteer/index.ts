import { Router } from 'express';
import { VolunteerAPI } from './volunteeer-api';

export default class VolunteerRouter {
  private api: VolunteerAPI;

  constructor(api: VolunteerAPI) {
    this.api = api;
  }

  routes(): Router {
    const router = Router();
    router.post('/create', this.api.createVolunteer);
    router.get('/', this.api.getAllVolunteers);
    router.get('/', this.api.getVolunteerByEmail);

    return router;
  }
}
