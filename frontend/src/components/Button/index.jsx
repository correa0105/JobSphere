import React from 'react';
import PropTypes from 'prop-types';

import { ButtonStyle } from './styled';

export default function Button({ text, ...rest }) {
  return <ButtonStyle {...rest}>{text}</ButtonStyle>;
}

Button.propTypes = {
  text: PropTypes.string.isRequired,
};
