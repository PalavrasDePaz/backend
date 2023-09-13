import {
  Association,
  BelongsToGetAssociationMixin,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
  Sequelize
} from 'sequelize';
import { Pep } from './class';
import { Volunteer } from './volunteer';

export class Notebook extends Model<
  InferAttributes<Notebook>,
  InferCreationAttributes<Notebook>
> {
  idcad!: number;
  idvol!: number;
  'nome do(a) aluno(a)'!: string;
  'número de matrícula do(a) aluno(a)'?: string;
  'unidade prisional do(a) aluno(a)'?: string;
  'tema 1'?: string;
  'tema 2'?: string;
  'tema 3'?: string;
  'tema 4'?: string;
  'tema 5'?: string;
  'tema 6'?: string;
  'tema 7'?: string;
  'tema 8'?: string;
  'tema 9'?: string;
  'tema 10'?: string;
  'conteúdos relevantes'?: string;
  a1?: string;
  a2?: string;
  a3?: string;
  a4?: string;
  a5?: string;
  a6?: string;
  a7?: string;
  a8?: string;
  a9?: string;
  a10?: string;
  a11?: string;
  a12?: string;
  a13?: string;
  'conclusão do avaliador'!: string;
  'exclusão de arquivos recebidos'?: string;
  'Carimbo de data/hora'?: Date | null;
  idpep?: number;
  datareserva?: Date | null;
  aprovado?: string;
  pep?: Pep;
  volunteer?: Volunteer;

  public static associations: {
    pep: Association<Notebook, Pep>;
    volunteer: Association<Notebook, Volunteer>;
  };

  public getPeps!: BelongsToGetAssociationMixin<Pep>;
  public getVolunteers!: BelongsToGetAssociationMixin<Volunteer>;

  public static initialize(sequelize: Sequelize) {
    this.init(
      {
        idcad: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true
        },
        idvol: {
          type: DataTypes.INTEGER,
          allowNull: false
        },
        'nome do(a) aluno(a)': {
          type: DataTypes.STRING,
          allowNull: false
        },
        'número de matrícula do(a) aluno(a)': {
          type: DataTypes.STRING,
          allowNull: true
        },
        'unidade prisional do(a) aluno(a)': {
          type: DataTypes.STRING,
          allowNull: true
        },
        'tema 1': {
          type: DataTypes.STRING,
          allowNull: true
        },
        'tema 2': {
          type: DataTypes.STRING,
          allowNull: true
        },
        'tema 3': {
          type: DataTypes.STRING,
          allowNull: true
        },
        'tema 4': {
          type: DataTypes.STRING,
          allowNull: true
        },
        'tema 5': {
          type: DataTypes.STRING,
          allowNull: true
        },
        'tema 6': {
          type: DataTypes.STRING,
          allowNull: true
        },
        'tema 7': {
          type: DataTypes.STRING,
          allowNull: true
        },
        'tema 8': {
          type: DataTypes.STRING,
          allowNull: true
        },
        'tema 9': {
          type: DataTypes.STRING,
          allowNull: true
        },
        'tema 10': {
          type: DataTypes.STRING,
          allowNull: true
        },
        'conteúdos relevantes': {
          type: DataTypes.STRING,
          allowNull: true
        },
        a1: {
          type: DataTypes.STRING,
          allowNull: true
        },
        a2: {
          type: DataTypes.STRING,
          allowNull: true
        },
        a3: {
          type: DataTypes.STRING,
          allowNull: true
        },
        a4: {
          type: DataTypes.STRING,
          allowNull: true
        },
        a5: {
          type: DataTypes.STRING,
          allowNull: true
        },
        a6: {
          type: DataTypes.STRING,
          allowNull: true
        },
        a7: {
          type: DataTypes.STRING,
          allowNull: true
        },
        a8: {
          type: DataTypes.STRING,
          allowNull: true
        },
        a9: {
          type: DataTypes.STRING,
          allowNull: true
        },
        a10: {
          type: DataTypes.STRING,
          allowNull: true
        },
        a11: {
          type: DataTypes.STRING,
          allowNull: true
        },
        a12: {
          type: DataTypes.STRING,
          allowNull: true
        },
        a13: {
          type: DataTypes.STRING,
          allowNull: true
        },
        'conclusão do avaliador': {
          type: DataTypes.STRING,
          allowNull: false
        },
        'exclusão de arquivos recebidos': {
          type: DataTypes.STRING,
          allowNull: true
        },
        'Carimbo de data/hora': {
          type: DataTypes.DATE,
          allowNull: true
        },
        aprovado: {
          type: DataTypes.STRING,
          allowNull: true
        },
        idpep: {
          type: DataTypes.INTEGER,
          allowNull: true
        },
        datareserva: {
          type: DataTypes.DATE,
          allowNull: true
        }
      },
      {
        sequelize,
        timestamps: false,
        tableName: 'Cadernos'
      }
    );
  }
}
