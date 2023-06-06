import NotebooksEntity from '@src/domain/entities/notebooks-entity';
import { NotebooksRepository } from '@src/domain/interfaces/repositories/notebooks-repository';
import { SequelizeNotebooksRepository } from '@src/services/repositories/sequelize-notebooks-repository';
import { inject } from 'inversify';
import { provide } from 'inversify-binding-decorators';
import { Controller, Get, Path, Route, Security } from 'tsoa';

@Route('notebooks')
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
  @Get('{idvol}')
  @Security('jwt')
  public async getNotebooksByIdVol(
    @Path() idvol: number
  ): Promise<{ count: number; notebooks: NotebooksEntity[] }> {
    const notebooks = await this.notebooksRepository.getNotebooksByIdVol(idvol);
    return { count: notebooks.length, notebooks };
  }
}
