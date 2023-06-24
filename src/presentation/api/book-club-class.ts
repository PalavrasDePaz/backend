import { validationExample } from '@src/documentation/validation-example';
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
}
