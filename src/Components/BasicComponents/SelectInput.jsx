import React from 'react';
import PropTypes from 'prop-types';

const SelectInput = props => {

    let value = props.value ? props.value : props.valueRange[0];

    return (
            <select
                id={props.inputId}
                className={`form-control inputSelect ${props.className}`}
                onChange={props.change}
                value={value}
                disabled={props.disabled}
            >
                {props.valueRange.map((key, index) => <option key={key} value={key}>{key}</option> )}
            </select>

    )
}

SelectInput.propTypes = {
    inputId: PropTypes.string,
    className: PropTypes.string,
    change: PropTypes.func,
    disabled: PropTypes.bool,
    valueRange: PropTypes.array,
    value: PropTypes.string,
};

export default SelectInput;
