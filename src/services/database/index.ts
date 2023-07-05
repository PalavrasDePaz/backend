import { Pep } from './models/class';
import { Notebook } from './models/notebook';
import { BookClubClass } from './models/book-club-class';
import { Volunteer } from './models/volunteer';
import sequelize from './sequelize';
import { Place } from './models/place';

const initModels = () => {
  Volunteer.initialize(sequelize);
  Notebook.initialize(sequelize);
  BookClubClass.initialize(sequelize);
  Pep.initialize(sequelize);
  Place.initialize(sequelize);

  Pep.hasMany(Notebook, { foreignKey: 'idpep' });
  Notebook.belongsTo(Pep, { foreignKey: 'idpep', as: 'pep' });

  Place.hasMany(BookClubClass, { foreignKey: 'Place' });
  BookClubClass.belongsTo(Place, { foreignKey: 'Place', as: 'place' });
};

export default initModels;
