import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
  NonAttribute,
  Sequelize
} from 'sequelize';
import { Place } from './place';
import { BookClubClass } from './book-club-class';

export class BookEvaluation extends Model<
  InferAttributes<BookEvaluation>,
  InferCreationAttributes<BookEvaluation>
> {
  idavLivro!: CreationOptional<number>;
  createdAt!: CreationOptional<Date>;
  idvol!: number;
  nturma!: number;
  matricula!: number;
  leitor!: string;
  estetica?: string;
  dignidade?: string;
  clareza?: string;
  plagio?: string;
  observ?: string;
  conceito?: string;
  opiniao?: string;
  sociedade?: string;
  plagioparcial?: string;
  'relevantes'?: string;
  redacao?: string;
  portug?: string;
  CPF?: string;
  RG?: string;
  escolaridade?: string;
  nascimento?: Date;
  'hist-observ'?: string;
  'hist-relat'?: string;
  'data valid'?: Date;
  bookEvaluations!: NonAttribute<BookClubClass>;
  place!: NonAttribute<Place>;

  public static initialize(sequelize: Sequelize) {
    this.init(
      {
        idavLivro: {
          type: DataTypes.NUMBER,
          primaryKey: true,
          allowNull: false
        },
        createdAt: {
          type: DataTypes.DATE,
          field: 'Carimbo de data/hora'
        },
        idvol: { type: DataTypes.NUMBER, allowNull: false },
        nturma: { type: DataTypes.NUMBER, allowNull: false },
        matricula: { type: DataTypes.NUMBER, allowNull: false },
        leitor: { type: DataTypes.STRING, allowNull: false },
        estetica: { type: DataTypes.STRING },
        dignidade: { type: DataTypes.STRING },
        clareza: { type: DataTypes.STRING },
        plagio: { type: DataTypes.STRING },
        observ: { type: DataTypes.STRING },
        conceito: { type: DataTypes.STRING },
        opiniao: { type: DataTypes.STRING },
        sociedade: { type: DataTypes.STRING },
        plagioparcial: { type: DataTypes.STRING },
        relevantes: { type: DataTypes.STRING },
        redacao: { type: DataTypes.STRING },
        portug: { type: DataTypes.STRING },
        CPF: { type: DataTypes.STRING },
        RG: { type: DataTypes.STRING },
        escolaridade: { type: DataTypes.STRING },
        nascimento: { type: DataTypes.DATE },
        'hist-observ': { type: DataTypes.STRING },
        'hist-relat': { type: DataTypes.STRING },
        'data valid': { type: DataTypes.DATE }
      },
      {
        sequelize,
        timestamps: true,
        updatedAt: false,
        tableName: 'Aval-Livro'
      }
    );
  }
}
