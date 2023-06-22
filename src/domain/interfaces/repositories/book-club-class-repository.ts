export interface BookClubClassRepository {
  getBookClubClassById(idvol: number): Promise<{ count: number }>;
}
