import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
  Sequelize
} from 'sequelize';

export class Volunteer extends Model<
  InferAttributes<Volunteer>,
  InferCreationAttributes<Volunteer>
> {
  idvol!: CreationOptional<number>;
  idpep?: number;
  nome!: string;
  cert?: boolean;
  'habil-leitura'?: boolean;
  'habil-livro'?: boolean;
  author?: string;
  'e-mail'!: string;
  senha!: string;
  nascimento!: Date;
  telefone!: string;
  'país': string;
  estado!: string;
  cidade!: string;
  etnia!: string;
  defic!: string;
  qual?: string;
  genero!: string;
  sexo?: string;
  'nome social'?: string;
  ondesoube!: string;
  'conhecimento pep'!: string;
  workshops!: string;
  escolaridade!: string;
  curso1?: string;
  curso2?: string;
  estudos!: string;
  'experiências'!: string;
  sonhos!: string;
  oportunidades!: string;
  tempo!: number;
  dia!: string;
  ajudar?: string;
  contribuir!: string;
  'declaração'!: string;
  createdAt?: Date;

  public static initialize(sequelize: Sequelize) {
    this.init(
      {
        idvol: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true
        },
        idpep: {
          type: DataTypes.INTEGER,
          allowNull: true
        },
        nome: {
          type: DataTypes.STRING,
          allowNull: false
        },
        'e-mail': {
          type: DataTypes.STRING,
          allowNull: false,
          unique: true,
          validate: { isEmail: true }
        },
        senha: {
          type: DataTypes.STRING,
          allowNull: false
        },
        cert: {
          type: DataTypes.BOOLEAN,
          allowNull: true
        },
        'habil-leitura': {
          type: DataTypes.BOOLEAN,
          allowNull: true
        },
        'habil-livro': {
          type: DataTypes.BOOLEAN,
          allowNull: true
        },
        author: {
          type: DataTypes.STRING,
          allowNull: true
        },
        qual: {
          type: DataTypes.STRING,
          allowNull: true
        },
        sexo: {
          type: DataTypes.STRING,
          allowNull: true
        },
        'nome social': {
          type: DataTypes.STRING,
          allowNull: true
        },
        curso1: {
          type: DataTypes.STRING,
          allowNull: true
        },
        curso2: {
          type: DataTypes.STRING,
          allowNull: true
        },
        nascimento: {
          type: DataTypes.DATE,
          allowNull: false
        },
        telefone: {
          type: DataTypes.STRING,
          allowNull: false
        },
        país: {
          type: DataTypes.STRING,
          allowNull: false
        },
        estado: {
          type: DataTypes.STRING,
          allowNull: false
        },
        cidade: {
          type: DataTypes.STRING,
          allowNull: false
        },
        etnia: {
          type: DataTypes.STRING,
          allowNull: false
        },
        defic: {
          type: DataTypes.STRING,
          allowNull: false
        },
        genero: {
          type: DataTypes.STRING,
          allowNull: false
        },
        ondesoube: {
          type: DataTypes.STRING,
          allowNull: false
        },
        'conhecimento pep': {
          type: DataTypes.STRING,
          allowNull: false
        },
        workshops: {
          type: DataTypes.STRING,
          allowNull: false
        },
        escolaridade: {
          type: DataTypes.STRING,
          allowNull: false
        },
        estudos: {
          type: DataTypes.STRING,
          allowNull: false
        },
        experiências: {
          type: DataTypes.STRING,
          allowNull: false
        },
        sonhos: {
          type: DataTypes.STRING,
          allowNull: false
        },
        oportunidades: {
          type: DataTypes.STRING,
          allowNull: false
        },
        tempo: {
          type: DataTypes.STRING,
          allowNull: false
        },
        dia: {
          type: DataTypes.STRING,
          allowNull: false
        },
        ajudar: {
          type: DataTypes.STRING,
          allowNull: true
        },
        contribuir: {
          type: DataTypes.STRING,
          allowNull: false
        },
        declaração: {
          type: DataTypes.STRING,
          allowNull: false
        },
        createdAt: {
          type: DataTypes.DATE,
          field: 'Submission Date'
        }
      },
      {
        sequelize,
        timestamps: true,
        updatedAt: false
      }
    );
  }
}
