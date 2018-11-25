import React from 'react';
import PropTypes from 'prop-types';
import { TextInput, Button2 } from '../BasicComponents';

const FontAwesome = require('react-fontawesome');

class ConnectionNamePopup extends React.Component {

    constructor() {
        super();
        this.state = {
            connectionName: '',
        };
    }

    editConnectionName(e) {
        const value = e.target.value;
        this.setState({
            connectionName: value,
        });
    }

    saveConnectionName() {
        const connection = this.props.storeConnection;
        const customId = this.props.storeUser.customId;
        console.log(connection);
        console.log(customId);
        let savedConnections = localStorage.getItem('savedConnections') ? JSON.parse(localStorage.getItem('savedConnections')) : {};
        if (!savedConnections[customId]) {
            savedConnections[customId] = {};
        }
    }

    render() {
        const display = this.props.display === true ? 'show' : 'hidden';
        return (
            <div id="popupBackdrop" className={`overlayBackdrop ${display}`} onClick={this.props.closePopup}>
                <div id="connectionNamePopup" onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}>
                    <div id='closeOverlayButton' onClick={this.props.closePopup}>
                        <FontAwesome name='times' size='2x' /*spin*/ className='closeOverlayImg' />
                    </div>
                    <TextInput
                        inputId={'connectionNameField'}
                        change={this.editConnectionName.bind(this)}
                        value={this.state.connectionName}
                        label={'enter connection name..'}
                        addClass={`iframeFields`}
                    />
                    <div className='popupButtonWrap'>
                        <Button2
                            click={this.saveConnectionName.bind(this)}
                            buttonId='popupSaveButton'
                            value='Save'
                            addClass='connectionPopupButton'
                        />
                        <Button2
                            click={this.props.closePopup}
                            buttonId='popupCancelButton'
                            value='Cancel'
                            addClass='connectionPopupButton'
                        />
                    </div>
                </div>
            </div>
        )
    }
}

ConnectionNamePopup.propTypes = {
    onClick: PropTypes.func
};

export default ConnectionNamePopup;
