import AvailableEssayRowEntity from '@src/domain/entities/book-club-class/available-essay-row-entity';

export interface BookClubClassRepository {
  countEvaluatedBookClubClassByIdVol(idvol: number): Promise<{ count: number }>;

  getAvailableEssays(): Promise<AvailableEssayRowEntity[]>;

  getReservedEssaysByIdVol(idvol: number): Promise<AvailableEssayRowEntity[]>;
}
