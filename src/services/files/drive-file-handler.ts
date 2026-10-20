import { drive_v3 } from '@googleapis/drive';
import { FileHandler } from './file-handler';
import { provideSingleton } from '@src/helpers/provide-singleton';
import {
  DRIVE_CACHE_FOLDER,
  DRIVE_CACHE_TTL_SECONDS,
  GOOGLE_CLOUD_KEY
} from '@src/config/server';
import { createWriteStream, readdirSync, writeFile } from 'fs';
import path from 'path';
import archiver from 'archiver';
import { logger } from '../logger/logger';
import { FetchFilesError } from '@src/domain/errors/fetch-files';
import { DiskCache } from '@src/helpers/disk-cache';

@provideSingleton(DriveFileHandler)
export class DriveFileHandler implements FileHandler {
  drive: drive_v3.Drive;
  private cache = new DiskCache(
    DRIVE_CACHE_FOLDER,
    DRIVE_CACHE_TTL_SECONDS * 1000
  );

  constructor() {
    this.drive = new drive_v3.Drive({ auth: GOOGLE_CLOUD_KEY });
    logger.info('Created drive Cliente');
  }

  async donwloadFileBufferFromName(
    source: string,
    fileName: string
  ): Promise<Buffer> {
    const query = `"${source}" in parents and name = '${fileName}.pdf'`;
    const files = await this.cache.getOrLoadJson(
      `list:${query}`,
      async () =>
        (
          await this.drive.files.list({
            supportsAllDrives: true,
            q: query
          })
        ).data.files ?? []
    );

    if (!files.length || !files[0].id)
      throw new FetchFilesError({
        name: 'FILE_NOT_FOUND',
        message: `Could not find file with name ${fileName}.pdf`
      });

    return this.getFileBufferFromId(files[0].id);
  }

  async getFolderName(source: string): Promise<string> {
    return this.cache.getOrLoadJson(`name:${source}`, async () => {
      const resp = await this.drive.files.get({
        fileId: source,
        supportsAllDrives: true,
        fields: 'name'
      });

      return resp.data.name ?? '';
    });
  }

  private getFileBufferFromId(fileId: string): Promise<Buffer> {
    return this.cache.getOrLoad(`file:${fileId}`, async () => {
      const resp = await this.drive.files.get(
        {
          fileId: fileId,
          alt: 'media',
          supportsAllDrives: true
        },
        { responseType: 'arraybuffer' }
      );

      // using any because of not found type from library
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const buffer = Buffer.from(resp.data as any, 'base64');
      return buffer;
    });
  }

  private async getFilesFromSource(
    source: string
  ): Promise<drive_v3.Schema$File[]> {
    const query = `"${source}" in parents`;
    return this.cache.getOrLoadJson(`list:${query}`, async () => {
      const files = (
        await this.drive.files.list({
          supportsAllDrives: true,
          q: query
        })
      ).data.files;

      logger.info('Fetched files from drive');

      return files ? files : [];
    });
  }

  async downloadFilesFromSourceToFolder(
    source: string,
    folder: string
  ): Promise<void[]> {
    const files = await this.getFilesFromSource(source);

    return Promise.all(
      files.map(async (file) => {
        if (file.id && file.name) {
          const fileBuffer = await this.getFileBufferFromId(file.id);
          const filepath = path.join(folder, file.name);
          writeFile(filepath, fileBuffer, (err) => {
            if (err) logger.error(err);
          });
        }
      })
    );
  }

  async zipFiles(source: string, zipName: string): Promise<void> {
    const zipPath = path.join(source, zipName);
    const archive = archiver('zip', { zlib: { level: 9 } });
    const stream = createWriteStream(zipPath);
    const files = readdirSync(source);

    logger.info(`Start Creating Zip File from list: ${files}`);

    return new Promise((resolve, reject) => {
      files.forEach((file) =>
        archive.file(path.join(source, file), {
          name: file
        })
      );

      archive
        .on('error', (err) => {
          if (err) logger.error(err);
          reject(err);
        })
        .pipe(stream);
      archive.on('end', () => {
        resolve();
      });
      archive.finalize();
    });
  }
}
