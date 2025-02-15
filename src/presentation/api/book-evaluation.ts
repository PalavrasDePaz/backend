import {
  BookEvaluationEntity,
  BookEvaluationList
} from '@src/domain/entities/book-evaluation/book-evaluation-entity';
import { CreateBookEvaluationEntity } from '@src/domain/entities/book-evaluation/create-book-evaluation-entity';
import { UpdateBookEvaluationEntity } from '@src/domain/entities/book-evaluation/update-book-evaluation-entity';
import { BookEvaluationError } from '@src/domain/errors/book-evaluation';
import { BookEvaluationRepository } from '@src/domain/interfaces/repositories/book-evaluation-repository';
import { PaginationResult } from '@src/services/repositories/helpers/wrapPagination';
import { SequelizeBookEvaluationRepository } from '@src/services/repositories/sequelize-book-evaluation-repository';
import express from 'express';
import { inject } from 'inversify';
import { provide } from 'inversify-binding-decorators';
import { logger } from '@src/services/logger/logger';

import {
  Body,
  Controller,
  Delete,
  Get,
  Middlewares,
  Path,
  Post,
  Put,
  Request,
  Response,
  Route,
  Security,
  SuccessResponse,
  Tags
} from 'tsoa';
import { paginationMiddleware } from '../middlewares/paginationMiddleware';
import { ApiError } from '../types/api-error';
import xlsx from 'xlsx';
import { Readable } from 'stream';

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
   *  Filter: ?classes=399,404,405& (filter by class ids - separator "," (comma))
   *
   * @example page "page=3"
   * @example limit "limit=20"
   * @example classes=399,404,405
   */

  @Get('/')
  @Security('jwt')
  @Middlewares(paginationMiddleware)
  @SuccessResponse(200, 'Successfully generated the metrics')
  public async getVBookEvaluationList(
    @Request() req: express.Request
  ): Promise<PaginationResult<BookEvaluationList[]>> {
    const { pagination } = req;

    if (!pagination) throw Error();

    return this.bookEvaluationRepository.getBookEvaluationList(pagination);
  }

  /**
   * Download list all book evaluations.
   *
   * (The user must have bookPermissionn, which is checked using JWT)
   *  Filter: ?classes=399,404,405& (filter by class ids - separator "," (comma))
   *
   * @example classes=399,404,405
   */

  @Get('/download')
  @Security('jwt')
  @Middlewares(paginationMiddleware)
  @SuccessResponse(200, 'Successfully generated the metrics')
  public async getVBookEvaluationListDownload(
    @Request() req: express.Request
  ): Promise<Readable> {
    const { pagination } = req;

    if (!pagination) throw Error();

    const bookEvaluations =
      await this.bookEvaluationRepository.getBookEvaluationListDownload(
        pagination
      );

    const wb = xlsx.utils.book_new();
    const ws = xlsx.utils.json_to_sheet(bookEvaluations);
    xlsx.utils.book_append_sheet(wb, ws, `avaliação-do-livro.xlsx`);
    const xlsxBuffer = xlsx.write(wb, { type: 'buffer', bookType: 'xlsx' });

    req.res?.setHeader(
      'Content-Disposition',
      'attachment; filename=' + `avaliação-do-livro.xlsx`
    );
    req.res?.setHeader('Content-Type', 'application/octet-stream');
    req.res?.setHeader('Content-Length', xlsxBuffer.byteLength);

    const stream = Readable.from(xlsxBuffer);

    stream.on('error', (error) => {
      logger.error(error);
    });

    stream.on('close', () => {
      logger.info('Closing stream');
    });

    return stream;
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
  @Security('jwt')
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

  /**
   * Get evaluation by class ID
   *
   * (The volunteer must have bookPermission, which is checked using JWT)
   */
  @Get('/by-class/{classId}')
  @Security('jwt', ['bookPermission'])
  @SuccessResponse(200, 'Successfully get the evaluation')
  @Response<BookEvaluationError>(404, 'Could not find evaluation', {
    name: 'EVALUATION_NOT_FOUND_ERROR',
    message: `Evaluation with id {classId} not found`
  })
  async getBookEvaluationByClassId(
    @Path() classId: number
  ): Promise<BookEvaluationEntity> {
    const evaluation =
      await this.bookEvaluationRepository.getBookEvaluationByClassId(classId);

    if (!evaluation) {
      throw new ApiError(
        404,
        new BookEvaluationError({
          name: 'EVALUATION_NOT_FOUND_ERROR',
          message: `Evaluation with id ${classId} not found`
        })
      );
    }

    return evaluation;
  }

  /**
   * Get evaluation by class ID
   *
   * (The volunteer must have bookPermission, which is checked using JWT)
   */
  @Delete('/{evaluationId}')
  @Security('jwt')
  @SuccessResponse(204, 'Successfully delete evaluation')
  @Response<BookEvaluationError>(404, 'Could not find evaluation', {
    name: 'EVALUATION_NOT_FOUND_ERROR',
    message: `Evaluation with id {evaluationId} not found`
  })
  async deleteBookEvaluation(@Path() evaluationId: number): Promise<boolean> {
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

    return this.bookEvaluationRepository.deleteBookEvaluation(evaluationId);
  }

  /**
   * Endpoint to Get Relevant Phrases after a specific date download
   *
   */
  @Get('relevant/phrases/{date}/download')
  @Security('jwt')
  @SuccessResponse(200, 'Successfully get relevant phrases')
  async getRelevantPhrases(
    @Path() date: string,
    @Request() req: express.Request
  ): Promise<Readable> {
    const response = await this.bookEvaluationRepository.getRelevantPhrases(
      date
    );

    const wb = xlsx.utils.book_new();
    const ws = xlsx.utils.json_to_sheet(response);
    xlsx.utils.book_append_sheet(wb, ws, `avaliação-do-livro.xlsx`);
    const xlsxBuffer = xlsx.write(wb, { type: 'buffer', bookType: 'xlsx' });

    req.res?.setHeader(
      'Content-Disposition',
      'attachment; filename=' + `avaliação-do-livro-a-partir-de-${date}.xlsx`
    );
    req.res?.setHeader('Content-Type', 'application/octet-stream');
    req.res?.setHeader('Content-Length', xlsxBuffer.byteLength);

    const stream = Readable.from(xlsxBuffer);

    stream.on('error', (error) => {
      logger.error(error);
    });

    stream.on('close', () => {
      logger.info('Closing stream');
    });

    return stream;
  }
}
