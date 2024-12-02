import React from 'react';
import PropTypes from 'prop-types';

import { LabelContainer } from './styled';

export default function Input({ text, onChange, ...rest }) {
  return (
    <LabelContainer {...rest} htmlFor={rest.id}>
      <span {...rest}>{text}</span>
      <input
        onChange={onChange}
        type={rest.type}
        name={rest.name}
        placeholder={rest.placeholder}
        {...rest}
      />
    </LabelContainer>
  );
}

Input.propTypes = {
  text: PropTypes.string.isRequired,
  onChange: PropTypes.func,
};

Input.defaultProps = {
  onChange: null,
};
