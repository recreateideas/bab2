import React from 'react';
import PropTypes from 'prop-types';

const IsActive = ({checked,className,spanClass,inputId,change}) => {

    return (
        <label className={className}>
            <input
                id={inputId}
                type="checkbox"
                name={inputId}
                value={inputId}
                onChange={change}
                checked={typeof checked === 'boolean' ? checked : true}
            />
            <span className={`${spanClass || ''} checkmark`}></span>
        </label>
    )
}

IsActive.propTypes = {
    inputId: PropTypes.string,
    change: PropTypes.func,
    checked: PropTypes.bool,
    spanClass: PropTypes.string,
    className: PropTypes.string,
}

export default IsActive;
