import { readdir } from 'fs/promises';
import { messageList } from '../constants/messageList.js';

export class Navigation {
  constructor(pathState) {
    this.path = pathState;
  }

  async upControl() {
    try {
      await this.path.setPath(this.path.getCurrentPath(), '..');
    } catch (err) {
      throw new Error(messageList.error.operationFailed);
    }
  }

  async cdControl(dir) {
    try {
      await this.path.setPath(this.path.getCurrentPath(), dir);
    } catch (err) {
      throw new Error(messageList.error.operationFailed);
    }
  }

  async lsControl() {
    const content = await readdir(this.path.getCurrentPath(), { withFileTypes: true });
    const sortContent = content.sort((a, b) => a.isFile() - b.isFile());

    const result = sortContent.reduce((acc, el) => {
      if (el.isDirectory() || el.isFile()) {
        acc.push({ Name: el.name, Type: el.isDirectory() ? 'directory' : 'file' });
      }
      return acc;
    }, [])

    console.table(result);
  }
}