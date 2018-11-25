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

    
    componentWillMount() {
        const ssConnectionString = localStorage.getItem('savedConnections');
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
                        change={this.props.onChange}
                        value={this.props.connectionEditedName}
                        label={'enter connection name..'}
                        addClass={`iframeFields ${this.props.addClass}`}
                    />
                    <div className='popupButtonWrap'>
                        <Button2
                            click={this.props.onSave}
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
