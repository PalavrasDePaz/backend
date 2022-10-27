import { FirebaseUsersHandler } from '@src/controllers/implementations/firebase-users-handler';
import { SequelizeVolunteerController } from '@src/controllers/implementations/sequelize-volunteer-controller';
import { VolunteerEntity } from '@src/entities/volunteer-entity';
import { UserImportResult } from 'firebase-admin/lib/auth/user-import-builder';
import initModels from './database';

function paginate<T>(array: T[], pageSize: number, pageNumber: number) {
  // from https://stackoverflow.com/questions/42761068/paginate-javascript-array
  return array.slice(pageNumber * pageSize, (pageNumber + 1) * pageSize);
}

async function sendVolunteersPaginated(
  volunteers: VolunteerEntity[],
  pageSize = 1000
): Promise<UserImportResult[]> {
  const firebaseUsersHandler = new FirebaseUsersHandler();
  let result: UserImportResult[] = [];

  const totalPages = Math.ceil(volunteers.length / pageSize);
  const pageNumbers = [...Array(totalPages).keys()];

  await Promise.all(
    pageNumbers.map(async (pageNumber: number) => {
      const pageVolunteers = paginate<VolunteerEntity>(
        volunteers,
        pageSize,
        pageNumber
      );

      const pageResult = await firebaseUsersHandler.exportVolunteers(
        pageVolunteers
      );
      result = [...result, pageResult];
    })
  );

  return result;
}

(async () => {
  initModels();
  const sequelizeVolunteerController = new SequelizeVolunteerController();
  const volunteers = await sequelizeVolunteerController.getAllVolunteers();
  const result = await sendVolunteersPaginated(volunteers);
  result.map((pageResult: UserImportResult) => {
    pageResult.errors.map((error) => {
      console.log(
        `${error.error} when exporting user ${volunteers[error.index].email}`
      );
    });
  });
})();
