import { Volunteer } from './models/volunteer';
import sequelize from './sequelize';

export default function initModels() {
  Volunteer.initialize(sequelize);
}
