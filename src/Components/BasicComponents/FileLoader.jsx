import React from 'react';
import PropTypes from 'prop-types';

const FontAwesome = require('react-fontawesome');


const FileLoader = ({inputID,addClass,iconClass,buttonIcon,iconSize,change,fileAccepted}) => {

    return (
        <div className='inline buttonContainer'>
            <label htmlFor={inputID}>
                <div className={`${addClass}`}>
                    <FontAwesome className={iconClass} name={buttonIcon} size={iconSize} style={{ textShadow: '0 1px 0 rgba(255, 255, 255, 0.7)' }} />
                </div>
            </label>
            <input
                type="file"
                id={inputID}
                name={`${inputID}`}
                onChange={change}
                className='display_none'
                accept={fileAccepted}
                encType="multipart/form-data"
            />
        </div>
    )
}

FileLoader.propTypes = {
    inputID: PropTypes.string,
    addClass: PropTypes.string,
    iconClass: PropTypes.string,
    buttonIcon: PropTypes.string,
    change: PropTypes.func,
    fileAccepted: PropTypes.string,
    verifyFunction :PropTypes.object,
}

export default FileLoader;
