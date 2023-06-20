import { NotebooksRepository } from '@src/domain/interfaces/repositories/notebooks-repository';
import { SequelizeNotebooksRepository } from '@src/services/repositories/sequelize-notebooks-repository';
import { inject } from 'inversify';
import { provide } from 'inversify-binding-decorators';
import { Controller, Get, Path, Route, Security, SuccessResponse, Tags } from 'tsoa';

@Route('notebooks')
@Tags('Notebook')
@provide(NotebooksAPI)
export class NotebooksAPI extends Controller {
  private notebooksRepository: NotebooksRepository;

  constructor(
    @inject(SequelizeNotebooksRepository)
    notebooksRepository: NotebooksRepository
  ) {
    super();
    this.notebooksRepository = notebooksRepository;
  }

  /**
   * Get total count of notebooks by a volunteer.
   */
  @Get('count/{idvol}')
  @SuccessResponse(200, 'Ok')
  @Security('jwt')
  public async getNotebooksByIdVol(
    @Path() idvol: number
  ): Promise<{ count: number }> {
    return this.notebooksRepository.getNotebooksByIdVol(idvol);
  }
}
