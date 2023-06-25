import { stdout } from 'process';
import { createReadStream, createWriteStream } from "fs";
import { writeFile, rm, rename } from "fs/promises";
import { pipeline } from 'stream/promises';
import { messageList } from '../constants/messageList.js';

export class FileSystem {
  constructor(pathState) {
    this.path = pathState;
  }

  async addFile(fileName) {
    try {
      const pathToFile = await this.path.destinationPath(this.path.getCurrentPath(), fileName);
      await writeFile(pathToFile, '', { flag: 'wx' });

      return messageList.msg.operationSuccessful;
    } catch (err) {
      throw new Error(messageList.error.operationFailed);
    }
  }

  async cat(fileName) {
    try {
      const pathToFile = await this.path.pathToFile(this.path.getCurrentPath(), fileName);

      await new Promise((resolve, reject) => {
        const rs = createReadStream(pathToFile, 'utf-8');
        rs.pipe(stdout);

        rs.on('end', () => {
          stdout.write('\n');
          resolve();
        });
        rs.on('error', reject);
      });
    } catch (err) {
      throw new Error(messageList.error.operationFailed);
    }
  }

  async removeFile(fileName) {
    try {
      const pathToFile = await this.path.pathToFile(this.path.getCurrentPath(), fileName);
      await rm(pathToFile, { recursive: true });

      return messageList.msg.operationSuccessful;
    } catch (err) {
      throw new Error(messageList.error.operationFailed);
    }
  };

  async renameFile(fileName, newFileName) {
    try {
      const originalPath = await this.path.pathToFile(this.path.getCurrentPath(), fileName);
      const targetPath = await this.path.targetPath(this.path.getCurrentPath(), newFileName);
      await rename(originalPath, targetPath);

      return messageList.msg.operationSuccessful;
    } catch (err) {
      throw new Error(messageList.error.operationFailed);
    }
  };

  async copyFile(fileName, path) {
    const pathToFile = await this.path.pathToFile(this.path.getCurrentPath(), fileName);
    const targetPath = await this.path.targetPath(path, fileName);
    try {
      const rs = createReadStream(pathToFile);
      const ws = createWriteStream(targetPath);

      await pipeline(rs, ws);

      return messageList.msg.operationSuccessful;
    } catch (err) {
      throw new Error(messageList.error.operationFailed);
    }
  };

  async moveFile(fileName, path) {
    const pathToFile = await this.path.pathToFile(this.path.getCurrentPath(), fileName);
    await this.copyFile(fileName, path);

    try {
      await rm(pathToFile);
    } catch (err) {
      throw new Error(messageList.error.operationFailed);
    }
  }
}