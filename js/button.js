import { Component } from './createElement.js';
import { button } from './constants.js';

const getValue = (buttonConfig, shift, language) => {
  if (language === 'en') {
    if (shift) {
      return buttonConfig.keyShift;
    }
    return buttonConfig.key;
  }
  if (language === 'ru') {
    if (shift) {
      return buttonConfig.keyShift2ndLang;
    }
    return buttonConfig.key2ndLang;
  }
  return null;
};

export default class Button extends Component {
  render() {
    const {
      className,
      buttonConfig,
      onClick,
      shift,
      language,
      onMouseDown,
      onMouseUp,
      isPressed,
    } = this.props;
    const value = typeof buttonConfig === 'string'
      ? buttonConfig
      : getValue(buttonConfig, shift, language);

    return button({
      onMouseDown,
      onMouseUp,
      className: `button ${className} ${isPressed ? 'buttonActive' : ''}`,
      onClick: () => onClick && onClick(value),
    })(value);
  }
}
