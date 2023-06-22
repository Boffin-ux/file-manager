import { messageList } from '../constants/messageList.js';
import { Navigation } from './navigation.js';
import { COMMANDS } from '../constants/commands.js';

export class Control {
  constructor(pathState, userName) {
    this.userName = userName;
    this.navigation = new Navigation(pathState);
  }

  exit(userName) {
    const finishMsg = `Thank you for using File Manager, ${userName}, goodbye!`;
    console.log(finishMsg);
    process.exit();
  }

  async parseInput(text) {
    const [command, ...args] = text.split(' ');
    if (!text || args.length > 2) {
      throw new Error(messageList.error.invalidInput)
    }
    return await this.runCommand(command, ...args);
  }

  async runCommand(command, ...args) {
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

      case COMMANDS.exit:
        if (checkArgs) {
          throw new Error(messageList.error.invalidInput);
        }
        this.exit(this.userName);
        break;

      default: throw new Error(messageList.error.invalidInput);
    }
  }
}