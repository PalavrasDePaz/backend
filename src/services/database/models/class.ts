import {
  Association,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
  Sequelize
} from 'sequelize';
import { Place } from './place';

export class Pep extends Model<
  InferAttributes<Pep>,
  InferCreationAttributes<Pep>
> {
  id!: number;
  idPlace!: number;
  nGroup?: string;
  'Report Y/N'?: number;
  dayReceived?: Date;
  dayReleased?: Date;
  facil?: string;
  t1?: Date;
  t10?: Date;
  total?: number;
  'total cert'?: number;
  directory?: string;

  public static associations: {
    place: Association<Pep, Place>;
  };

  public static initialize(sequelize: Sequelize) {
    this.init(
      {
        id: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true
        },
        idPlace: {
          type: DataTypes.INTEGER,
          allowNull: false,
          references: {
            model: 'Place',
            key: 'ID'
          }
        },
        nGroup: {
          type: DataTypes.STRING,
          allowNull: true
        },
        'Report Y/N': {
          type: DataTypes.BOOLEAN,
          allowNull: true
        },
        dayReceived: {
          type: DataTypes.DATE,
          allowNull: true
        },
        dayReleased: {
          type: DataTypes.DATE,
          allowNull: true
        },
        facil: {
          type: DataTypes.STRING,
          allowNull: true
        },
        t1: {
          type: DataTypes.DATE,
          allowNull: true
        },
        t10: {
          type: DataTypes.DATE,
          allowNull: true
        },
        total: {
          type: DataTypes.INTEGER,
          allowNull: true
        },
        'total cert': {
          type: DataTypes.INTEGER,
          allowNull: true
        },
        directory: {
          type: DataTypes.STRING,
          allowNull: true
        }
      },
      {
        sequelize,
        timestamps: false,
        tableName: 'Pep'
      }
    );
  }
}
