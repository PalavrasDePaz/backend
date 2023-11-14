import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
  Sequelize
} from 'sequelize';

export class VolunteerHours extends Model<
  InferAttributes<VolunteerHours>,
  InferCreationAttributes<VolunteerHours>
> {
  idHour!: number;
  idVol!: number;
  manag!: number;
  comm!: number;
  tec!: number;
  event!: number;
  att!: number;
  createdAt!: CreationOptional<Date>;

  public static initialize(sequelize: Sequelize) {
    this.init(
      {
        idHour: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true
        },
        idVol: {
          type: DataTypes.NUMBER,
          allowNull: false
        },
        manag: { type: DataTypes.NUMBER, allowNull: false },
        comm: { type: DataTypes.NUMBER, allowNull: false },
        tec: { type: DataTypes.NUMBER, allowNull: false },
        event: { type: DataTypes.NUMBER, allowNull: false },
        att: { type: DataTypes.NUMBER, allowNull: false },
        createdAt: {
          type: DataTypes.DATE,
          field: 'Submission Date'
        }
      },
      {
        sequelize,
        timestamps: true,
        updatedAt: false,
        tableName: 'Hours'
      }
    );
  }
}
