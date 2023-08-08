import { drive_v3 } from '@googleapis/drive';
import { FileHandler } from './file-handler';
import { provideSingleton } from '@src/helpers/provide-singleton';
import { GOOGLE_CLOUD_KEY } from '@src/config/server';
import { createWriteStream, readdirSync, writeFileSync } from 'fs';
import path from 'path';
import archiver from 'archiver';

@provideSingleton(DriveFileHandler)
export class DriveFileHandler implements FileHandler {
  drive: drive_v3.Drive;
  constructor() {
    this.drive = new drive_v3.Drive({ auth: GOOGLE_CLOUD_KEY });
  }

  private async getFileBufferFromId(fileId: string): Promise<Buffer> {
    const resp = await this.drive.files.get(
      {
        fileId: fileId,
        alt: 'media',
        supportsAllDrives: true
      },
      { responseType: 'arraybuffer' }
    );
    // using any because of not found type from library
    const buffer = Buffer.from(resp.data as any, 'base64');
    return buffer;
  }

  private async getFilesFromSource(
    source: string
  ): Promise<drive_v3.Schema$File[]> {
    const files = (
      await this.drive.files.list({
        supportsAllDrives: true,
        q: `"${source}" in parents`
      })
    ).data.files;

    return files ? files : [];
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
          writeFileSync(filepath, fileBuffer);
        }
      })
    );
  }

  async zipFiles(source: string, zipName: string): Promise<void> {
    const zipPath = path.join(source, zipName);
    const archive = archiver('zip', { zlib: { level: 9 } });
    const stream = createWriteStream(zipPath);
    const files = readdirSync(source);

    return new Promise((resolve, reject) => {
      files.forEach((file) =>
        archive.file(path.join(source, file), {
          name: file
        })
      );

      archive.on('error', (err) => reject(err)).pipe(stream);
      archive.on('end', () => {
        resolve();
      });
      archive.finalize();
    });
  }
}
