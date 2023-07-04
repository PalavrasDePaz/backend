import { Pep } from './models/class';
import { Notebook } from './models/notebook';
import { BookClubClass } from './models/book-club-class';
import { Volunteer } from './models/volunteer';
import sequelize from './sequelize';
import { Attendance } from './models/attendance';

const initModels = () => {
  Volunteer.initialize(sequelize);
  Notebook.initialize(sequelize);
  Attendance.initialize(sequelize);
  BookClubClass.initialize(sequelize);
  Pep.initialize(sequelize);

  Volunteer.hasMany(Attendance, { foreignKey: 'idvol' });
  Attendance.belongsTo(Volunteer, { foreignKey: 'idvol' });
  Pep.hasMany(Notebook, { foreignKey: 'idpep' });
  Notebook.belongsTo(Pep, { foreignKey: 'idpep', as: 'pep' });
};

export default initModels;
