import React from 'react';
import PropTypes from 'prop-types';

const TextInput = props => {
    const fieldType = props.fieldType ? props.fieldType : 'text';
    const display = props.displayField === 'hidden' ? props.displayField : ''; 
    return (
            <input
                ref={props.inputRef}
                id={props.inputId}
                type={fieldType}
                placeholder={props.label}
                onChange={props.change}
                className={`form-control inputText ${props.activeClass} ${display} ${props.addClass}`}
                onMouseOver={props.onHover}
                onMouseOut={props.onOut}
                value={props.value}
                disabled={props.disabled}
                style={{ width: props.inputWidth }}
                autoComplete={props.autoComplete || ''}
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
    onHover: PropTypes.func,
    onOut: PropTypes.func,
    value: PropTypes.string,
    disabled: PropTypes.bool,
    inputWidth: PropTypes.oneOfType([PropTypes.string,PropTypes.number]),
    autoComplete: PropTypes.string,
};

export default TextInput;
