import { validationExample } from '@src/documentation/validation-example';
import AvailableEssayRowEntity from '@src/domain/entities/book-club-class/available-essay-row-entity';
import { BookClubClassRepository } from '@src/domain/interfaces/repositories/book-club-class-repository';
import { SequelizeBCCRepository } from '@src/services/repositories/sequelize-bcc-repository';
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
  FieldErrors
} from 'tsoa';

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

  constructor(
    @inject(SequelizeBCCRepository)
    bccRepository: BookClubClassRepository
  ) {
    super();
    this.bccRepository = bccRepository;
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
}
