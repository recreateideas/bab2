import React from 'react';
import PropTypes from 'prop-types';

const SelectInput = ({valueRange,value = valueRange[0],inputId,className,change,disabled}) => {

    return (
            <select
                id={inputId}
                className={`form-control inputSelect ${className}`}
                onChange={change}
                value={value}
                disabled={disabled}
            >
                {valueRange.map((key, index) => <option key={index} value={key}>{key}</option> )}
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
