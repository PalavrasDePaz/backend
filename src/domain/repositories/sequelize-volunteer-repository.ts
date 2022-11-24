import {
  UpdateVolunteerValues,
  VolunteerAlreadyExistsError,
  VolunteerRepository
} from '@src/domain/interfaces/repositories/volunteer-repository';
import { VolunteerEntity } from '@src/domain/entities/volunteer-entity';
import { Volunteer } from '@src/services/database/models/volunteer';

export class SequelizeVolunteerRepository implements VolunteerRepository {
  async updateVolunteer(
    email: string,
    values: UpdateVolunteerValues
  ): Promise<boolean> {
    const result = await Volunteer.update(values, {
      where: { email: email }
    });
    if (result[0] == 0) return false;
    return true;
  }

  async getVolunteerByEmail(email: string): Promise<VolunteerEntity | null> {
    const volunteer = await Volunteer.findOne({ where: { email: email } });
    return volunteer ? _mapVolunteerToVolunteerEntity(volunteer) : null;
  }

  async getAllVolunteers(): Promise<VolunteerEntity[]> {
    const volunteers = await Volunteer.findAll({
      attributes: ['name', 'email']
    });
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
