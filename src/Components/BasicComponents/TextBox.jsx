import React from 'react';
import PropTypes from 'prop-types';

const TypeBox = (props) => {
    return (
        <div className={`textbox ${props.addClass}`}>
            <textarea
                id='typeBoxInput'
                value={props.content}
                onChange={props.change}
                onKeyPress={props.keypress}
            >{props.content}</textarea>
        </div>
    )
};

TypeBox.propTypes = {
    addClass: PropTypes.string,
    textboxClass: PropTypes.string,
    content: PropTypes.string,
    change: PropTypes.func,
    keypress: PropTypes.func,
}

export default TypeBox;
