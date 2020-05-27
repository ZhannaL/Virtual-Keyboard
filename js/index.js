import Keyboard from './keyboard.js';
import { render } from './createElement.js';

render(new Keyboard(), document.querySelector('body'));
