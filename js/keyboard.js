import {
  Component, createRef,
} from './createElement.js';
import {
  span, div, textarea, nums, letters1, letters2, letters3,
} from './constants.js';
import Button from './button.js';

const initLanguage = localStorage.getItem('language') || '';
localStorage.setItem('language', initLanguage);

const createButtons = (array, keyBoardState, onClick) => array.map(
  (el) => new Button({
    onClick,
    buttonConfig: el,
    isPressed: keyBoardState.keyStates[el.keyCode],
    ...keyBoardState,
  }),
);

const cursorPosition = (textareaElement) => textareaElement?.selectionStart ?? 0;

export default class Keyboard extends Component {
  state = {
    shift: false,
    language: localStorage.getItem('language') || 'en',
    value: '',
    keyStates: {},
    caps: false,
  };

  textarea = createRef();

  constructor(props) {
    super(props);
    this.setState({});
  }

  componentDidMount() {
    document.addEventListener('keydown', (event) => {
      if (
        (event.key === 'Alt' && event.ctrlKey)
        || (event.key === 'Control' && event.altKey)
      ) {
        this.changeLanguage();
      }
    });
    document.addEventListener('keydown', (event) => {
      this.setState({ keyStates: { ...this.state.keyStates, [event.code]: true } });
    });
    document.addEventListener('keyup', (event) => {
      this.setState({ keyStates: { ...this.state.keyStates, [event.code]: false } });
    });

    document.addEventListener('keydown', (event) => {
      if (event.code === 'ArrowRight') {
        this.addLetter('→');
      }
      if (event.code === 'ArrowLeft') {
        this.addLetter('←');
      }
      if (event.code === 'ArrowUp') {
        this.addLetter('↑');
      }
      if (event.code === 'ArrowDown') {
        this.addLetter('↓');
      }
    });

    document.addEventListener('keydown', (event) => {
      if (event.code === 'ShiftRight' || event.code === 'ShiftLeft') {
        this.setState({ shift: !this.state.shift });
      }
    });
    document.addEventListener('keyup', (event) => {
      if (event.code === 'ShiftRight' || event.code === 'ShiftLeft') {
        this.setState({ shift: !this.state.shift });
      }
    });

    document.addEventListener('keydown', (event) => {
      if (event.code === 'CapsLock') {
        this.setState({ shift: !this.state.shift });
      }
    });

    document.addEventListener('keyup', (event) => {
      if (event.code === 'CapsLock') {
        this.setState({ caps: !this.state.caps });
      }
    });
  }

  addLetter = (value) => {
    this.textarea.current.focus();
    const currentValue = this.textarea.current.value;
    let position = cursorPosition(this.textarea.current);
    if (position === 0) {
      position = currentValue.length;
    }
    const modified = currentValue.split('');
    modified.splice(position, 0, value);
    const newStr = modified.join('');
    this.setState({
      value: newStr,
    });
    this.textarea.current.selectionStart += 1;
    this.textarea.current.selectionEnd = this.textarea.current.selectionStart;
  };

  changeShift = () => {
    this.setState({ shift: !this.state.shift });
  };

  changeLanguage = () => {
    localStorage.setItem('language', this.state.language === 'en' ? 'ru' : 'en');
    this.setState({ language: this.state.language === 'en' ? 'ru' : 'en' });
    // console.log(localStorage, this.state.language);
  };

  delete = () => {
    this.textarea.current.focus();
    const currentValue = this.textarea.current.value;
    const position = cursorPosition(this.textarea.current);
    const modified = currentValue.split('');
    modified.splice(position, 1);
    const newStr = modified.join('');
    this.setState({
      value: newStr,
    });
  }

  backspace = () => {
    this.textarea.current.focus();
    const currentValue = this.textarea.current.value;
    let position = cursorPosition(this.textarea.current);
    this.textarea.current.selectionStart -= 1;
    this.textarea.current.selectionEnd = this.textarea.current.selectionStart;
    if (position === 0) {
      position = currentValue.length;
    }
    const modified = currentValue.split('');
    modified.splice(position - 1, 1);
    const newStr = modified.join('');

    this.setState({
      value: newStr,
    });
  };

  render() {
    const {
      value, shift, language, keyStates, caps,
    } = this.state;

    const keyBoardState = { shift, language, keyStates };
    return div({ className: 'virtualKeyboard' })([
      textarea({
        className: 'textarea',
        cols: 100,
        rows: 10,
        autofocus: true,
        value,
        ref: this.textarea,
        onChange: () => this.setState({ value: this.textarea.current.value }),
      })(),

      div({ className: 'keyboard' })([
        div({ className: 'row' })([
          ...createButtons(nums, keyBoardState, this.addLetter),
          new Button({
            buttonConfig: '⟸',
            className: 'fnButton backspace',
            onClick: () => this.backspace(),
            ...keyBoardState,
          }),
        ]),
        div({ className: 'row' })([
          new Button({
            buttonConfig: '⭾ TAB',
            className: 'fnButton tab',
            onClick: () => this.addLetter('\t'),
            ...keyBoardState,
            isPressed: keyStates.Tab,
          }),
          ...createButtons(letters1, keyBoardState, this.addLetter),
          new Button({
            buttonConfig: 'DEL',
            className: 'fnButton delete',
            onClick: () => this.delete(),
            ...keyBoardState,
            isPressed: keyStates.Delete,
          }),
        ]),
        div({ className: 'row' })([
          new Button({
            buttonConfig: 'CAPSLOCK',
            className: 'fnButton capslock',
            onClick: () => {
              this.changeShift();
              this.setState({
                keyStates: {
                  ...this.state.keyStates, CapsLock: this.state.shift,
                },
                caps: !this.state.caps,
              });
            },
            ...keyBoardState,
            isPressed: keyStates.CapsLock || caps,
          }),
          ...createButtons(letters2, keyBoardState, this.addLetter),
          new Button({
            buttonConfig: 'ENTER ↲',
            className: 'fnButton enter',
            onClick: () => this.addLetter('\n'),
            ...keyBoardState,
            isPressed: keyStates.Enter,
          }),
        ]),
        div({ className: 'row' })([
          new Button({
            buttonConfig: 'SHIFT',
            className: 'fnButton shift',
            onMouseDown: () => this.setState({ shift: !this.state.shift }),
            onMouseUp: () => this.setState({ shift: !this.state.shift }),
            ...keyBoardState,
            isPressed: keyStates.ShiftLeft,
          }),
          ...createButtons(letters3, keyBoardState, this.addLetter),
          new Button({
            buttonConfig: '↑',
            className: 'fnButton arrow',
            onClick: () => this.addLetter('↑'),
            ...keyBoardState,
            isPressed: keyStates.ArrowUp,
          }),
          new Button({
            buttonConfig: 'SHIFT',
            className: 'fnButton shift',
            onMouseDown: () => this.setState({ shift: !this.state.shift }),
            onMouseUp: () => this.setState({ shift: !this.state.shift }),
            ...keyBoardState,
            isPressed: keyStates.ShiftRight,
          }),
        ]),
        div({ className: 'row' })([
          new Button({
            buttonConfig: 'CTRL',
            className: 'fnButton ctrl',
            ...keyBoardState,
            isPressed: keyStates.ControlLeft,
          }),
          new Button({
            buttonConfig: 'FN',
            className: 'fnButton fn',
            onClick: () => this.changeLanguage(),
            ...keyBoardState,
          }),
          new Button({
            buttonConfig: 'ALT',
            className: 'fnButton alt',
            ...keyBoardState,
            isPressed: keyStates.AltLeft,
          }),
          new Button({
            buttonConfig: ' ',
            className: 'fnButton space',
            onClick: () => this.addLetter(' '),
            ...keyBoardState,
            isPressed: keyStates.Space,
          }),
          new Button({
            buttonConfig: 'ALT',
            className: 'fnButton alt',
            ...keyBoardState,
            isPressed: keyStates.AltRight,
          }),
          new Button({
            buttonConfig: '←',
            className: 'fnButton arrow',
            onClick: () => this.addLetter('←'),
            ...keyBoardState,
            isPressed: keyStates.ArrowLeft,
          }),
          new Button({
            buttonConfig: '↓',
            className: 'fnButton arrow',
            onClick: () => this.addLetter('↓'),
            ...keyBoardState,
            isPressed: keyStates.ArrowDown,
          }),
          new Button({
            buttonConfig: '→',
            className: 'fnButton arrow',
            onClick: () => this.addLetter('→'),
            ...keyBoardState,
            isPressed: keyStates.ArrowRight,
          }),
          new Button({
            buttonConfig: 'CTRL',
            className: 'fnButton ctrl',
            ...keyBoardState,
            isPressed: keyStates.ControlRight,
          }),
        ]),
      ]),
      div({ className: 'text' })([
        span()(
          'Keyboard created in Linux OS',
        ), span()(
          'The keys for changing the language (RUS - ENG): Alt + Ctrl or FN',
        )]),
    ]);
  }
}
