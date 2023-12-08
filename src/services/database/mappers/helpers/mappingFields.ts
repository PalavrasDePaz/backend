import { UpdateVolunteerEntity } from '@src/domain/entities/volunteer/update-volunteer-entity';

export const updateVolunteerMapperKeys: Partial<
  Record<keyof UpdateVolunteerEntity, string>
> = {
  name: 'nome',
  birthDate: 'nascimento',
  phoneNumber: 'telefone',
  country: 'país',
  state: 'estado',
  city: 'cidade',
  disability: 'qual',
  howFoundPep: 'ondesoube',
  knowledgePep: 'conhecimento pep',
  schooling: 'escolaridade',
  bachelor: 'curso1',
  studiesKnowledge: 'estudos',
  lifeExperience: 'experiências',
  desires: 'sonhos',
  rolesPep: 'oportunidades',
  interestFutureRoles: 'ajudar',
  needDeclaration: 'declaração',
  password: 'senha',
  email: 'e-mail'
} as const;
