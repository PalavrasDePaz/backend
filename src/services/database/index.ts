import { Volunteer } from './models/volunteer';
import sequelize from './sequelize';

const initModels = () => {
  Volunteer.initialize(sequelize);
};

export default initModels;
