import {
  Association,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
  Sequelize
} from 'sequelize';
import { Pep } from './class';

export class Place extends Model<
  InferAttributes<Place>,
  InferCreationAttributes<Place>
> {
  id!: number;
  fullName!: string;
  coord?: string;
  mode?: string;
  addr?: string;
  sex!: string;
  closed!: number;

  public static associations: {
    pep: Association<Place, Pep>;
  };

  public static initialize(sequelize: Sequelize) {
    this.init(
      {
        id: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true
        },
        fullName: {
          type: DataTypes.STRING,
          allowNull: false
        },
        coord: {
          type: DataTypes.STRING,
          allowNull: true
        },
        mode: {
          type: DataTypes.STRING,
          allowNull: true
        },
        addr: {
          type: DataTypes.STRING,
          allowNull: true
        },
        sex: {
          type: DataTypes.STRING,
          allowNull: false
        },
        closed: {
          type: DataTypes.BOOLEAN,
          allowNull: false
        }
      },
      {
        sequelize,
        timestamps: false,
        tableName: 'Place'
      }
    );
  }
}
