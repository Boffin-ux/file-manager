import { cpus, EOL, homedir, arch, userInfo } from 'os';
import { OS_FLAGS } from '../constants/osFlags.js';
import { messageList } from '../constants/messageList.js';

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
    console.log('Overall amount of CPUS:', cpus().length);
  }

  runWithArg(flag) {
    switch (flag) {
      case OS_FLAGS.eol:
        console.log(JSON.stringify(EOL));
        break;

      case OS_FLAGS.homedir:
        console.log('Home directory:', homedir());
        break;

      case OS_FLAGS.username:
        console.log('System user name:', userInfo().username);
        break;

      case OS_FLAGS.arch:
        console.log('CPU architecture:', arch());
        break;

      case OS_FLAGS.cpus:
        this._getCpus();
        break;

      default: throw new Error(messageList.error.operationFailed);
    }
  }
} 