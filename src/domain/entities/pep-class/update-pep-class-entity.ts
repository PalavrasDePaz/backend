import { PepClassEntity } from './pep-class-entity';

export type UpdatePepClassEntity = Omit<PepClassEntity, 'id' | 'placeId'>;
