import React from 'react';
import {
  exact,
  number,
  string,
  func
} from 'prop-types';

const NumberInput = ({
  max,
  value,
  classNames,
  onChange,
  disabled
}) => (
  <input
    type="number"
    min={1}
    max={max}
    value={value}
    disabled={disabled}
    className={`input number-input ${classNames}`}
    onChange={onChange}
  />
);

NumberInput.propTypes = exact({
  max: number.isRequired,
  value: string.isRequired,
  classNames: string,
  onChange: func.isRequired
}).isRequired;

NumberInput.defaultProps = {
  classNames: '',
  disabled: false
};

export default NumberInput;
