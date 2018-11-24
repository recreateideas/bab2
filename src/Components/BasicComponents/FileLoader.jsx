import React from 'react';
import PropTypes from 'prop-types';

const FontAwesome = require('react-fontawesome');


const FileLoader = (props) => {
    return (
        <div className='inline buttonContainer'>
            <label htmlFor={props.inputID}>
                <div className={`${props.addClass}`}>
                    <FontAwesome className={props.iconClass} name={props.buttonIcon} size={props.iconSize} style={{ textShadow: '0 1px 0 rgba(255, 255, 255, 0.7)' }} />
                </div>
            </label>
            <input
                type="file"
                id={props.inputID}
                name={`${props.inputID}`}
                onChange={props.change}
                className='display_none'
                accept={props.fileAccepted}
                encType="multipart/form-data"
            />
        </div>
    )
}

FileLoader.propTypes = {
    inputID: PropTypes.string,
    iconClass: PropTypes.string,
    buttonIcon: PropTypes.string,
    change: PropTypes.func,
    fileAccepted: PropTypes.string,
    verifyFunction :PropTypes.object,
}

export default FileLoader;
