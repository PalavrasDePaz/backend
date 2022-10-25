import { VolunteerController } from '@src/controllers/volunteer-controller';
import { VolunteerEntity } from '@src/entities/volunteer-entity';
import initModels from '@src/services/database';
import { Volunteer } from '@src/services/database/models/volunteer';
import volunteerDummy from '../dummies/volunteer-dummy';

describe('Volunteer Controller', () => {
  let volunteerController: VolunteerController;

  beforeAll(() => {
    initModels();
    volunteerController = new VolunteerController();
  });

  it('Should get a volunteer by the email', async () => {
    const volunteer: VolunteerEntity = volunteerDummy;

    const result = await volunteerController.getVolunteerByEmail(
      volunteer.email
    );

    expect(result).toEqual(volunteer);
  });

  it('Should create a new volunteer', async () => {
    const volunteer: VolunteerEntity = volunteerDummy;

    const result = await volunteerController.createVolunteer(volunteer);
    const searched = await VolunteerController.getVolunteerByEmail(volunteer);

    expect(result).toEqual(volunteer);
    expect(searched).toEqual(volunteer);

    await volunteerController.deleteVolunteer(volunteer);
  });

  it('Should delete a volunteer', async () => {
    const volunteer: VolunteerEntity = volunteerDummy;
    await volunteerController.createVolunteer(volunteer);

    const result = await volunteerController.deleteVolunteer(volunteer);

    expect(result).toEqual(volunteer);
    expect(await VolunteerController.getVolunteerByEmail(volunteer)).toThrow(
      VolunteerNotFoundError
    );
  });
});
