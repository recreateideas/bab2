import React from 'react';
import PropTypes from 'prop-types';

const Button = ({ click, buttonId, value, disabled = false }) => {

    return (
        <button
            className='submitButton'
            onClick={click}
            id={buttonId}
            disabled={disabled}
        >
            <h5>
                {value}
            </h5>
        </button>
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
