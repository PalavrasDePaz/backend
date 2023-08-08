export interface FileHandler {
  downloadFilesFromSourceToFolder(
    source: string,
    folder: string
  ): Promise<void[]>;

  zipFiles(source: string, zipName: string): Promise<void>;

  getFolderName(source: string): Promise<string>;
}
