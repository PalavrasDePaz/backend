import {
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
  submissionDate!: Date;
  idVol!: number;
  manag!: number;
  comm!: number;
  tec!: number;
  event!: number;
  att!: number;

  public static initialize(sequelize: Sequelize) {
    this.init(
      {
        submissionDate: {
          type: DataTypes.DATE,
          allowNull: false
        },
        idVol: {
          type: DataTypes.NUMBER,
          allowNull: false
        },
        manag: { type: DataTypes.NUMBER, allowNull: false },
        comm: { type: DataTypes.NUMBER, allowNull: false },
        tec: { type: DataTypes.NUMBER, allowNull: false },
        event: { type: DataTypes.NUMBER, allowNull: false },
        att: { type: DataTypes.NUMBER, allowNull: false }
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
