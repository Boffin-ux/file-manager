import { createInterface } from 'readline/promises';
import { stdin as input, stdout as output } from 'process';
import { messageList } from './constants/messageList.js';
import { TEXT_COLORS } from './constants/textColors.js';
import { Control } from './commands/control.js';
import { PathConstructor } from './helpers/pathConstructor.js'

export class App {
  constructor(userName) {
    this.state = new PathConstructor();
    this.userName = userName;
    this.readline = createInterface({ input, output });
    this.control = new Control(this.state, this.exit(this.userName));
  }

  _welcome() {
    const startMsg = `Welcome to the File Manager, ${this.userName}!`;
    console.log(TEXT_COLORS.cyan, startMsg);
  }

  exit(userName = this.userName) {
    return () => {
      const finishMsg = `Thank you for using File Manager, ${userName}, goodbye!`;
      console.log(TEXT_COLORS.cyan, finishMsg);
      process.exit();
    }
  }

  async _showMessage(msg) {
    if (msg) {
      console.log(TEXT_COLORS.green, msg);
    }

    const pathMsg = `${messageList.msg.currentPath} ${this.state.getCurrentPath()}`;
    console.log(TEXT_COLORS.yellow, pathMsg);
  }

  async init() {
    this._welcome();
    this._showMessage();

    this.readline.on('line', async (input) => {
      try {
        const data = await this.control.parseInput(input);
        this._showMessage(data);
      } catch (err) {
        console.log(TEXT_COLORS.red, err.message);
      }
    });
    this.readline.resume();
    this.readline.on('close', this.exit());
  }
}