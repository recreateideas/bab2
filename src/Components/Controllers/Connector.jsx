import React from 'react';
import PropTypes from 'prop-types';
import { TextInput, FileLoader, ConnectionNamePopup } from '../../Components';
import { mapStateToProps, mapDispatchToProps } from '../../store/mapToProps/mapToProps_Connector';
import { connect } from 'react-redux';
import { Grid, Row, Col } from 'react-bootstrap';
import axios from 'axios';
import { validateFile, validateContent } from '../../tools/fileManagers';
import { dbDisconnect, dbConnect, updateUserField } from '../../tools/DBClientUtils/DBClientUtils';
import ReactTooltip from 'react-tooltip';
import 'regenerator-runtime';
import 'babel-polyfill';

const FontAwesome = require('react-fontawesome');

class Connector extends React.Component {
    // sshKey;
    constructor(props) {
        super(props);
        this.state = {
            sf: [],
            displayPopup: false,
            titleValidation: true,
            connectionEditedName: '',
        };
    }

    throwErrors(err) {
        if (err) {
            console.log(err)
            throw new Error(err);
        }
    }

    mapToArray(object, label) {
        let array = [];
        Object.keys(object).forEach(key => {
            Object.keys(object[key])
                .filter(name => name === label)
                .map(name => array.push(object[key][name]))
        })
        return array;
    }

    recordConnectionParams(e) {
        // console.log(e.target.id);
        const value = e.target.value;
        this.props.setConnectionParametersToStore(e.target.id, value);
    }

    toggleDBSwitch(e) {
        const isUserLoggedIn = this.props.storeUserLoggedIn;
        const connect = e.target.checked;
        //add user login check
        switch (connect) {
            case true:
                if (isUserLoggedIn/* && check permissions*/) {
                    dbConnect(e, this);
                    updateUserField({
                        user: this.userDetails(),
                        data: {
                            lastConnectionTime: new Date()
                        }
                    }, this)
                } else {
                    this.props.setConnectionParametersToStore('connectionStatus', 'LoggedOut');
                    this.props.setConnectionParametersToStore('connectionMessage', 'Almost! (you need to be logged in to access your databases.)');
                }
                break;
            default:
                // this.dbDisconnect(e);
                this.props.setResultsToStore([]);
                dbDisconnect(e, this);
                break;
        }
    }

    userDetails() {
        return {
            _id: this.props.storeUser.ID,
            email: this.props.storeUser.loginEmail,
        }
    }

    displayUploadedFile(file, index) {
        return (
            <div key={index} id='fileList' className='sshWrapper'>
                <div className='success uploaded'>Uploaded:</div>
                <div className='sshDetails'>
                    <p className='h9'>
                        <strong>{file.name}</strong>{/* , size: {file.size}kb */}
                    </p>
                </div>

                <div>
                    {/*close button*/}
                </div>
            </div>
        )
    }

    handleFilesSelect(e) {
        const files = e.target.files; // FileList object

        [...files].forEach(file => {
            if (validateFile(file, { maxSize: 4, excludeFormat: '[.*]+' })) { //validateContent
                const reader = new FileReader();
                reader.onload = () => {
                    let sshKey = reader.result;
                    if (validateContent(sshKey, 'sshKey')) { //validateContent
                        this.props.setConnectionParametersToStore('sshFile', sshKey);
                        this.props.setConnectionParametersToStore('sshMode', 'file');
                        this.sendFileToService(file);
                        this.saveFileToState(file);
                    }
                };
                reader.readAsText(file);
            }
        });
        e.target.value = '';
    }

    async sendFileToService(file) {
        console.log(file);
        let data = new FormData();
        data.append('file', file);
        data.append('name', 'id_rsa');
        data.append('user', 'baboonUser11');
        await axios.post(`/files`, data);
    }

    saveFileToState(file) {
        let output = [];
        output.push({
            name: file.name,
            size: Math.round(file.size * 0.001),
        })
        this.setState({
            message: '',
            error: '',
            sf: output
        })
    }

    validateFilePath(e) {
        this.props.setConnectionParametersToStore('sshPath', e.target.value);
    }

    togglePath() {
        const sshMode = this.props.storeConnection.sshMode;
        const toggledMode = sshMode === 'file' ? 'path' : 'file';
        this.props.setConnectionParametersToStore('sshMode', toggledMode);
    }

    deleteSshFile() {
        this.props.setConnectionParametersToStore('sshFile', '');
        this.setState({
            sf: []
        })
    }

    togglePopup() {
        const isPopupDisplayed = this.state.displayPopup;
        const connectionTitle = this.props.storeConnection.label || '';
        this.setState({
            connectionEditedName: connectionTitle,
            displayPopup: !isPopupDisplayed
        });
    }

    closePopup(e) {
        e.preventDefault();
        e.stopPropagation();
        this.setState({
            displayPopup: false,
        });
    }

    saveConnectionName() {
        const connectionName = this.state.connectionEditedName;
        if(connectionName && connectionName !== ''){
            const connectionParams = this.props.storeConnection;
            const customId = this.props.storeUser.customId;
            let savedConnections = localStorage.getItem('savedConnections') ? JSON.parse(localStorage.getItem('savedConnections')) : {};
            if (!savedConnections[customId]) {
                savedConnections[customId] = {};
            }
            savedConnections[customId][connectionName] = connectionParams;
            savedConnections[customId][connectionName].label = connectionName;
            savedConnections[customId][connectionName].timeStamp = +new Date();
            localStorage.setItem('savedConnections',JSON.stringify(savedConnections));
            this.props.setSavedConnectionsToStore(savedConnections[customId]);
            this.setState({
                connectionEditedName: '',
                titleValidation: true,
                displayPopup: false
            });
        } else {
            this.setState({titleValidation: false,});
        }
    }

    editConnectionName(e) {
        const value = e.target.value;
        if(value && value !== ''){
            this.setState({
                titleValidation: true,
                connectionEditedName: value,
            });
        } else {
            this.setState({
                titleValidation: false,
                connectionEditedName: value,
            });
        }
    }

    render() {
        const sshMode = this.props.storeConnection.sshMode;
        let displaySSHMessage;
        let displaySSHFile = sshMode === 'file' ? 'show' : 'hidden';
        if (this.state.sf.length > 0 && sshMode === 'file') {
            this.files = this.state.sf;
            displaySSHFile = 'show';
            displaySSHMessage = 'hidden'
        } else if (this.state.sf.length === 0 && sshMode === 'file') {
            this.files = [];
            displaySSHFile = 'hidden';
            displaySSHMessage = 'show'
        } else if (sshMode === 'path') {
            displaySSHMessage = 'hidden'
        } else {
            displaySSHMessage = 'show'
        }
        const displayField = sshMode === 'file' ? 'hidden' : 'show';
        const enableInput = this.props.storeConnection.isDBConnected === false || this.props.storeConnection.isDBConnected === undefined ? '' : 'inActiveDB';
        const enableButtonEvents = this.props.storeConnection.isDBConnected === false || this.props.storeConnection.isDBConnected === undefined ? '' : 'removeEvents';
        const connectionLabel = this.props.storeConnection.label && this.props.storeUser.loggedIn ? this.props.storeConnection.label : '';
        const titleValidationClass = this.state.titleValidation ? '' : 'not_validField';
        return (
            <div id='connectorContainer' className='featureContainer'>
                <div className='connectorTitle'>
                    <FontAwesome name='database' size='4x' style={{ textShadow: '0 1px 0 #d6d6df' }} />
                    <div id='connectionTitle'><h4>{connectionLabel}</h4></div>
                </div>
                <div id='saveConnectionWrap'>
                    <ConnectionNamePopup
                       display={this.state.displayPopup}
                       closePopup={this.closePopup.bind(this)}
                       onSave={this.saveConnectionName.bind(this)}
                       onChange={this.editConnectionName.bind(this)}
                       connectionEditedName={this.state.connectionEditedName}
                       addClass={titleValidationClass}
                    />
                    <FontAwesome id='saveConnection' name='save' size='2x' className={`iconButton`} alt='saveConnection' data-tip data-for='tooltip_saveConnection' onClick={this.togglePopup.bind(this)} />
                    <ReactTooltip id='tooltip_saveConnection' type='warning'>
                        <span>Save connection params</span>
                    </ReactTooltip>
                </div>
                <form autoComplete="off" id='connectorForm'>
                    <Grid bsClass='keystable contentTable appContent'>
                        <Row className='connectorRow'>
                            <Col xs={12} sm={5}>
                                <TextInput
                                    inputId={'remoteHostName'}
                                    change={this.recordConnectionParams.bind(this)}
                                    value={this.props.storeConnection.remoteHostName || ''}
                                    label={'Remote Host IP Address/Name...'}
                                    activeClass={enableInput}
                                    disabled={this.props.storeConnection.isDBConnected}
                                />
                            </Col>
                            <Col xs={12} sm={7}>
                                <p className='h7'>Remote Host IP Address/Name</p>
                            </Col>
                        </Row>
                        <Row className='connectorRow'>
                            <Col xs={12} sm={5}>
                                <TextInput
                                    inputId={'remoteMongoInstance'}
                                    change={this.recordConnectionParams.bind(this)}
                                    value={this.props.storeConnection.remoteMongoInstance || ''}
                                    label={'Remote Mongo Instance...'}
                                    activeClass={enableInput}
                                    disabled={this.props.storeConnection.isDBConnected}
                                />
                            </Col>
                            <Col xs={12} sm={7}>
                                <p className='h7'>Remote Mongo Instance Name <span>(default: mongodb)</span></p>
                            </Col>
                        </Row>
                        <Row className='connectorRow'>
                            <Col xs={12} sm={5}>
                                <TextInput
                                    inputId={'remoteMongoPort'}
                                    change={this.recordConnectionParams.bind(this)}
                                    value={this.props.storeConnection.remoteMongoPort || ''}
                                    label={'Remote Mongo Port...'}
                                    activeClass={enableInput}
                                    disabled={this.props.storeConnection.isDBConnected}
                                    inputWidth={70}
                                />
                            </Col>
                            <Col xs={12} sm={7}>
                                <p className='h7'>Remote Mongo Port <span>(default: 27017)</span></p>
                            </Col>
                        </Row>
                        {/* <Row className='connectorRow'>
                            <Col xs={12} sm={5}> <TextInput
                                    inputId={'proxyServer'}
                                    change={this.recordConnectionParams.bind(this)}
                                    value={this.props.storeConnection.proxyServer || ''}
                                    label={'proxy server IP...'}
                                    activeClass={enableInput}
                                    disabled={this.props.storeConnection.isDBConnected}
                                />
                            </Col>
                            <Col xs={12} sm={7}>
                                <p className='h7'>Proxy IP</p>
                            </Col>
                        </Row>
                        <Row className='connectorRow'>
                            <Col xs={12} sm={5}>
                                <TextInput
                                    inputId={'proxyPort'}
                                    change={this.recordConnectionParams.bind(this)}
                                    value={this.props.storeConnection.proxyPort || ''}
                                    label={'Port..'}
                                    activeClass={enableInput}
                                    disabled={this.props.storeConnection.isDBConnected}
                                    inputWidth={70}
                                />
                            </Col>
                            <Col xs={12} sm={7}>
                                <p className='h7'>Proxy Port</p>
                            </Col>
                        </Row> */}
                        {/* <Row className='connectorRow'><Col xs={12} sm={5}><p className='h7'>MongoDB HostName</p></Col><Col xs={12} sm={7}></Col></Row>
                        <Row className='connectorRow'><Col xs={12} sm={5}><p className='h7'>MongoDB Server port</p></Col><Col xs={12} sm={7}></Col></Row> */}
                        <Row className='connectorRow'>
                            <Col xs={12} sm={5} id='sshCol' className={enableButtonEvents}>
                                <FileLoader
                                    buttonIcon='key'
                                    iconClass='displaySSHIcon'
                                    inputID='uploadSSHKey'
                                    change={this.handleFilesSelect.bind(this)}
                                    disabled={this.props.storeConnection.isDBConnected}
                                />
                                <div className='sshFilePath buttonIcon' onClick={this.togglePath.bind(this)}>
                                    <FontAwesome className='displaySSHIcon' name='italic' style={{ textShadow: '0 1px 0 rgba(255, 255, 255, 0.7)' }} />
                                </div>
                                <TextInput
                                    inputId={'sshPath'}
                                    change={this.validateFilePath.bind(this)}
                                    value={this.props.storeConnection.sshPath || ''}
                                    label={'Path to remote file...'}
                                    activeClass={enableInput}
                                    disabled={this.props.storeConnection.isDBConnected}
                                    inputWidth={'auto'}
                                    displayField={displayField}
                                />
                                <div className={`noFileUploaded ${displaySSHMessage} `}><p className='h7'>No SSH key provided</p></div>
                                <div id='sshFileWrapper' className={`fileList uploadedFilesContainer ${displaySSHFile}`}>{this.files.map((file, index) => this.displayUploadedFile(file, index))}</div>
                                <div className={`deleteSshFileWrapper ${displaySSHFile}`} onClick={this.deleteSshFile.bind(this)}>
                                    <FontAwesome className='deleteSSHIcon' name='times-circle' />
                                </div>
                            </Col>
                            <Col xs={12} sm={7}><p className='h7'>SSH Private Key</p></Col>
                        </Row>

                        <Row className='connectorRow'>
                            <Col xs={12} sm={5}>
                                <TextInput
                                    inputId={'remoteMongoUser'}
                                    change={this.recordConnectionParams.bind(this)}
                                    value={this.props.storeConnection.remoteMongoUser || ''}
                                    label={'Username...'}
                                    activeClass={enableInput}
                                    disabled={this.props.storeConnection.isDBConnected}
                                // inputWidth={70}
                                />
                            </Col>
                            <Col xs={12} sm={7}>
                                <p className='h7'>DB Username</p>
                            </Col>
                        </Row>
                        <Row className='connectorRow'>
                            <Col xs={12} sm={5}>
                                <TextInput
                                    inputId={'remoteUserPassword'}
                                    change={this.recordConnectionParams.bind(this)}
                                    value={this.props.storeConnection.remoteUserPassword || ''}
                                    label={'User password...'}
                                    activeClass={enableInput}
                                    disabled={this.props.storeConnection.isDBConnected}
                                    fieldType={'password'}
                                    autoComplete='current-password'
                                />
                            </Col>
                            <Col xs={12} sm={7}><p className='h7'>DB User password</p></Col>
                        </Row>
                        <Row className='connectorRow'><Col xs={12} sm={6}><p className='h7'>SSH Username</p></Col><Col xs={12} sm={6}></Col></Row>
                        <Row className='connectorRow'>
                            <Col xs={12} sm={5}>
                                <TextInput
                                    inputId={'db'}
                                    change={this.recordConnectionParams.bind(this)}
                                    value={this.props.storeConnection.db || ''}
                                    label={'Database to connect to...'}
                                    activeClass={enableInput}
                                    disabled={this.props.storeConnection.isDBConnected}
                                />
                            </Col>
                            <Col xs={12} sm={7}><p className='h7'>Database to connect to</p></Col>
                        </Row>

                    </Grid>
                    <Grid bsClass='connectToggleContainer'>
                        <Row className='connectorRow toogleRow'>
                            <Col xs={6} sm={6} className='tdAlignRight'>
                                <p className='h7 toggleLabel'>CONNECT </p>
                            </Col>
                            <Col xs={6} sm={6} id='connectToggle'>
                                <label className="switch">
                                    <input
                                        type="checkbox"
                                        onChange={this.toggleDBSwitch.bind(this)}
                                        checked={this.props.storeConnection.isDBConnected}
                                    />
                                    <span className="slider round"></span>
                                </label>
                            </Col>
                        </Row>
                        <Row id='connectorMessage' className={!this.props.storeConnection.connectionMessage ? 'hidden' : 'visible'}>
                            <Col xs={12} colSpan={2} className={`connectorMessageContainer`}>

                                <h6 className={`messageWrap ${this.props.storeConnection.isDBConnected === true && this.props.storeConnection.connectionStatus === 'Success' ? 'success' :
                                    this.props.storeConnection.connectionStatus === 'Error' ? 'error' : this.props.storeConnection.connectionStatus === 'LoggedOut' ? 'warning' : 'hidden'}`}>
                                    {this.props.storeConnection.connectionMessage}
                                </h6>
                            </Col>
                        </Row>
                        <Row id='connectorWarning' className={!this.props.storeConnection.connectionWarning ? 'hidden' : 'visible'}>
                            <Col xs={12} colSpan={2} className={`connectorMessageContainer`}>
                                <h6 className={`${this.props.storeConnection.isDBConnected === true && this.props.storeConnection.connectionStatus === 'Success' && this.props.storeConnection.connectionWarning ? 'warning' : ''}`}>
                                    {this.props.storeConnection.connectionWarning}
                                </h6>
                            </Col>
                        </Row>
                    </Grid>
                </form>
            </div>
        )
    }
}

Connector.propTypes = {
    storeConnection: PropTypes.object,
    setConnectionParametersToStore: PropTypes.func,
    setCollectionConfigToStore: PropTypes.func,
    setCollectionToStore: PropTypes.func,
    setConnectionStateToStore: PropTypes.func,
};

export default connect(mapStateToProps, mapDispatchToProps)(Connector);
