import React from 'react';
import PropTypes from 'prop-types';

import { TitleContainer } from './styled';

export default function Title({ text }) {
  return <TitleContainer>{text}</TitleContainer>;
}

Title.propTypes = {
  text: PropTypes.string.isRequired,
};
