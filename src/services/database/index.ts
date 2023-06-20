import { BookClubClass } from './models/book-club-class';
import { Notebooks } from './models/notebooks';
import { Volunteer } from './models/volunteer';
import sequelize from './sequelize';

const initModels = () => {
  Volunteer.initialize(sequelize);
  Notebooks.initialize(sequelize);
  BookClubClass.initialize(sequelize);
};

export default initModels;
