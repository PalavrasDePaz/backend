import { DataTypes, Model, Sequelize } from 'sequelize';

export class BookClubClass extends Model {
  idturma!: number;
  place!: number;
  datarecebrelatorio!: Date;
  emprestimo?: Date;
  devolucao?: Date;
  dataelabrelatorio?: Date;
  recebido?: string;
  simlista?: string;
  listapresenca?: number;
  qrl!: number;
  datainvioparec?: Date;
  pressedex?: string;
  datainviofunap?: Date;
  pressedex2?: string;
  datafimaval?: Date;
  parec?: string;
  idvol?: number;
  linkpasta?: string;

  public static initialize(sequelize: Sequelize) {
    this.init(
      {
        idturma: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true
        },
        place: {
          type: DataTypes.INTEGER,
          allowNull: false
        },
        datarecebrelatorio: {
          type: DataTypes.DATE,
          allowNull: false
        },
        emprestimo: {
          type: DataTypes.DATE,
          allowNull: true
        },
        devolucao: {
          type: DataTypes.DATE,
          allowNull: true
        },
        dataelabrelatorio: {
          type: DataTypes.DATE,
          allowNull: true
        },
        recebido: {
          type: DataTypes.STRING,
          allowNull: true
        },
        simlista: {
          type: DataTypes.STRING,
          allowNull: true
        },
        listapresenca: {
          type: DataTypes.INTEGER,
          allowNull: true
        },
        qrl: {
          type: DataTypes.INTEGER,
          allowNull: false
        },
        datainvioparec: {
          type: DataTypes.DATE,
          allowNull: true
        },
        pressedex: {
          type: DataTypes.STRING,
          allowNull: true
        },
        datainviofunap: {
          type: DataTypes.DATE,
          allowNull: true
        },
        pressedex2: {
          type: DataTypes.STRING,
          allowNull: true
        },
        datafimaval: {
          type: DataTypes.DATE,
          allowNull: true
        },
        parec: {
          type: DataTypes.STRING,
          allowNull: true
        },
        idvol: {
          type: DataTypes.INTEGER,
          allowNull: true
        },
        linkpasta: {
          type: DataTypes.STRING,
          allowNull: true
        }
      },
      {
        sequelize,
        timestamps: false,
        tableName: 'TurmasClubeLivro'
      }
    );
  }
}
