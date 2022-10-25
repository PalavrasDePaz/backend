import {
  VolunteerAlreadyExistsError,
  VolunteerController
} from '@src/controllers/interfaces/volunteer-controller';
import { VolunteerEntity } from '@src/entities/volunteer-entity';
import { Volunteer } from '@src/services/database/models/volunteer';

export class SequelizeVolunteerController implements VolunteerController {
  async getVolunteerByEmail(email: string): Promise<VolunteerEntity | null> {
    const volunteer = await Volunteer.findOne({ where: { email: email } });
    return volunteer ? _mapVolunteerToVolunteerEntity(volunteer) : null;
  }

  async getAllVolunteers(): Promise<VolunteerEntity[]> {
    const volunteers = await Volunteer.findAll();
    return volunteers.map(_mapVolunteerToVolunteerEntity);
  }

  async createVolunteer(volunteer: VolunteerEntity): Promise<VolunteerEntity> {
    try {
      const result = await Volunteer.create({
        name: volunteer.name,
        email: volunteer.email
      });
      return _mapVolunteerToVolunteerEntity(result);
    } catch (error) {
      throw new VolunteerAlreadyExistsError(
        `Volunteer with email ${volunteer.email} already exists`
      );
    }
  }

  async deleteVolunteerByEmail(email: string): Promise<number> {
    return Volunteer.destroy({ where: { email: email } });
  }
}

function _mapVolunteerToVolunteerEntity(volunteer: Volunteer): VolunteerEntity {
  return {
    email: volunteer.email,
    name: volunteer.name
  };
}
