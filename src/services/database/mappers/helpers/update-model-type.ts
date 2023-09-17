import { Model } from 'sequelize';

type updateModel<T extends Model> = {
  [key in keyof T]?: T[key];
};

export default updateModel;
