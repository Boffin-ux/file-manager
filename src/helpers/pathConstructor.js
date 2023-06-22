import { resolve } from 'path';
import { stat, open } from 'fs/promises';
import { messageList } from '../constants/messageList.js';
import { State } from '../state.js';

export class PathConstructor extends State {
  async checkIsDir(path) {
    try {
      return (await stat(path)).isDirectory();
    } catch (err) {
      throw new Error(messageList.error.operationFailed);
    }
  }

  async resolvePath(currentPath, dir) {
    try {
      const path = resolve(currentPath, dir);
      return path;
    } catch (err) {
      throw new Error(messageList.error.operationFailed);
    }
  }

  async setPath(path, dir) {
    const resolvePath = await this.resolvePath(path, dir);
    const isDir = await this.checkIsDir(resolvePath);

    if (!isDir) {
      throw new Error(messageList.error.operationFailed);
    }

    this.setCurrentPath(resolvePath);
    return resolvePath;
  }
}