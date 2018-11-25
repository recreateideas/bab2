import React from 'react';
import PropTypes from 'prop-types';
import { TextInput, Button2 } from '../BasicComponents';

const FontAwesome = require('react-fontawesome');

class ConnectionNamePopup extends React.Component {

    constructor(){
        super();
        this.state={
            connectionName: '',
        };
    }

    editConnectionName(e){
        const value = e.target.value;
        this.setState({
            connectionName: value,
        });
    }

    saveConnectionName(){
        const connection = this.props.storeConnection;
        const customId = this.props.storeUser.customId;
        console.log(connection);
        console.log(customId);
        let savedConnections = localStorage.getItem('savedConnections') ? JSON.parse(localStorage.getItem('savedConnections')) : {};
        if(!savedConnections[customId]){
            savedConnections[customId] = {};
        }
    }

    render() {
        return (
            <div id="popupBackdrop" className='overlayBackdrop' onClick={this.props.onClick}>
                <div id="connectionNamePopup" onClick={this.props.onClick}>
                    <TextInput
                        inputId={'loginEmail'}
                        change={this.editConnectionName.bind(this)}
                        value={this.state.connectionName}
                        label={'enter connection name..'}
                        addClass={`loginFields iframeFields`}
                    />
                    <Button2
                        click={this.saveConnectionName.bind(this)}
                        buttonId='LoginButton'
                        value='Save'
                    />
                </div>
            </div>
        )
    }
}

ConnectionNamePopup.propTypes = {
    onClick: PropTypes.func
};

export default ConnectionNamePopup;
