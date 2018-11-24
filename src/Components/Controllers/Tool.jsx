import React from 'react';
import { FileLoader } from '../BasicComponents';
import PropTypes from 'prop-types';

const FontAwesome = require('react-fontawesome');

class Tool extends React.Component {

    // constructor(props) {
    //     super(props);
    //     let files;
    // }

    displayUploadedFile(file, index) {
        return (
            <li key={index}>
                <div>
                    <div>
                        <div className='success uploaded'>Uploaded:</div><br />
                        <div className='fileDetails'>
                            <p className='h9'>
                                <strong>{file.name}</strong><br />
                                {file.type || 'n/a'} - {file.size}kb,<br />
                                date created: {file.lastModifiedDate ? file.lastModifiedDate.toLocaleDateString() : file.lastModified ? file.lastModified : 'n/a'}<br />
                            </p>
                        </div>
                    </div>
                    <div>
                        {/*close button*/}
                        {/*confirm/choose button*/}
                    </div>
                </div>
            </li>
        );
    }
    render() {
        let field, display, displaySuccess;
        if (this.props.uploadedFiles) {
            this.files = this.props.uploadedFiles;
            display = 'block';
            if (this.props.uploadedFiles.length > 0) {
                displaySuccess = 'block';
            }
        } else {
            this.files = [];
            display = 'hidden';
            displaySuccess = 'hidden'
        }

        switch (this.props.toolType) {
            case 'inputFile':
                field = (
                    <FileLoader
                        buttonIcon={this.props.buttonIcon}
                        iconClass='toolIcon'
                        inputID={this.props.inputID}
                        change={this.props.change}
                        fileAccepted='.bab'
                        addClass={'buttonIcon'}
                    />
                )
                break;
            case 'simple':
            default:
                field = (
                    <div className='inline buttonContainer'>
                        <div className='buttonIcon' onClick={this.props.click}>
                            <FontAwesome className='toolIcon' name={this.props.buttonIcon} /*size='3x' spin*/ style={{ textShadow: '0 1px 0 rgba(255, 255, 255, 0.7)' }} />
                        </div>
                    </div>
                )
                break;
        }
        return (
            <div id={this.props.toolId} className='inline'>
                {field}
                <div className='inline'>
                    <p className='h8'>{this.props.description}</p>
                </div>

                <div id={this.props.toolContainerID} className={`${this.props.classTool} ${display}`}><ul id='fileList'>{this.files.map((file, index) => this.displayUploadedFile(file, index))}</ul></div>
                <div className={`${this.props.toolContainerID}IndicatorWrapper toolIndicatorStatus`}>
                    <FontAwesome name='check-circle' size='2x' /*spin*/ className={`${this.props.inputID}Icon ${displaySuccess}`} id={`${this.props.toolContainerID}Indicator`} />
                </div>

            </div>
        )
    }
}

Tool.propTypes = {
    uploadedFiles: PropTypes.array,
    toolType: PropTypes.string,
    buttonIcon: PropTypes.string,
    inputID: PropTypes.string,
    change: PropTypes.func,
    click: PropTypes.func,
    toolContainerID: PropTypes.string,
    description: PropTypes.string,
    classTool: PropTypes.string,
};

export default Tool;
