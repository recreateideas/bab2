import React from 'react';
import PropTypes from 'prop-types';

const FontAwesome = require('react-fontawesome');

class ConnectionShortcut extends React.Component {

    render() {
        return (
            <div onClick={this.props.onClick} className={`connectionShortcut connection_${this.props.label}`}>
                <FontAwesome  name='database' className={`shortcutIcon connection_${this.props.label}`} />
                <div className={`shortcutLabel connection_${this.props.label}`}>
                    {this.props.label}
                </div>\
            </div>
        )
    }
}

ConnectionShortcut.propTypes = {
    onClick: PropTypes.func
};

export default ConnectionShortcut;
