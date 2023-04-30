import { VolunteerEntity } from '@src/domain/entities/volunteer-entity';
import { Volunteer } from '../models/volunteer';
import { CreationAttributes } from 'sequelize';
import { hashPassword } from '@src/helpers/password_hashing';
import { VolunteerWithAuthEntity } from '@src/domain/entities/volunteer-with-auth-entity';
import { UpdateVolunteerEntity } from '@src/domain/entities/update-volunteer-entity';

export const volunteerModelToEntity = (
  volunteer: Volunteer
): VolunteerEntity => {
  return {
    email: volunteer['e-mail'],
    name: volunteer.nome,
    pep: volunteer.idpep,
    birthDate: volunteer.nascimento,
    phoneNumber: volunteer.telefone,
    country: volunteer.país,
    state: volunteer.estado,
    city: volunteer.cidade,
    ethnicity: volunteer.etnia,
    disability: volunteer.defic == 'SIM' ? volunteer.qual : undefined,
    gender: volunteer.genero,
    sex: volunteer.sexo,
    socialName: volunteer['nome social'],
    howFoundPep: volunteer.ondesoube,
    knowledgePep: volunteer['conhecimento pep'],
    workshops: volunteer.workshops.split(' '),
    schooling: volunteer.escolaridade,
    bachelor: volunteer.curso1,
    studiesKnowlegde: volunteer.estudos,
    lifeExperience: volunteer.experiências,
    desires: volunteer.sonhos,
    rolesPep: volunteer.oportunidades.split(' '),
    weekAvailability: volunteer.tempo,
    meetingAvailability: volunteer.dia,
    interestFutureRoles: volunteer.ajudar
      ? volunteer.ajudar.split(' ')
      : undefined,
    contribution: volunteer.contribuir,
    needDeclaration: volunteer.declaração == 'SIM'
  };
};

export const volunteerModelToAuthEntity = (
  volunteer: Volunteer
): VolunteerWithAuthEntity => {
  return {
    email: volunteer['e-mail'],
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
    ethnicity: volunteer.etnia,
    disability: volunteer.defic == 'SIM' ? volunteer.qual : undefined,
    gender: volunteer.genero,
    sex: volunteer.sexo,
    socialName: volunteer['nome social'],
    howFoundPep: volunteer.ondesoube,
    knowledgePep: volunteer['conhecimento pep'],
    workshops: volunteer.workshops.split(' '),
    schooling: volunteer.escolaridade,
    bachelor: volunteer.curso1,
    studiesKnowlegde: volunteer.estudos,
    lifeExperience: volunteer.experiências,
    desires: volunteer.sonhos,
    rolesPep: volunteer.oportunidades.split(' '),
    weekAvailability: volunteer.tempo,
    meetingAvailability: volunteer.dia,
    interestFutureRoles: volunteer.ajudar
      ? volunteer.ajudar.split(' ')
      : undefined,
    contribution: volunteer.contribuir,
    needDeclaration: volunteer.declaração == 'SIM'
  };
};

export const volunteerWithAuthEntityToCreationModel = (
  volunteer: VolunteerWithAuthEntity
): CreationAttributes<Volunteer> => {
  return {
    nome: volunteer.name,
    'e-mail': volunteer.email,
    senha: hashPassword(volunteer.password),
    nascimento: volunteer.birthDate,
    telefone: volunteer.phoneNumber,
    author: volunteer.authorPermission,
    'habil-leitura': volunteer.readPermission,
    'habil-livro': volunteer.bookPermission,
    cert: volunteer.certificationPermission,
    país: volunteer.country,
    estado: volunteer.state,
    cidade: volunteer.city,
    etnia: volunteer.ethnicity,
    defic: volunteer.disability ? 'SIM' : 'NÃO',
    qual: volunteer.disability,
    genero: volunteer.gender,
    sexo: volunteer.sex,
    'nome social': volunteer.socialName,
    ondesoube: volunteer.howFoundPep,
    'conhecimento pep': volunteer.knowledgePep,
    workshops: volunteer.workshops.join(' '),
    escolaridade: volunteer.schooling,
    curso1: volunteer.bachelor,
    estudos: volunteer.studiesKnowlegde,
    experiências: volunteer.lifeExperience,
    sonhos: volunteer.desires,
    oportunidades: volunteer.rolesPep.join(' '),
    tempo: volunteer.weekAvailability,
    dia: volunteer.meetingAvailability,
    ajudar: volunteer.interestFutureRoles?.join(' '),
    contribuir: volunteer.contribution,
    declaração: volunteer.needDeclaration ? 'SIM' : 'NÃO'
  };
};

type updateVolunteerModel = {
  [key in keyof Volunteer]?: Volunteer[key];
};

export const updateVolunteerEntityToUpdateModel = (
  volunteer: UpdateVolunteerEntity
): updateVolunteerModel => {
  return {
    nome: volunteer.name,
    nascimento: volunteer.birthDate,
    telefone: volunteer.phoneNumber,
    país: volunteer.country,
    estado: volunteer.state,
    cidade: volunteer.city,
    etnia: volunteer.ethnicity,
    defic: volunteer.disability ? 'SIM' : 'NÃO',
    qual: volunteer.disability,
    genero: volunteer.gender,
    sexo: volunteer.sex,
    'nome social': volunteer.socialName,
    ondesoube: volunteer.howFoundPep,
    'conhecimento pep': volunteer.knowledgePep,
    workshops: volunteer.workshops.join(' '),
    escolaridade: volunteer.schooling,
    curso1: volunteer.bachelor,
    estudos: volunteer.studiesKnowlegde,
    experiências: volunteer.lifeExperience,
    sonhos: volunteer.desires,
    oportunidades: volunteer.rolesPep.join(' '),
    tempo: volunteer.weekAvailability,
    dia: volunteer.meetingAvailability,
    ajudar: volunteer.interestFutureRoles?.join(' '),
    contribuir: volunteer.contribution,
    declaração: volunteer.needDeclaration ? 'SIM' : 'NÃO'
  };
};