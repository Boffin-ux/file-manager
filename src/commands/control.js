import { messageList } from '../constants/messageList.js';
import { Navigation } from './navigation.js';
import { Hash } from './hash.js';
import { FileSystem } from './fileSystem.js';
import { Brotli } from './brotli.js';
import { SysInfo } from './sysInfo.js';
import { COMMANDS } from '../constants/commands.js';

export class Control {
  constructor(pathState, userName) {
    this.userName = userName;
    this.navigation = new Navigation(pathState);
    this.hash = new Hash(pathState);
    this.fs = new FileSystem(pathState);
    this.brotli = new Brotli(pathState);
    this.sysInfo = new SysInfo(pathState);
  }

  async _runCommand(command, ...args) {
    const checkArgs = args.length > 0 ? args : null;

    switch (command) {
      case COMMANDS.up:
        if (checkArgs) {
          throw new Error(messageList.error.invalidInput);
        }
        await this.navigation.upControl();
        break;

      case COMMANDS.ls:
        if (checkArgs) {
          throw new Error(messageList.error.invalidInput);
        }
        await this.navigation.lsControl();
        break;

      case COMMANDS.cd:
        if (!checkArgs || checkArgs.length > 1) {
          throw new Error(messageList.error.invalidInput);
        }
        await this.navigation.cdControl(...checkArgs);
        break;

      case COMMANDS.hash:
        if (!checkArgs || checkArgs.length > 1) {
          throw new Error(messageList.error.invalidInput);
        }
        await this.hash.calcHash(...checkArgs);
        break;

      case COMMANDS.add:
        if (!checkArgs || checkArgs.length > 1) {
          throw new Error(messageList.error.invalidInput);
        }
        await this.fs.addFile(...checkArgs);
        break;

      case COMMANDS.cat:
        if (!checkArgs || checkArgs.length > 1) {
          throw new Error(messageList.error.invalidInput);
        }
        await this.fs.cat(...checkArgs);
        break;

      case COMMANDS.rm:
        if (!checkArgs || checkArgs.length > 1) {
          throw new Error(messageList.error.invalidInput);
        }
        await this.fs.removeFile(...checkArgs);
        break;

      case COMMANDS.cp:
        if (!checkArgs || checkArgs.length !== 2) {
          throw new Error(messageList.error.invalidInput);
        }
        await this.fs.copyFile(...checkArgs);
        break;

      case COMMANDS.rn:
        if (!checkArgs || checkArgs.length !== 2) {
          throw new Error(messageList.error.invalidInput);
        }
        await this.fs.renameFile(...checkArgs);
        break;

      case COMMANDS.mv:
        if (!checkArgs || checkArgs.length !== 2) {
          throw new Error(messageList.error.invalidInput);
        }
        await this.fs.moveFile(...checkArgs);
        break;

      case COMMANDS.compress:
        if (!checkArgs || checkArgs.length !== 2) {
          throw new Error(messageList.error.invalidInput);
        }
        await this.brotli.compress(...checkArgs);
        break;

      case COMMANDS.decompress:
        if (!checkArgs || checkArgs.length !== 2) {
          throw new Error(messageList.error.invalidInput);
        }
        await this.brotli.decompress(...checkArgs);
        break;

      case COMMANDS.os:
        if (!checkArgs || checkArgs.length > 1) {
          throw new Error(messageList.error.invalidInput);
        }
        this.sysInfo.runWithArg(...checkArgs);
        break;

      case COMMANDS.exit:
        if (checkArgs) {
          throw new Error(messageList.error.invalidInput);
        }
        this.exit(this.userName);
        break;

      default: throw new Error(messageList.error.invalidInput);
    }
  }

  async parseInput(text) {
    const [command, ...args] = text.split(' ');
    if (!text || args.length > 2) {
      throw new Error(messageList.error.invalidInput)
    }
    return await this._runCommand(command, ...args);
  }

  exit(userName) {
    const finishMsg = `Thank you for using File Manager, ${userName}, goodbye!`;
    console.log(finishMsg);
    process.exit();
  }
}