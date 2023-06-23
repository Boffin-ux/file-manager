import { resolve } from 'path';
import { stat, open } from 'fs/promises';
import { messageList } from '../constants/messageList.js';
import { State } from '../state.js';

export class PathConstructor extends State {
  async _checkIsDir(path) {
    try {
      return (await stat(path)).isDirectory();
    } catch (err) {
      throw new Error(messageList.error.operationFailed);
    }
  }

  async _isFileExist(path) {
    try {
      (await open(path)).close();
      return true;
    } catch (err) {
      return false;
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
    const isDir = await this._checkIsDir(resolvePath);

    if (!isDir) {
      throw new Error(messageList.error.operationFailed);
    }

    this.setCurrentPath(resolvePath);
    return resolvePath;
  }

  async pathToFile(path, file) {
    const resolvePath = await this.resolvePath(path, file);
    const isFileExist = await this._isFileExist(resolvePath);

    if (!isFileExist) {
      throw new Error(messageList.error.operationFailed);
    }

    return resolvePath;
  }

  async targetPath(path, file) {
    const resolvePath = await this.resolvePath(path, file);
    const isFileExist = await this._isFileExist(resolvePath);
    const isDir = await this._checkIsDir(resolve(path));

    if (isFileExist || !isDir) {
      throw new Error(messageList.error.operationFailed);
    }

    return resolvePath;
  }
}