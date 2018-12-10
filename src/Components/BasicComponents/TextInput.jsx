import React from 'react';
import PropTypes from 'prop-types';

const TextInput = ({fieldType = 'text',displayField,inputRef,inputId,label,change,activeClass,addClass,onHover,onOut,value,disabled,inputWidth,autoComplete = ''}) => {

    return (
            <input
                ref={inputRef}
                id={inputId}
                type={fieldType}
                placeholder={label}
                onChange={change}
                className={`form-control inputText ${activeClass} ${displayField} ${addClass}`}
                onMouseOver={onHover}
                onMouseOut={onOut}
                value={value}
                disabled={disabled}
                style={{ width: inputWidth }}
                autoComplete={autoComplete}
            />
    )
}

TextInput.propTypes = {
    inputRef: PropTypes.string,
    inputId: PropTypes.string,
    label: PropTypes.string,
    fieldType: PropTypes.string,
    displayField: PropTypes.string,
    change: PropTypes.func,
    activeClass: PropTypes.string,
    addClass: PropTypes.string,
    onHover: PropTypes.func,
    onOut: PropTypes.func,
    value: PropTypes.string,
    disabled: PropTypes.bool,
    inputWidth: PropTypes.oneOfType([PropTypes.string,PropTypes.number]),
    autoComplete: PropTypes.string,
};

export default TextInput;
