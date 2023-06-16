import { NotebooksRepository } from '@src/domain/interfaces/repositories/notebooks-repository';
import { SequelizeNotebooksRepository } from '@src/services/repositories/sequelize-notebooks-repository';
import { inject } from 'inversify';
import { provide } from 'inversify-binding-decorators';
import { Controller, Get, Path, Route, Security, Tags } from 'tsoa';

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
   * Get all notebooks by a volunteer and total count.
   */
  @Get('count/{idvol}')
  @Security('jwt')
  public async getNotebooksByIdVol(
    @Path() idvol: number
  ): Promise<{ count: number }> {
    const notebooks = await this.notebooksRepository.getNotebooksByIdVol(idvol);
    return { count: notebooks.length };
  }
}
