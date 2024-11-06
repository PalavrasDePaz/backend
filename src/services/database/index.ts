import { Attendance } from './models/attendance';
import { Authorization } from './models/authorization';
import { BookClubClass } from './models/book-club-class';
import { BookEvaluation } from './models/book-evaluation';
import { Pep } from './models/class';
import { VolunteerHours } from './models/hours';
import { Notebook } from './models/notebook';
import { Place } from './models/place';
import { Volunteer } from './models/volunteer';
import sequelize from './sequelize';

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

  Volunteer.hasMany(BookClubClass, { foreignKey: 'idvol' });
  BookClubClass.belongsTo(Volunteer, { foreignKey: 'idvol', as: 'volunteer' });

  Place.hasMany(BookClubClass, { foreignKey: 'Place' });
  BookClubClass.belongsTo(Place, { foreignKey: 'Place', as: 'place' });

  BookClubClass.hasMany(BookEvaluation, {
    foreignKey: 'Nturma',
    as: 'bookEvaluations'
  });
  BookEvaluation.belongsTo(BookClubClass, {
    as: 'bookEvaluations',
    foreignKey: 'Nturma'
  });

  Volunteer.hasMany(BookEvaluation, { foreignKey: 'idvol' });
  BookEvaluation.belongsTo(Volunteer, { foreignKey: 'idvol', as: 'volunteer' });

  Place.hasMany(Pep, {
    foreignKey: 'idPlace',
    as: 'pep'
  });
  Pep.belongsTo(Place, {
    foreignKey: 'idPlace',
    as: 'place'
  });
};

export default initModels;
