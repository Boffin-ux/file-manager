import { homedir } from 'os';

export class State {
  constructor() {
    this.currentPath = homedir();
  }

  getCurrentPath() {
    return this.currentPath;
  }

  setCurrentPath(dir) {
    this.currentPath = dir;
  }
}