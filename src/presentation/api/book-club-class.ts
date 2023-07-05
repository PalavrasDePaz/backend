import { validationExample } from '@src/documentation/validation-example';
import AvailableEssayRowEntity from '@src/domain/entities/book-club-class/available-essay-row-entity';
import { ReserveEssayDataEntity } from '@src/domain/entities/book-club-class/reserve-essay-data-entity';
import { BookClubClassError } from '@src/domain/errors/book-club-class';
import { VolunteerError } from '@src/domain/errors/volunteer';
import { BookClubClassRepository } from '@src/domain/interfaces/repositories/book-club-class-repository';
import { VolunteerRepository } from '@src/domain/interfaces/repositories/volunteer-repository';
import { SequelizeBCCRepository } from '@src/services/repositories/sequelize-bcc-repository';
import { SequelizeVolunteerRepository } from '@src/services/repositories/sequelize-volunteer-repository';
import { inject } from 'inversify';
import { provide } from 'inversify-binding-decorators';
import {
  Controller,
  Get,
  Path,
  Route,
  Response,
  Security,
  SuccessResponse,
  Tags,
  FieldErrors,
  Put,
  Body
} from 'tsoa';
import { ApiError } from '../types/api-error';

@Route('book-club-class')
@Tags('Book Club Class')
@Response<{ message: string; details: FieldErrors }>(
  422,
  'Validation Error',
  validationExample
)
@provide(BookClubClassAPI)
export class BookClubClassAPI extends Controller {
  private bccRepository: BookClubClassRepository;
  private volunteerRepository: VolunteerRepository;

  constructor(
    @inject(SequelizeBCCRepository)
    bccRepository: BookClubClassRepository,
    @inject(SequelizeVolunteerRepository)
    volunteerRepository: VolunteerRepository
  ) {
    super();
    this.bccRepository = bccRepository;
    this.volunteerRepository = volunteerRepository;
  }

  /**
   * Get total count of book club classes by a volunteer.
   */
  @Get('count/{idvol}')
  @SuccessResponse(200, 'Ok')
  @Security('jwt')
  public async countEvaluatedBookClubClassByIdVol(
    @Path() idvol: number
  ): Promise<{ count: number }> {
    return this.bccRepository.countEvaluatedBookClubClassByIdVol(idvol);
  }

  /**
   * Get available essays for evaluation for the volunteer,
   * those essays includes the ones which does not have a reservation date
   * or the reservations of the volunteer.
   *
   * (The volunteer must have readPermission, which is checked using JWT)
   */
  @Get('available/{idvol}')
  @Security('jwt', ['readPermission'])
  @SuccessResponse(200, 'Successfully fetched the essays')
  async getAvailableEssays(
    @Path() idvol: number
  ): Promise<AvailableEssayRowEntity[]> {
    const availableEssays = await this.bccRepository.getAvailableEssays();

    const reservedEssays = await this.bccRepository.getReservedEssaysByIdVol(
      idvol
    );

    const volunteerAccessableEssays = [...reservedEssays, ...availableEssays];

    return volunteerAccessableEssays;
  }

  /**
   * Reserve essay for the volunteer. If the essay is already reserved or evaluated
   * status 400 is returned.
   *
   * (The volunteer must have bookPermission, which is checked using JWT)
   */
  @Put('/reservation')
  @Security('jwt', ['bookPermission'])
  @SuccessResponse(200, 'Successfully reserved essay for volunteer')
  @Response<BookClubClassError>(404, 'Essay not found', {
    name: 'ESSAY_NOT_FOUND',
    message: 'Essay with id {some class id} not found'
  })
  @Response<VolunteerError>(412, 'Volunteer not found', {
    name: 'VOLUNTEER_NOT_FOUND',
    message: 'Volunteer with id {some volunteer id} not found'
  })
  @Response<BookClubClassError>(400, 'Essay already reserved or evaluated', {
    name: 'ESSAY_ALREADY_RESERVED_ERROR',
    message: 'Essay already reserved or already evaluated'
  })
  async reserveEssayForVolunteer(@Body() reserveData: ReserveEssayDataEntity) {
    const { idvol, idclass } = reserveData;

    const volunteer = await this.volunteerRepository.getVolunteerById(idvol);
    if (!volunteer) {
      throw new ApiError(
        412,
        new VolunteerError({
          name: 'VOLUNTEER_NOT_FOUND',
          message: `Volunteer with id ${idvol} not found`
        })
      );
    }

    const book = await this.bccRepository.getBookClubClassById(idclass);
    if (!book) {
      throw new ApiError(
        404,
        new BookClubClassError({
          name: 'ESSAY_NOT_FOUND',
          message: `Essay with id ${idclass} not found`
        })
      );
    }

    const reservedEssay = await this.bccRepository.reserveEssayForVolunteer(
      idvol,
      idclass
    );

    if (!reservedEssay) {
      throw new ApiError(
        400,
        new BookClubClassError({
          name: 'ESSAY_ALREADY_RESERVED_ERROR',
          message: 'Essay already reserved or already evaluated'
        })
      );
    }

    return reservedEssay;
  }
}
