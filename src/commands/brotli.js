import { createReadStream, createWriteStream } from "fs";
import { pipeline } from 'stream/promises';
import { createBrotliCompress, createBrotliDecompress } from "zlib";
import { messageList } from '../constants/messageList.js';

export class Brotli {
  constructor(pathState) {
    this.path = pathState;
  }

  async compress(fileName, path) {
    const pathToFile = await this.path.pathToFile(this.path.getCurrentPath(), fileName);
    const targetPath = await this.path.targetPath(path, fileName);

    try {
      const rs = createReadStream(pathToFile);
      const ws = createWriteStream(targetPath);
      const brotli = createBrotliCompress();

      await pipeline(rs, brotli, ws);
      return messageList.msg.operationSuccessful;
    } catch (err) {
      throw new Error(messageList.error.operationFailed);
    }
  }

  async decompress(fileName, path) {
    const pathToFile = await this.path.pathToFile(this.path.getCurrentPath(), fileName);
    const targetPath = await this.path.targetPath(path, fileName);

    try {
      const rs = createReadStream(pathToFile);
      const ws = createWriteStream(targetPath);
      const brotli = createBrotliDecompress();

      await pipeline(rs, brotli, ws);
      return messageList.msg.operationSuccessful;
    } catch (err) {
      throw new Error(messageList.error.operationFailed);
    }
  }
}