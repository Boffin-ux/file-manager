import { getNameByArg } from './helpers/getNameByArg.js';
import { App } from './app.js';

const fileManager = new App(getNameByArg());
fileManager.init();