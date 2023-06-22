import { Pep } from './models/class';
import { Notebook } from './models/notebook';
import { Volunteer } from './models/volunteer';
import sequelize from './sequelize';

const initModels = () => {
  Volunteer.initialize(sequelize);
  Notebook.initialize(sequelize);
  Pep.initialize(sequelize);

  Pep.hasMany(Notebook, { foreignKey: 'idpep' });
  Notebook.belongsTo(Pep, { foreignKey: 'idpep', as: 'pep' });
};

export default initModels;
