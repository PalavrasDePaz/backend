import { Model } from 'sequelize';

type UpdateModel<T extends Model> = {
  [key in keyof T]?: T[key];
};

export default UpdateModel;
