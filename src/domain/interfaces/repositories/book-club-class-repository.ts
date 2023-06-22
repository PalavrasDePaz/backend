export interface BookClubClassRepository {
  countEvaluatedBookClubClassByIdVol(idvol: number): Promise<{ count: number }>;
}
