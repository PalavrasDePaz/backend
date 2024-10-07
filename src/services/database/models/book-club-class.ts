import {
  Association,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
  NonAttribute,
  Sequelize
} from 'sequelize';
import { Place } from './place';
import { BookEvaluation } from './book-evaluation';

export class BookClubClass extends Model<
  InferAttributes<BookClubClass>,
  InferCreationAttributes<BookClubClass>
> {
  idturma!: number;
  placeId!: number;
  datarecebrelatorio!: Date;
  emprestimo?: Date;
  devolucao?: Date;
  dataelabrelatorio?: Date;
  recebido?: string;
  simlista?: string;
  listapresenca?: number;
  qrl!: number;
  datainvioparec?: Date | null;
  pressedex?: string;
  datainviofunap?: Date | null;
  pressedex2?: string;
  datafimaval?: Date | null;
  parec?: string;
  idvol?: number | null;
  linkpasta?: string;
  place?: Place;
  bookEvaluations!: NonAttribute<BookEvaluation[]>;

  public static associations: {
    place: Association<BookClubClass, Place>;
    evals: Association<BookClubClass, BookEvaluation>;
  };

  public static initialize(sequelize: Sequelize) {
    this.init(
      {
        idturma: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true
        },
        placeId: {
          type: DataTypes.INTEGER,
          allowNull: false,
          field: 'place'
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
