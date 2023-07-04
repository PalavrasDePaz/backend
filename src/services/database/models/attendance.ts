import { DataTypes, Model, Sequelize } from 'sequelize';

export class Attendance extends Model {
  idpres!: number;
  idvol!: number;
  tema!: string;
  suff!: string;
  aproveita!: string;
  melhor?: string;
  adquiridos?: string;
  diferente?: string;
  desafio?: string;
  expressões?: string;
  createdAt!: Date;

  public static initialize(sequelize: Sequelize) {
    this.init(
      {
        idpres: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true
        },
        idvol: {
          type: DataTypes.INTEGER,
          allowNull: false
        },
        tema: {
          type: DataTypes.STRING,
          allowNull: false
        },
        suff: {
          type: DataTypes.STRING,
          allowNull: false
        },
        aproveita: {
          type: DataTypes.STRING,
          allowNull: false
        },
        melhor: {
          type: DataTypes.TEXT,
          allowNull: true
        },
        adquiridos: {
          type: DataTypes.TEXT,
          allowNull: true
        },
        diferente: {
          type: DataTypes.TEXT,
          allowNull: true
        },
        desafio: {
          type: DataTypes.TEXT,
          allowNull: true
        },
        expressões: {
          type: DataTypes.TEXT,
          allowNull: true
        },
        createdAt: {
          type: DataTypes.DATE,
          field: 'Submission Date',
          allowNull: false
        }
      },
      {
        sequelize,
        timestamps: true,
        updatedAt: false,
        tableName: 'Presenca'
      }
    );
  }
}
