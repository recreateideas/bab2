import React from 'react';
import PropTypes from 'prop-types';

const Button = (props)=>{
    const disabled = props.disabled ? props.disabled : false;
        return (
            <button
            className='submitButton'
            onClick={props.click}
            id={props.buttonId}
            disabled={disabled}
            ><h5>{props.value}</h5></button>
        )
}

Button.propTypes = {
    click: PropTypes.func,
    buttonId: PropTypes.string,
    disabled: PropTypes.string,
    value: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.object
      ]),
};

export default Button;
