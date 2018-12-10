import React from 'react';
import PropTypes from 'prop-types';

const TypeBox = ({addClass,content,change,keypress}) => {
    return (
        <div className={`textbox ${addClass}`}>
            <textarea
                id='typeBoxInput'
                value={content}
                onChange={change}
                onKeyPress={keypress}
            >{content}</textarea>
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
