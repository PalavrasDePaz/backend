import { Pep } from './models/class';
import { Notebook } from './models/notebook';
import { BookClubClass } from './models/book-club-class';
import { Volunteer } from './models/volunteer';
import { Place } from './models/place';
import { Attendance } from './models/attendance';
import { Authorization } from './models/authorization';
import sequelize from './sequelize';
import { BookEvaluation } from './models/book-evaluation';
import { VolunteerHours } from './models/hours';

const initModels = () => {
  Volunteer.initialize(sequelize);
  Notebook.initialize(sequelize);
  Attendance.initialize(sequelize);
  BookClubClass.initialize(sequelize);
  BookEvaluation.initialize(sequelize);
  Pep.initialize(sequelize);
  Place.initialize(sequelize);
  Authorization.initialize(sequelize);
  VolunteerHours.initialize(sequelize);

  Volunteer.hasMany(Attendance, { foreignKey: 'idvol' });
  Attendance.belongsTo(Volunteer, { foreignKey: 'idvol' });

  Volunteer.hasMany(VolunteerHours, { foreignKey: 'idvol' });
  Volunteer.belongsTo(Volunteer, { foreignKey: 'idvol' });

  Volunteer.hasMany(Notebook, { foreignKey: 'idvol' });
  Notebook.belongsTo(Volunteer, { foreignKey: 'idvol', as: 'volunteer' });

  Pep.hasMany(Notebook, { foreignKey: 'idpep' });
  Notebook.belongsTo(Pep, { foreignKey: 'idpep', as: 'pep' });

  Place.hasMany(BookClubClass, { foreignKey: 'Place' });
  BookClubClass.belongsTo(Place, { foreignKey: 'Place', as: 'place' });

  BookClubClass.hasMany(BookEvaluation, {
    foreignKey: 'Nturma',
    as: 'bookEvaluations'
  });
  BookEvaluation.belongsTo(BookClubClass, { foreignKey: 'Nturma' });
};

export default initModels;
