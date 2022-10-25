import { SequelizeVolunteerController } from '@src/controllers/implementations/sequelize-volunteer-controller';
import { VolunteerController } from '@src/controllers/interfaces/volunteer-controller';
import { VolunteerEntity } from '@src/entities/volunteer-entity';
import initModels from '@src/services/database';
import sequelize from '@src/services/database/sequelize';
import volunteerDummy from '../dummies/volunteer-dummy';

describe('Volunteer Controller', () => {
  let volunteerController: VolunteerController;

  beforeAll(() => {
    initModels();
    volunteerController = new SequelizeVolunteerController();
  });

  afterAll(() => {
    sequelize.close();
  });

  it('Should get a volunteer by the email', async () => {
    const volunteer: VolunteerEntity = volunteerDummy;

    await volunteerController.createVolunteer(volunteer);

    const result = await volunteerController.getVolunteerByEmail(
      volunteer.email
    );

    expect(result).toEqual(volunteer);
    await volunteerController.deleteVolunteerByEmail(volunteer.email);
  });

  it('Should create a new volunteer', async () => {
    const volunteer: VolunteerEntity = volunteerDummy;

    const result = await volunteerController.createVolunteer(volunteer);
    const searched = await volunteerController.getVolunteerByEmail(
      volunteer.email
    );

    expect(result).toEqual(volunteer);
    expect(searched).toEqual(volunteer);

    await volunteerController.deleteVolunteerByEmail(volunteer.email);
  });

  it('Should delete a volunteer', async () => {
    const volunteer: VolunteerEntity = volunteerDummy;
    await volunteerController.createVolunteer(volunteer);

    const numDeletedRows = await volunteerController.deleteVolunteerByEmail(
      volunteer.email
    );

    expect(numDeletedRows).toBe(1);

    const result = await volunteerController.getVolunteerByEmail(
      volunteer.email
    );
    expect(result).toBeNull();
  });
});
