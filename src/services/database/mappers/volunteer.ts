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

export const volunteerModelToEntity = (
  volunteer: Volunteer
): VolunteerEntity => {
  return {
    email: volunteer['e-mail'],
    idvol: volunteer.idvol,
    name: volunteer.nome,
    pep: volunteer.idpep,
    birthDate: volunteer.nascimento,
    phoneNumber: volunteer.telefone,
    country: volunteer.país,
    state: volunteer.estado,
    city: volunteer.cidade,
    disability: volunteer.defic == 'SIM' ? volunteer.qual : undefined,
    howFoundPep: volunteer.ondesoube,
    knowledgePep: volunteer['conhecimento pep'],
    schooling: volunteer.escolaridade,
    bachelor: volunteer.curso1,
    studiesKnowledge: volunteer.estudos,
    lifeExperience: volunteer.experiências,
    desires: volunteer.sonhos,
    rolesPep: volunteer.oportunidades?.split(' ') ?? [''],
    interestFutureRoles: volunteer.ajudar ? volunteer.ajudar.split(' ') : [],
    needDeclaration: volunteer.declaração == 'SIM',
    createdAt: volunteer.createdAt
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
    pep: volunteer.idpep,
    authorPermission: volunteer.author,
    certificationPermission: volunteer.cert,
    readPermission: volunteer['habil-leitura'],
    bookPermission: volunteer['habil-livro'],
    birthDate: volunteer.nascimento,
    phoneNumber: volunteer.telefone,
    country: volunteer.país,
    state: volunteer.estado,
    city: volunteer.cidade,
    disability: volunteer.defic == 'SIM' ? volunteer.qual : undefined,
    howFoundPep: volunteer.ondesoube,
    knowledgePep: volunteer['conhecimento pep'],
    schooling: volunteer.escolaridade,
    bachelor: volunteer.curso1,
    studiesKnowledge: volunteer.estudos,
    lifeExperience: volunteer.experiências,
    desires: volunteer.sonhos,
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
    idpep: 0,
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
