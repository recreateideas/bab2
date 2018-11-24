import React from 'react';
import PropTypes from 'prop-types';

const IsActive = (props) => {
    let checked;
    // const defaultChecked = (typeof props.defaultChecked  ==='boolean' ? props.defaultChecked : true);
    if (typeof props.checked === 'boolean'){
        checked = props.checked;
    }
    return (
        <label className={props.className}>
            <input
                id={props.inputId}
                type="checkbox"
                name={props.inputId}
                value={props.inputId}
                onChange={props.change}
                checked={checked}
                // defaultChecked={props.defaultChecked}
            />
            <span className={`${props.spanClass || ''} checkmark`}></span>
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
