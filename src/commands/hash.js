import { createReadStream } from "fs";
import { createHash } from 'crypto';
import { pipeline } from 'stream/promises';
import { messageList } from '../constants/messageList.js';

export class Hash {
  constructor(pathState) {
    this.algorithm = 'sha256';
    this.encoding = 'hex';
    this.path = pathState;
  }

  async calcHash(file) {
    try {
      const pathToFile = await this.path.pathToFile(this.path.getCurrentPath(), file);
      const rs = createReadStream(pathToFile);
      const hash = createHash(this.algorithm);
      await pipeline(rs, hash);

      return hash.digest(this.encoding);
    } catch (err) {
      throw new Error(messageList.error.operationFailed);
    }
  }
}