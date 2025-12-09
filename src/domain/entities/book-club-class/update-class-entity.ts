import AssociatedBCCEntity from './book-club-class';

export type UpdateBCClassEntity = Omit<
  AssociatedBCCEntity,
  'idclass' | 'idvol' | 'place'
>;
