import { cpus, EOL, homedir, arch, userInfo } from 'os';
import { OS_FLAGS } from '../constants/osFlags.js';
import { messageList } from '../constants/messageList.js';
import { TEXT_COLORS } from '../constants/textColors.js';

export class SysInfo {
  constructor(pathState) {
    this.path = pathState;
  }

  _getCpus() {
    const coresCpu = cpus().reduce((acc, core, i) => {
      acc[`Core: ${i + 1}`] = { Model: core.model.trim(), Rate: `${core.speed / 1000} GHz` };
      return acc;
    }, {});
    console.table(coresCpu);
    console.log(TEXT_COLORS.magenta, 'Overall amount of CPUS:', cpus().length);
  }

  runWithArg(flag) {
    switch (flag) {
      case OS_FLAGS.eol:
        return JSON.stringify(EOL);

      case OS_FLAGS.homedir:
        return `Home directory: ${homedir()}`;

      case OS_FLAGS.username:
        return `System user name: ${userInfo().username}`;

      case OS_FLAGS.arch:
        return `CPU architecture: ${arch()}`;

      case OS_FLAGS.cpus:
        return this._getCpus();

      default: throw new Error(messageList.error.operationFailed);
    }
  }
} 