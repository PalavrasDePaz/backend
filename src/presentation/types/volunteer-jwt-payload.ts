import { VolunteerAuthDataEntity } from '@src/domain/entities/volunteer-auth-entity';

export type VolunteerJWTPayload = Omit<VolunteerAuthDataEntity, 'password'>;
