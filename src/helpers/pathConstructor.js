import { resolve, parse, isAbsolute } from 'path';
import { stat, open } from 'fs/promises';
import { messageList } from '../constants/messageList.js';
import { State } from '../state.js';

export class PathConstructor extends State {
  async _checkIsDir(path) {
    try {
      return (await stat(path)).isDirectory();
    } catch (err) {
      return false;
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

  _isPathValid(path) {
    if (path[1]) {
      const valid = !isAbsolute(path) && path[1] === ':';
      return !valid;
    }

    return false;
  }

  async _resolvePath(currentPath, newPath) {
    try {
      const path = resolve(currentPath, newPath);
      return path;
    } catch (err) {
      throw new Error(messageList.error.operationFailed);
    }
  }

  async setPath(path, dir) {
    const isPathValid = this._isPathValid(dir);

    if (!isPathValid) {
      throw new Error(messageList.error.operationFailed);
    }

    const resolvePath = await this._resolvePath(path, dir);
    const isDir = await this._checkIsDir(resolvePath);

    if (!isDir) {
      throw new Error(messageList.error.operationFailed);
    }

    this.setCurrentPath(resolvePath);
    return resolvePath;
  }

  async pathToFile(path, file) {
    const resolvePath = await this._resolvePath(path, file);
    const isFileExist = await this._isFileExist(resolvePath);
    const isDir = await this._checkIsDir(resolvePath);

    if (!isFileExist || isDir) {
      throw new Error(messageList.error.operationFailed);
    }

    return resolvePath;
  }

  getDir(pathToFile) {
    return parse(pathToFile).dir;
  }

  async destinationPath(path, file) {
    const resolvePath = await this._resolvePath(path, file);
    const isFileExist = await this._isFileExist(resolvePath);

    if (isFileExist) {
      throw new Error(messageList.error.operationFailed);
    }

    return resolvePath;
  }

  async targetPath(path, file) {
    const currentFile = parse(file).base;
    const isPathValid = this._isPathValid(path);

    if (!isPathValid) {
      throw new Error(messageList.error.operationFailed);
    }

    const newPath = await this._resolvePath(this.getCurrentPath(), path);
    const isDir = await this._checkIsDir(newPath);

    if (!isDir) {
      throw new Error(messageList.error.operationFailed);
    }

    return this.destinationPath(newPath, currentFile);
  }
}