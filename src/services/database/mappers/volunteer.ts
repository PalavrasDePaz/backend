import { VolunteerEntity } from '@src/domain/entities/volunteer/volunteer-entity';
import { Volunteer } from '../models/volunteer';
import { CreationAttributes } from 'sequelize';
import { VolunteerWithAuthEntity } from '@src/domain/entities/volunteer/volunteer-with-auth-entity';
import { UpdateVolunteerEntity } from '@src/domain/entities/volunteer/update-volunteer-entity';
import { hashString } from '@src/helpers/message-hashing';
import { CreateVolunteerEntity } from '@src/domain/entities/volunteer/create-volunteer-entity';
import UpdateModel from './helpers/update-model-type';
import { Entries } from '@src/common/types';
import { updateVolunteerMapperKeys } from './helpers/mappingFields';
import { VolunteerDownloadEntity } from '@src/domain/entities/volunteer/volunteer-download-entity';

export const volunteerModelToEntity = (
  volunteer: Volunteer
): VolunteerEntity => {
  return {
    email: volunteer['e-mail'],
    idvol: volunteer.idvol,
    name: volunteer.nome,
    pep: volunteer.idpep ?? 0,
    birthDate: volunteer.nascimento,
    phoneNumber: volunteer.telefone,
    country: volunteer.país,
    state: volunteer.estado,
    city: volunteer.cidade,
    isDisability: volunteer.defic,
    disability: volunteer.defic == 'SIM' ? volunteer.qual : undefined,
    howFoundPep: volunteer.ondesoube,
    knowledgePep: volunteer['conhecimento pep'],
    schooling: volunteer.escolaridade,
    bachelor: volunteer.curso1,
    studiesKnowledge: volunteer.estudos,
    courseOne: volunteer.curso1,
    courseTwo: volunteer.curso2,
    lifeExperience: volunteer.experiências,
    desires: volunteer.sonhos,
    opportunities: volunteer.oportunidades,
    rolesPep: volunteer.oportunidades?.split(' ') ?? [''],
    interestFutureRoles: volunteer.ajudar ? volunteer.ajudar.split(' ') : [],
    needDeclaration: volunteer.declaração == 'SIM',
    createdAt: volunteer.createdAt,
    notebookPermission: volunteer['habil-leitura'],
    bookclubPermission: volunteer['habil-livro'],
    certificate: volunteer.cert,
    authorization: volunteer.author
  };
};

export const volunteerModelToAuthEntity = (
  volunteer: Volunteer
): VolunteerWithAuthEntity => {
  return {
    email: volunteer['e-mail'],
    idvol: volunteer.idvol,
    name: volunteer.nome,
    password: volunteer.senha,
    pep: volunteer.idpep ?? 0,
    authorPermission: volunteer.author,
    certificationPermission: volunteer.cert,
    readPermission: volunteer['habil-leitura'],
    bookPermission: volunteer['habil-livro'],
    birthDate: volunteer.nascimento,
    phoneNumber: volunteer.telefone,
    country: volunteer.país,
    state: volunteer.estado,
    city: volunteer.cidade,
    isDisability: volunteer.defic,
    disability: volunteer.defic == 'SIM' ? volunteer.qual : undefined,
    howFoundPep: volunteer.ondesoube,
    knowledgePep: volunteer['conhecimento pep'],
    schooling: volunteer.escolaridade,
    bachelor: volunteer.curso1,
    studiesKnowledge: volunteer.estudos,
    lifeExperience: volunteer.experiências,
    desires: volunteer.sonhos,
    opportunities: volunteer.oportunidades,
    rolesPep: volunteer.oportunidades?.split(' ') ?? [''],
    interestFutureRoles: volunteer.ajudar ? volunteer.ajudar.split(' ') : [],
    needDeclaration: volunteer.declaração == 'SIM',
    createdAt: volunteer.createdAt
  };
};

export const createVolunteerEntityToCreationModel = (
  volunteer: CreateVolunteerEntity
): CreationAttributes<Volunteer> => {
  return {
    nome: volunteer.name,
    'e-mail': volunteer.email,
    senha: hashString(volunteer.password),
    idpep: volunteer.pep ?? 0,
    nascimento: volunteer.birthDate,
    telefone: volunteer.phoneNumber,
    author: volunteer.authorPermission,
    'habil-leitura': volunteer.readPermission,
    'habil-livro': volunteer.bookPermission,
    cert: volunteer.certificationPermission,
    país: volunteer.country,
    estado: volunteer.state,
    cidade: volunteer.city,
    defic: volunteer.disability ? 'SIM' : 'NÃO',
    qual: volunteer.disability,
    ondesoube: volunteer.howFoundPep,
    'conhecimento pep': volunteer.knowledgePep,
    escolaridade: volunteer.schooling,
    curso1: volunteer.bachelor,
    estudos: volunteer.studiesKnowledge,
    experiências: volunteer.lifeExperience,
    sonhos: volunteer.desires,
    oportunidades: volunteer.rolesPep.join(' '),
    ajudar: volunteer.interestFutureRoles.join(' '),
    declaração: volunteer.needDeclaration ? 'SIM' : 'NÃO'
  };
};

export const updateVolunteerEntityToUpdateModel = (
  volunteer: UpdateVolunteerEntity
): UpdateModel<Volunteer> => {
  return (
    Object.entries(volunteer) as Entries<Required<typeof volunteer>>
  ).reduce((mapped, [crrKey, value]) => {
    if (crrKey === 'disability') {
      return {
        ...mapped,
        defic: value ? 'SIM' : 'NÃO',
        qual: value
      };
    }

    if (crrKey === 'needDeclaration') {
      return {
        ...mapped,
        declaração: volunteer.needDeclaration ? 'SIM' : 'NÃO'
      };
    }

    if (crrKey === 'password' && volunteer.password) {
      return {
        ...mapped,
        senha: hashString(volunteer.password)
      };
    }

    if (Array.isArray(value)) {
      return {
        ...mapped,
        [updateVolunteerMapperKeys[crrKey]]: value.join(' ')
      };
    }

    return { ...mapped, [updateVolunteerMapperKeys[crrKey]]: value };
  }, {});
};

export const volunteerDownloadMappers = (
  volunteer: Volunteer
): VolunteerDownloadEntity => ({
  'Data de Submissão': volunteer.createdAt,
  'ID Voluntário': volunteer.idvol,
  Nome: volunteer.nome,
  'Data de Nascimento': volunteer.nascimento,
  'E-mail': volunteer['e-mail'],
  Telefone: volunteer.telefone,
  País: volunteer.país,
  Estado: volunteer.estado,
  Cidade: volunteer.cidade,
  PcD: volunteer.defic,
  'PcD(Qual)': volunteer.qual ?? '',
  'Como nos achou ?': volunteer.ondesoube,
  'Experiencia em workshops': volunteer['conhecimento pep'],
  Escolaridade: volunteer.escolaridade,
  Curso1: volunteer.curso1 ?? '',
  Curso2: volunteer.curso2 ?? '',
  Conhecimentos: volunteer.estudos,
  'Experiencia de vida': volunteer.experiências,
  Desejos: volunteer.sonhos,
  Oportunidades: volunteer.oportunidades,
  'Interesse em Posições Futuras': volunteer.ajudar ?? '',
  Declaração: volunteer.declaração,
  'Permissão de Avaliação de Cadernos':
    typeof volunteer['habil-leitura'] === 'boolean'
      ? volunteer['habil-leitura']
      : '',
  'Permissão de Avaliação de Redações':
    typeof volunteer['habil-livro'] === 'boolean'
      ? volunteer['habil-livro']
      : '',
  certificado: typeof volunteer.cert === 'boolean' ? volunteer.cert : '',
  autorização: volunteer.author ?? ''
});
