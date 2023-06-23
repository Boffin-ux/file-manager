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
        await this.navigation.upControl();
        break;

      case COMMANDS.ls:
        if (args) {
          throw new Error(messageList.error.invalidInput);
        }
        await this.navigation.lsControl();
        break;

      case COMMANDS.cd:
        if (!args || args.length > 1) {
          throw new Error(messageList.error.invalidInput);
        }
        await this.navigation.cdControl(...args);
        break;

      case COMMANDS.hash:
        if (!args || args.length > 1) {
          throw new Error(messageList.error.invalidInput);
        }
        await this.hash.calcHash(...args);
        break;

      case COMMANDS.add:
        if (!args || args.length > 1) {
          throw new Error(messageList.error.invalidInput);
        }
        await this.fs.addFile(...args);
        break;

      case COMMANDS.cat:
        if (!args || args.length > 1) {
          throw new Error(messageList.error.invalidInput);
        }
        await this.fs.cat(...args);
        break;

      case COMMANDS.rm:
        if (!args || args.length > 1) {
          throw new Error(messageList.error.invalidInput);
        }
        await this.fs.removeFile(...args);
        break;

      case COMMANDS.cp:
        if (!args || args.length !== 2) {
          throw new Error(messageList.error.invalidInput);
        }
        await this.fs.copyFile(...args);
        break;

      case COMMANDS.rn:
        if (!args || args.length !== 2) {
          throw new Error(messageList.error.invalidInput);
        }
        await this.fs.renameFile(...args);
        break;

      case COMMANDS.mv:
        if (!args || args.length !== 2) {
          throw new Error(messageList.error.invalidInput);
        }
        await this.fs.moveFile(...args);
        break;

      case COMMANDS.compress:
        if (!args || args.length !== 2) {
          throw new Error(messageList.error.invalidInput);
        }
        await this.brotli.compress(...args);
        break;

      case COMMANDS.decompress:
        if (!args || args.length !== 2) {
          throw new Error(messageList.error.invalidInput);
        }
        await this.brotli.decompress(...args);
        break;

      case COMMANDS.os:
        if (!args || args.length > 1) {
          throw new Error(messageList.error.invalidInput);
        }
        this.sysInfo.runWithArg(...args);
        break;

      case COMMANDS.exit:
        if (args) {
          throw new Error(messageList.error.invalidInput);
        }
        this.exit();
        break;

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