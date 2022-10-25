import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
  Sequelize
} from 'sequelize';

export class Volunteer extends Model<
  InferAttributes<Volunteer>,
  InferCreationAttributes<Volunteer>
> {
  id!: CreationOptional<number>;
  name?: string;
  email!: string;

  public static initialize(sequelize: Sequelize) {
    this.init(
      {
        id: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true
        },
        name: {
          type: DataTypes.STRING,
          allowNull: true
        },
        email: {
          type: DataTypes.STRING,
          allowNull: false
        }
      },
      {
        sequelize
      }
    );
  }
}
