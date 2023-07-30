import { Pep } from './models/class';
import { Notebook } from './models/notebook';
import { BookClubClass } from './models/book-club-class';
import { Volunteer } from './models/volunteer';
import { Place } from './models/place';
import { Attendance } from './models/attendance';
import { Authorization } from './models/authorization';
import sequelize from './sequelize';

const initModels = () => {
  Volunteer.initialize(sequelize);
  Notebook.initialize(sequelize);
  Attendance.initialize(sequelize);
  BookClubClass.initialize(sequelize);
  Pep.initialize(sequelize);
  Place.initialize(sequelize);
  Authorization.initialize(sequelize);

  Volunteer.hasMany(Attendance, { foreignKey: 'idvol' });
  Attendance.belongsTo(Volunteer, { foreignKey: 'idvol' });

  Volunteer.hasMany(Notebook, { foreignKey: 'idvol' });
  Notebook.belongsTo(Volunteer, { foreignKey: 'idvol', as: 'volunteer' });

  Pep.hasMany(Notebook, { foreignKey: 'idpep' });
  Notebook.belongsTo(Pep, { foreignKey: 'idpep', as: 'pep' });

  Place.hasMany(BookClubClass, { foreignKey: 'Place' });
  BookClubClass.belongsTo(Place, { foreignKey: 'Place', as: 'place' });
};

export default initModels;
