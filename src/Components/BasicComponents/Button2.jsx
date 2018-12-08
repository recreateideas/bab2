import React from 'react';
import PropTypes from 'prop-types';

const Button2 = ({ addClass, click, buttonId, value, disabled = false }) => {

    return (
        <button
            className={`button2 ${addClass}`}
            onClick={click}
            id={buttonId}
            disabled={disabled}
        >
            <h4>
                {value}
            </h4>
        </button>
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
