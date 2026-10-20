import { createHash } from 'crypto';
import { promises as fs } from 'fs';
import path from 'path';
import { logger } from '@src/services/logger/logger';

export class DiskCache {
  private inFlight = new Map<string, Promise<Buffer>>();

  constructor(private folder: string, private ttlMs: number) {}

  /**
   * Returns the cached buffer for the key, or calls the loader and stores its result on disk.
   * Entries expire ttlMs after being written, and failed loads are not cached.
   */
  async getOrLoad(key: string, loader: () => Promise<Buffer>): Promise<Buffer> {
    const filepath = this.pathForKey(key);

    const cached = await this.readIfFresh(filepath);
    if (cached) return cached;

    const pending = this.inFlight.get(key);
    if (pending) return pending;

    const load = (async () => {
      const value = await loader();
      await this.write(filepath, value);
      return value;
    })().finally(() => this.inFlight.delete(key));
    this.inFlight.set(key, load);

    this.removeExpired().catch((err) => logger.error(err));

    return load;
  }

  async getOrLoadJson<T>(key: string, loader: () => Promise<T>): Promise<T> {
    const buffer = await this.getOrLoad(key, async () =>
      Buffer.from(JSON.stringify(await loader()))
    );
    return JSON.parse(buffer.toString());
  }

  private pathForKey(key: string): string {
    return path.join(
      this.folder,
      createHash('sha256').update(key).digest('hex')
    );
  }

  private isExpired(mtimeMs: number): boolean {
    return mtimeMs + this.ttlMs <= Date.now();
  }

  private async readIfFresh(filepath: string): Promise<Buffer | undefined> {
    try {
      const stats = await fs.stat(filepath);
      if (this.isExpired(stats.mtimeMs)) return undefined;
      return await fs.readFile(filepath);
    } catch {
      return undefined;
    }
  }

  private async write(filepath: string, value: Buffer): Promise<void> {
    try {
      await fs.mkdir(this.folder, { recursive: true });
      // write to a temp file and rename so readers never see a partial entry
      const tmpPath = `${filepath}.${process.pid}.${Date.now()}.tmp`;
      await fs.writeFile(tmpPath, value);
      await fs.rename(tmpPath, filepath);
    } catch (err) {
      logger.error(err);
    }
  }

  private async removeExpired(): Promise<void> {
    let files: string[];
    try {
      files = await fs.readdir(this.folder);
    } catch {
      return;
    }

    await Promise.all(
      files.map(async (file) => {
        const filepath = path.join(this.folder, file);
        try {
          const stats = await fs.stat(filepath);
          if (this.isExpired(stats.mtimeMs)) await fs.rm(filepath);
        } catch {
          // entry was removed or replaced concurrently
        }
      })
    );
  }
}
