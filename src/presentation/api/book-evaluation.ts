import { inject } from 'inversify';
import { provide } from 'inversify-binding-decorators';
import {
  Body,
  Controller,
  Path,
  Post,
  Put,
  Route,
  Security,
  SuccessResponse,
  Response,
  Tags,
  Get,
  Middlewares,
  Request
} from 'tsoa';
import { BookEvaluationRepository } from '@src/domain/interfaces/repositories/book-evaluation-repository';
import { SequelizeBookEvaluationRepository } from '@src/services/repositories/sequelize-book-evaluation-repository';
import { CreateBookEvaluationEntity } from '@src/domain/entities/book-evaluation/create-book-evaluation-entity';
import { ApiError } from '../types/api-error';
import { BookEvaluationError } from '@src/domain/errors/book-evaluation';
import {
  BookEvaluationEntity,
  BookEvaluationList
} from '@src/domain/entities/book-evaluation/book-evaluation-entity';
import { UpdateBookEvaluationEntity } from '@src/domain/entities/book-evaluation/update-book-evaluation-entity';
import { paginationMiddleware } from '../middlewares/paginationMiddleware';
import express from 'express';
import { PaginationResult } from '@src/services/repositories/helpers/wrapPagination';

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
   * List all book evaluations.
   *
   * (The user must have bookPermissionn, which is checked using JWT)
   *  Pagination
   *  Page: ?page=number& (page number)
   *  Limit: ?limit=number& (data quantity - max=30)
   *
   * @example page "page=3"
   * @example limit "limit=20"
   */

  @Get('/')
  @Security('jwt', ['bookPermission'])
  @Middlewares(paginationMiddleware)
  @SuccessResponse(200, 'Successfully generated the metrics')
  public async getVolunteersAttendanceMetrics(
    @Request() req: express.Request
  ): Promise<PaginationResult<BookEvaluationList[]>> {
    const { pagination } = req;

    if (!pagination) throw Error('lancei');

    return this.bookEvaluationRepository.getBookEvaluationList(pagination);
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

  /**
   * Update class values available at UpdateBookEvaluationEntity from class with evaluationId
   *
   *
   * (The volunteer must have essayModulePermission, which is checked using JWT)
   */
  @Put('{evaluationId}')
  @Security('jwt', ['essayModulePermission'])
  @SuccessResponse(200, 'Successfully Upadated the evaluation')
  @Response<BookEvaluationError>(404, 'Could not find evaluation', {
    name: 'EVALUATION_NOT_FOUND_ERROR',
    message: `Evaluation with id {evaluationId} not found`
  })
  @Response<BookEvaluationError>(400, 'Could not update evaluation', {
    name: 'EVALUATION_NOT_UPDATED_ERROR',
    message: `Evaluation with ID {evaluationId} not updated`
  })
  async updateBookEvaluation(
    @Path() evaluationId: number,
    @Body() evaluation: UpdateBookEvaluationEntity
  ): Promise<BookEvaluationEntity> {
    const searchEvaluation =
      await this.bookEvaluationRepository.getBookEvaluationById(evaluationId);
    if (!searchEvaluation) {
      throw new ApiError(
        404,
        new BookEvaluationError({
          name: 'EVALUATION_NOT_FOUND_ERROR',
          message: `Evaluation with id ${evaluationId} not found`
        })
      );
    }

    const updatedEvaluation =
      await this.bookEvaluationRepository.updatedBookEvaluation(
        evaluationId,
        evaluation
      );

    if (!updatedEvaluation) {
      throw new ApiError(
        400,
        new BookEvaluationError({
          name: 'EVALUATION_NOT_UPDATED_ERROR',
          message: `Evaluation with id ${evaluationId} not upated`
        })
      );
    }

    return updatedEvaluation;
  }

  /**
   * Get evaluation by ID
   *
   * (The volunteer must have bookPermission, which is checked using JWT)
   */
  @Get('{evaluationId}')
  @Security('jwt', ['bookPermission'])
  @SuccessResponse(200, 'Successfully get the evaluation')
  @Response<BookEvaluationError>(404, 'Could not find evaluation', {
    name: 'EVALUATION_NOT_FOUND_ERROR',
    message: `Evaluation with id {evaluationId} not found`
  })
  async getBookEvaluationById(
    @Path() evaluationId: number
  ): Promise<BookEvaluationEntity> {
    const evaluation =
      await this.bookEvaluationRepository.getBookEvaluationById(evaluationId);

    if (!evaluation) {
      throw new ApiError(
        404,
        new BookEvaluationError({
          name: 'EVALUATION_NOT_FOUND_ERROR',
          message: `Evaluation with id ${evaluationId} not found`
        })
      );
    }

    return evaluation;
  }
}
