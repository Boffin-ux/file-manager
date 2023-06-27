import { messageList } from '../constants/messageList.js';
import { Navigation } from './navigation.js';
import { Hash } from './hash.js';
import { FileSystem } from './fileSystem.js';
import { Brotli } from './brotli.js';
import { SysInfo } from './sysInfo.js';
import { COMMANDS } from '../constants/commands.js';

export class Control {
  constructor(pathState, exitCb) {
    this.navigation = new Navigation(pathState);
    this.hash = new Hash(pathState);
    this.fs = new FileSystem(pathState);
    this.brotli = new Brotli(pathState);
    this.sysInfo = new SysInfo(pathState);
    this.exit = exitCb;
  }

  async _runCommand(command, args) {
    switch (command) {
      case COMMANDS.up:
        if (args) {
          throw new Error(messageList.error.invalidInput);
        }
        return await this.navigation.upControl();

      case COMMANDS.ls:
        if (args) {
          throw new Error(messageList.error.invalidInput);
        }
        return await this.navigation.lsControl();

      case COMMANDS.cd:
        if (!args || args.length > 1) {
          throw new Error(messageList.error.invalidInput);
        }
        return await this.navigation.cdControl(...args);

      case COMMANDS.hash:
        if (!args || args.length > 1) {
          throw new Error(messageList.error.invalidInput);
        }
        return await this.hash.calcHash(...args);

      case COMMANDS.add:
        if (!args || args.length > 1) {
          throw new Error(messageList.error.invalidInput);
        }
        return await this.fs.addFile(...args);

      case COMMANDS.cat:
        if (!args || args.length > 1) {
          throw new Error(messageList.error.invalidInput);
        }
        return await this.fs.cat(...args);

      case COMMANDS.rm:
        if (!args || args.length > 1) {
          throw new Error(messageList.error.invalidInput);
        }
        return await this.fs.removeFile(...args);

      case COMMANDS.cp:
        if (!args || args.length !== 2) {
          throw new Error(messageList.error.invalidInput);
        }
        return await this.fs.copyFile(...args);

      case COMMANDS.rn:
        if (!args || args.length !== 2) {
          throw new Error(messageList.error.invalidInput);
        }
        return await this.fs.renameFile(...args);

      case COMMANDS.mv:
        if (!args || args.length !== 2) {
          throw new Error(messageList.error.invalidInput);
        }
        return await this.fs.moveFile(...args);

      case COMMANDS.compress:
        if (!args || args.length !== 2) {
          throw new Error(messageList.error.invalidInput);
        }
        return await this.brotli.compress(...args);

      case COMMANDS.decompress:
        if (!args || args.length !== 2) {
          throw new Error(messageList.error.invalidInput);
        }
        return await this.brotli.decompress(...args);

      case COMMANDS.os:
        if (!args || args.length > 1) {
          throw new Error(messageList.error.invalidInput);
        }
        return this.sysInfo.runWithArg(...args);

      case COMMANDS.exit:
        if (args) {
          throw new Error(messageList.error.invalidInput);
        }
        return this.exit();

      default: throw new Error(messageList.error.invalidInput);
    }
  }

  async parseInput(text) {
    const [command, ...args] = text.split(' ');

    if (!text || args.length > 2) {
      throw new Error(messageList.error.invalidInput)
    }

    const checkArgs = args.length > 0 ? args : null;
    return await this._runCommand(command, checkArgs);
  }
}