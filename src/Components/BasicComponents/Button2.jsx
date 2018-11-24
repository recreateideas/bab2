import React from 'react';
import PropTypes from 'prop-types';

const Button2 = (props)=>{
    const disabled = props.disabled ? props.disabled : false;
        return (
            <button
            className={`button2 ${props.addClass}`}
            onClick={props.click}
            id={props.buttonId}
            disabled={disabled}
            ><h4>{props.value}</h4></button>
        )
}

Button2.propTypes = {
    click: PropTypes.func,
    buttonId: PropTypes.string,
    disabled: PropTypes.string,
    value: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.object
      ]),
};

export default Button2;
