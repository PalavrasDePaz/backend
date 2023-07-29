import {
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
  Sequelize
} from 'sequelize';

export class Authorization extends Model<
  InferAttributes<Authorization>,
  InferCreationAttributes<Authorization>
> {
  name!: string;
  'mod presenca'!: boolean;
  'mod ger vol'!: boolean;
  'mod det vol'!: boolean;
  'mod bo redacao'!: boolean;
  'mod bo cadernos': boolean;

  public static initialize(sequelize: Sequelize) {
    this.init(
      {
        name: {
          type: DataTypes.STRING,
          primaryKey: true,
          allowNull: false
        },
        'mod presenca': {
          type: DataTypes.BOOLEAN,
          allowNull: false
        },
        'mod ger vol': {
          type: DataTypes.BOOLEAN,
          allowNull: false
        },
        'mod det vol': {
          type: DataTypes.BOOLEAN,
          allowNull: false
        },
        'mod bo cadernos': {
          type: DataTypes.BOOLEAN,
          allowNull: false
        },
        'mod bo redacao': {
          type: DataTypes.BOOLEAN,
          allowNull: false
        }
      },
      {
        sequelize,
        timestamps: false,
        tableName: 'Authorization'
      }
    );
  }
}
