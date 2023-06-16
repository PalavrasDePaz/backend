import { Pep } from './models/class';
import { Notebooks } from './models/notebooks';
import { Volunteer } from './models/volunteer';
import sequelize from './sequelize';

const initModels = () => {
  Volunteer.initialize(sequelize);
  Notebooks.initialize(sequelize);
  Pep.initialize(sequelize);

  Pep.hasMany(Notebooks, { foreignKey: 'idpep' });
  Notebooks.belongsTo(Pep);
};

export default initModels;
