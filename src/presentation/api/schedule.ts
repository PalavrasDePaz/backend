import {
  Post,
  Route,
  FormField,
  UploadedFile,
  Controller,
  Delete,
  Tags,
  Put,
  Path,
  SuccessResponse,
  Response
} from 'tsoa';
import { provide } from 'inversify-binding-decorators';
import * as fs from 'fs/promises';
import * as path from 'path';
import { ApiError } from '../types/api-error';
import { FileError } from '@src/domain/errors/fileErrors';

@Route('schedule')
@Tags('Upload - Agenda')
@provide(FilesController)
export class FilesController extends Controller {
  private uploadDirectory = path.join(__dirname, '../../../public');

  constructor() {
    super();
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
    @FormField() title: string,
    @FormField() description: string,
    @FormField() fileName: string,
    @UploadedFile() file: Express.Multer.File
  ): Promise<{ message: string } | void> {
    const allowedExtensions = ['.png', '.jpg', '.jpeg'];
    const allowedFileNames = [
      'schedule1',
      'schedule2',
      'schedule3',
      'schedule4',
      'schedule5'
    ];

    const fileExtension = path.extname(file.originalname).toLowerCase();

    if (!allowedFileNames.includes(fileName)) {
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
      `${fileName}${fileExtension}`
    );

    try {
      if (title && description) {
        const content = JSON.stringify({ title, description });
        await fs.writeFile(`${this.uploadDirectory}/${fileName}.json`, content);
      }
      await fs.writeFile(filePath, file.buffer);
      return { message: 'Arquivo enviado com sucesso' };
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

        await fs.unlink(filePath);

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
    let imageExists = false;
    let jsonExists = false;

    const fileToDelete = files.find(
      (file) => path.parse(file).name === scheduleName
    );

    if (!fileToDelete) {
      throw new ApiError(
        400,
        new FileError({
          name: 'SCHEDULE_NOT_FOUND',
          message: `File with name "${scheduleName}" not found`
        })
      );
    }

    const filePath = path.join(this.uploadDirectory, fileToDelete);

    try {
      await fs.access(filePath);

      imageExists = true;
    } catch (err) {
      imageExists = false;
    }

    if (imageExists) {
      await fs.unlink(filePath);
    }

    try {
      await fs.access(`${this.uploadDirectory}/${scheduleName}.json`);
      jsonExists = true;
    } catch (err) {
      jsonExists = false;
    }

    if (jsonExists) {
      await fs.unlink(`${this.uploadDirectory}/${scheduleName}.json`);
    }

    return { message: 'Arquivo deletado com sucesso' };
  }
}
