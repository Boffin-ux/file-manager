import { createInterface } from 'readline/promises';
import { stdin as input, stdout as output } from 'process';
import { messageList } from './constants/messageList.js';
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
    console.log(startMsg);
  }

  exit(userName = this.userName) {
    return () => {
      const finishMsg = `Thank you for using File Manager, ${userName}, goodbye!`;
      console.log(finishMsg);
      process.exit();
    }
  }

  async _showMessage(msg) {
    if (msg) {
      return this.readline.output.write(`${msg}\n`);
    }
    const pathMsg = `${messageList.msg.currentPath} ${this.state.getCurrentPath()}`;
    this.readline.output.write(`${pathMsg}\n`);
  }

  async init() {
    try {
      this._welcome();
      this._showMessage();
    } catch (err) {
      this.readline.output.write(err.message);
    }

    this.readline.on('line', async (input) => {
      try {
        const data = await this.control.parseInput(input);
        this.showMessage(data);
      } catch (err) {
        this.readline.output.write(`${err.message}\n`);
      }
    });
    this.readline.resume();
    this.readline.on('close', this.exit());
  }
}