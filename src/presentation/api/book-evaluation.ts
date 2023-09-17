import { inject } from 'inversify';
import { provide } from 'inversify-binding-decorators';
import {
  Body,
  Controller,
  Post,
  Route,
  Security,
  SuccessResponse,
  Tags
} from 'tsoa';
import { BookEvaluationRepository } from '@src/domain/interfaces/repositories/book-evaluation-repository';
import { SequelizeBookEvaluationRepository } from '@src/services/repositories/sequelize-book-evaluation-repository';
import { CreateBookEvaluationEntity } from '@src/domain/entities/book-evaluation/create-book-evaluation-entity';
import { ApiError } from '../types/api-error';
import { BookEvaluationError } from '@src/domain/errors/book-evaluation';

@Route('book-evaluations')
@Tags('Book evaluation')
@provide(BookEvaluationAPI)
export class BookEvaluationAPI extends Controller {
  private bookEvaluationRepository: BookEvaluationRepository;

  constructor(
    @inject(SequelizeBookEvaluationRepository)
    bookEvaluationRepository: BookEvaluationRepository
  ) {
    super();
    this.bookEvaluationRepository = bookEvaluationRepository;
  }

  /**
   * Create multiple multiple evaluations
   *
   * (The volunteer must have bookPermission, which is checked using JWT)
   */
  @Post()
  @Security('jwt', ['bookPermission'])
  @SuccessResponse(201, 'Successfully Created Evaluations')
  public async createBookEvaluations(
    @Body() bookEvaluations: CreateBookEvaluationEntity[]
  ): Promise<void> {
    try {
      await this.bookEvaluationRepository.createBookEvaluations(
        bookEvaluations
      );
    } catch (error) {
      throw new ApiError(400, error as BookEvaluationError);
    }
  }
}
