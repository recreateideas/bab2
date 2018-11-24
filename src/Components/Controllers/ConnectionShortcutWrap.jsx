import React from 'react';
import PropTypes from 'prop-types';
import {ConnectionShortcut} from '../BasicComponents';

const FontAwesome = require('react-fontawesome');

class ConnectionShortcutWrap extends React.Component {

    render() {
        return (
            <div id="connectionShortcutWrap" onClick={this.props.onClick}>
                <ConnectionShortcut />
                <ConnectionShortcut />
            </div>
        )
    }
}

ConnectionShortcutWrap.propTypes = {
    onClick: PropTypes.func
};

export default ConnectionShortcutWrap;
