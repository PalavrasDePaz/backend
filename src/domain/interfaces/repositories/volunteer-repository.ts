import { UpdateVolunteerEntity } from '@src/domain/entities/volunteer/update-volunteer-entity';
import { VolunteerEntity } from '@src/domain/entities/volunteer/volunteer-entity';
import { VolunteerWithAuthEntity } from '@src/domain/entities/volunteer/volunteer-with-auth-entity';
import { CreateVolunteerEntity } from '@src/domain/entities/volunteer/create-volunteer-entity';
import { PermissionEntity } from '@src/domain/entities/volunteer/permission-entity';
import { VolunteerDownloadEntity } from '@src/domain/entities/volunteer/volunteer-download-entity';
import { PaginationParams } from '@src/presentation/types/paginationParams';
import { PaginationResult } from '@src/services/repositories/helpers/wrapPagination';
import { VolunteerHoursEntity } from '@src/domain/entities/volunteer/volunteer-hours-entity';
import { PostVolunteerHoursEntity } from '@src/domain/entities/volunteer/post-volunteer-hours-entity';

export interface VolunteerRepository {
  updateVolunteer(
    volunteer: UpdateVolunteerEntity,
    email: string,
    hasClass: boolean
  ): Promise<VolunteerEntity | null>;

  getVolunteersFromDate(
    pagination: PaginationParams,
    date: Date
  ): Promise<PaginationResult<VolunteerEntity[]>>;

  getVolunteersDownloadFromDate(date: Date): Promise<VolunteerDownloadEntity[]>;

  getVolunteerByEmail(email: string): Promise<VolunteerEntity | null>;

  getVolunteerById(id: number): Promise<VolunteerEntity | null>;

  getPermissionByAuthName(name: string): Promise<PermissionEntity | null>;

  getVolunteerWithAuthDataByEmail(
    email: string
  ): Promise<VolunteerWithAuthEntity | null>;

  getAllVolunteers(): Promise<VolunteerEntity[]>;

  createVolunteer(volunteer: CreateVolunteerEntity): Promise<VolunteerEntity>;

  deleteVolunteerByEmail(email: string): Promise<boolean>;

  updateOrCreatePasswordForEmail(
    email: string,
    password: string
  ): Promise<boolean>;

  postVolunteerHours(data: PostVolunteerHoursEntity): Promise<void>;
  findHoursByMonth(
    idVol: number,
    month: number,
    year: number
  ): Promise<VolunteerHoursEntity | null>;
}
