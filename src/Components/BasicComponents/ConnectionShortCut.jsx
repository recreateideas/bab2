import React from 'react';
import PropTypes from 'prop-types';

const FontAwesome = require('react-fontawesome');

class ConnectionShortcut extends React.Component {

    render() {
        return (
            <div className="connectionShortcut" onClick={this.props.onClick}>
                <FontAwesome  name='database' className='shortcutIcon' />
                <div className='shortcutLabel'>connectorWrap connectorWrap</div>
            </div>
        )
    }
}

ConnectionShortcut.propTypes = {
    onClick: PropTypes.func
};

export default ConnectionShortcut;
