import { Pep } from './models/class';
import { Notebook } from './models/notebook';
import { BookClubClass } from './models/book-club-class';
import { Volunteer } from './models/volunteer';
import sequelize from './sequelize';
import { Attendance } from './models/attendance';
import { Authorization } from './models/authorization';

const initModels = () => {
  Volunteer.initialize(sequelize);
  Notebook.initialize(sequelize);
  Attendance.initialize(sequelize);
  BookClubClass.initialize(sequelize);
  Pep.initialize(sequelize);
  Authorization.initialize(sequelize);

  Volunteer.hasMany(Attendance, { foreignKey: 'idvol' });
  Attendance.belongsTo(Volunteer, { foreignKey: 'idvol' });

  Volunteer.hasMany(Notebook, { foreignKey: 'idvol' });
  Notebook.belongsTo(Volunteer, { foreignKey: 'idvol', as: 'volunteer' });

  Pep.hasMany(Notebook, { foreignKey: 'idpep' });
  Notebook.belongsTo(Pep, { foreignKey: 'idpep', as: 'pep' });
};

export default initModels;
