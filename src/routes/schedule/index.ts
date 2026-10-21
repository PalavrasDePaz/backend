import { Router } from 'express';
import { validateRequest } from '@src/presentation/middlewares/validate-request';
import { z } from 'zod';
import { ApiError } from '@src/presentation/types/api-error';
import { FileError } from '@src/domain/errors/fileErrors';
import * as fs from 'fs/promises';
import * as path from 'path';
import multer from 'multer';

const router = Router();
const upload = multer();

const uploadDirectory = path.join(__dirname, '../../../public');

const directoryExists = async (): Promise<boolean> => {
  try {
    await fs.access(uploadDirectory);
    return true;
  } catch (e) {
    return false;
  }
};

const verifyDirectory = async (): Promise<void> => {
  const pathExists = await directoryExists();
  if (!pathExists) {
    await fs.mkdir(uploadDirectory, { recursive: true });
  }
};

// POST /schedule/upload
router.post(
  '/upload',
  upload.single('file'),
  validateRequest({
    body: z.object({
      fileName: z.string(),
      title: z.string().optional(),
      description: z.string().optional()
    })
  }),
  async (req, res, next) => {
    try {
      const { fileName, title, description } = req.body;
      const file = req.file;
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

      await verifyDirectory();

      const files = await fs.readdir(uploadDirectory);

      const fileToDelete = files.map(async (file) => {
        let fileExists = false;
        if (file.includes(fileName)) {
          const filePath = path.join(uploadDirectory, `${file}`);

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
          await fs.writeFile(`${uploadDirectory}/${fileName}.json`, content);
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
          uploadDirectory,
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
      res.status(200).json({ message: 'Arquivo enviado com sucesso' });
    } catch (error) {
      next(error);
    }
  }
);

// PUT /schedule/:scheduleName
router.put(
  '/:scheduleName',
  upload.single('file'),
  validateRequest({
    params: z.object({
      scheduleName: z.string()
    }),
    body: z.object({
      title: z.string().optional(),
      description: z.string().optional()
    })
  }),
  async (req, res, next) => {
    try {
      const { scheduleName } = req.params;
      const { title, description } = req.body;
      const file = req.file;
      const files = await fs.readdir(uploadDirectory);

      const fileToDelete = files.map(async (file) => {
        let fileExists = false;
        if (file.includes(scheduleName)) {
          const filePath = path.join(uploadDirectory, `${file}`);

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

          await verifyDirectory();

          const filePath = path.join(
            uploadDirectory,
            `${scheduleName}${fileExtension}`
          );

          await fs.writeFile(filePath, file.buffer);
        }

        if (title || description) {
          const scheduleJson = await fs.readFile(
            `${uploadDirectory}/${scheduleName}.json`
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
            `${uploadDirectory}/${scheduleName}.json`,
            JSON.stringify(scheduleParsed)
          );
        }
        res.status(200).json({ message: 'Update Successfuly' });
      } catch (e) {
        throw new ApiError(
          400,
          new FileError({
            name: 'UPLOAD_ERROR',
            message: 'Error uploading file'
          })
        );
      }
    } catch (error) {
      next(error);
    }
  }
);

// DELETE /schedule/:scheduleName
router.delete(
  '/:scheduleName',
  validateRequest({
    params: z.object({
      scheduleName: z.string()
    })
  }),
  async (req, res, next) => {
    try {
      const { scheduleName } = req.params;
      const files = await fs.readdir(uploadDirectory);

      const fileToDelete = files.map(async (file) => {
        let fileExists = false;
        if (file.includes(scheduleName)) {
          const filePath = path.join(uploadDirectory, `${file}`);

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

      res.status(200).json({ message: 'Arquivo deletado com sucesso' });
    } catch (error) {
      next(error);
    }
  }
);

export default router;
