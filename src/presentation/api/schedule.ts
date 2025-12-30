import { STORAGE_DATA_FOLDER } from '@src/config/server';
import { FileError } from '@src/domain/errors/fileErrors';
import { mkdirSync } from 'fs';
import * as fs from 'fs/promises';
import { provide } from 'inversify-binding-decorators';
import * as path from 'path';
import {
  Controller,
  Delete,
  FormField,
  Path,
  Post,
  Put,
  Response,
  Route,
  SuccessResponse,
  Tags,
  UploadedFile
} from 'tsoa';
import { ApiError } from '../types/api-error';

@Route('schedule')
@Tags('Upload - Agenda')
@provide(FilesController)
export class FilesController extends Controller {
  private uploadDirectory = path.join(STORAGE_DATA_FOLDER, './schedule');

  constructor() {
    super();

    mkdirSync(this.uploadDirectory);
  }

  private async directoryExists(): Promise<boolean> {
    try {
      await fs.access(this.uploadDirectory);
      return true;
    } catch (e) {
      return false;
    }
  }

  private async verifyDirectory(): Promise<void> {
    const pathExists = await this.directoryExists();
    if (!pathExists) {
      await fs.mkdir(this.uploadDirectory, { recursive: true });
    }
  }

  /**
   * Enpoint for upload schedule.
   * @param title Content Title of schedule.
   * @param description Content of schedule.
   * @param fileName File name of schedule, can be schedule1 to schedule5.
   * @param file Image of schedule, can be png, jpg and jpeg (via form-data).
   */
  @Post('upload')
  @SuccessResponse(200, 'Successfully Upload schedule')
  @Response<FileError>(400, 'Invalid File Name', {
    name: 'INVALID_NAME',
    message: 'Invalid File Name'
  })
  public async uploadFile(
    @FormField() fileName: string,
    @FormField() title?: string,
    @UploadedFile() file?: Express.Multer.File,
    @FormField() description?: string
  ): Promise<{ message: string } | void> {
    const allowedFileNames = [
      'schedule1',
      'schedule2',
      'schedule3',
      'schedule4',
      'schedule5'
    ];
    if (!allowedFileNames.includes(fileName)) {
      throw new ApiError(
        400,
        new FileError({
          name: 'INVALID_NAME',
          message: 'Invalid File Name'
        })
      );
    }

    await this.verifyDirectory();

    const files = await fs.readdir(this.uploadDirectory);

    const fileToDelete = files.map(async (file) => {
      let fileExists = false;
      if (file.includes(fileName)) {
        const filePath = path.join(this.uploadDirectory, `${file}`);

        try {
          await fs.access(filePath);

          fileExists = true;
        } catch (err) {
          fileExists = false;
        }

        if (fileExists) {
          await fs.unlink(filePath);
        }
      }
    });

    await Promise.all(fileToDelete);

    if (title && description) {
      try {
        const content = JSON.stringify({ title, description });
        await fs.writeFile(`${this.uploadDirectory}/${fileName}.json`, content);
      } catch (e) {
        throw new ApiError(
          400,
          new FileError({
            name: 'UPLOAD_ERROR',
            message: 'Error uploading file'
          })
        );
      }
    }

    if (file) {
      const allowedExtensions = ['.png', '.jpg', '.jpeg'];
      const fileExtension = path.extname(file.originalname).toLowerCase();

      if (!allowedExtensions.includes(fileExtension)) {
        throw new ApiError(
          400,
          new FileError({
            name: 'INVALID_FILE_EXTENSION',
            message: 'Invalid File Extension'
          })
        );
      }
      const filePath = path.join(
        this.uploadDirectory,
        `${fileName}${fileExtension}`
      );

      try {
        await fs.writeFile(filePath, file.buffer);
      } catch (e) {
        throw new ApiError(
          400,
          new FileError({
            name: 'UPLOAD_ERROR',
            message: 'Error uploading file'
          })
        );
      }
    }
    return { message: 'Arquivo enviado com sucesso' };
  }

  /**
   * Enpoint for update a schedule.
   * @param title Content Title of schedule.
   * @param description Content of schedule.
   * @param fileName File name of schedule, can be schedule1 to schedule5.
   * @param file Image of schedule, can be png, jpg and jpeg (via form-data).
   */
  @Put('{scheduleName}')
  public async updateSchedule(
    @Path() scheduleName: string,
    @FormField() title?: string,
    @FormField() description?: string,
    @UploadedFile() file?: Express.Multer.File
  ): Promise<{ message: string } | void> {
    const files = await fs.readdir(this.uploadDirectory);

    const fileToDelete = files.map(async (file) => {
      let fileExists = false;
      if (file.includes(scheduleName)) {
        const filePath = path.join(this.uploadDirectory, `${file}`);

        try {
          await fs.access(filePath);

          fileExists = true;
        } catch (err) {
          fileExists = false;
        }

        if (fileExists) {
          await fs.unlink(filePath);
        }
      }
    });

    await Promise.all(fileToDelete);

    try {
      if (file) {
        const allowedExtensions = ['.png', '.jpg', '.jpeg'];
        const allowedFileNames = [
          'schedule1',
          'schedule2',
          'schedule3',
          'schedule4',
          'schedule5'
        ];

        const fileExtension = path.extname(file.originalname).toLowerCase();

        if (!allowedFileNames.includes(scheduleName)) {
          throw new ApiError(
            400,
            new FileError({
              name: 'INVALID_NAME',
              message: 'Invalid File Name'
            })
          );
        }

        if (!allowedExtensions.includes(fileExtension)) {
          throw new ApiError(
            400,
            new FileError({
              name: 'INVALID_FILE_EXTENSION',
              message: 'Invalid File Extension'
            })
          );
        }

        await this.verifyDirectory();

        const filePath = path.join(
          this.uploadDirectory,
          `${scheduleName}${fileExtension}`
        );

        await fs.writeFile(filePath, file.buffer);
      }

      if (title || description) {
        const scheduleJson = await fs.readFile(
          `${this.uploadDirectory}/${scheduleName}.json`
        );

        const scheduleParsed = JSON.parse(scheduleJson.toString());

        if (!scheduleJson) {
          throw new ApiError(
            400,
            new FileError({
              name: 'SCHEDULE_NOT_FOUND',
              message: `File with name "${scheduleName}" not found`
            })
          );
        }

        scheduleParsed.title = title ? title : scheduleParsed.title;
        scheduleParsed.description = description
          ? description
          : scheduleParsed.description;

        await fs.writeFile(
          `${this.uploadDirectory}/${scheduleName}.json`,
          JSON.stringify(scheduleParsed)
        );
      }
      return { message: 'Update Successfuly' };
    } catch (e) {
      throw new ApiError(
        400,
        new FileError({
          name: 'UPLOAD_ERROR',
          message: 'Error uploading file'
        })
      );
    }
  }

  /**
   * Delete a schedule by name.
   * @param scheduleName Name of schedule to delete.
   */
  @Delete('{scheduleName}')
  public async deleteFile(
    scheduleName: string
  ): Promise<{ message: string } | void> {
    const files = await fs.readdir(this.uploadDirectory);

    const fileToDelete = files.map(async (file) => {
      let fileExists = false;
      if (file.includes(scheduleName)) {
        const filePath = path.join(this.uploadDirectory, `${file}`);

        try {
          await fs.access(filePath);

          fileExists = true;
        } catch (err) {
          fileExists = false;
        }

        if (fileExists) {
          await fs.unlink(filePath);
        }
      }
    });

    await Promise.all(fileToDelete);

    return { message: 'Arquivo deletado com sucesso' };
  }
}
