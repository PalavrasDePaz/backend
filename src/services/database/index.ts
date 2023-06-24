import { Pep } from './models/class';
import { Notebook } from './models/notebook';
import { BookClubClass } from './models/book-club-class';
import { Volunteer } from './models/volunteer';
import sequelize from './sequelize';

const initModels = () => {
  Volunteer.initialize(sequelize);
  Notebook.initialize(sequelize);
  BookClubClass.initialize(sequelize);
  Pep.initialize(sequelize);

  Pep.hasMany(Notebook, { foreignKey: 'idpep' });
  Notebook.belongsTo(Pep, { foreignKey: 'idpep', as: 'pep' });
};

export default initModels;
