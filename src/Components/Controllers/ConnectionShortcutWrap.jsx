import React from 'react';
import PropTypes from 'prop-types';
import {ConnectionShortcut} from '../BasicComponents';
import { mapStateToProps, mapDispatchToProps } from '../../store/mapToProps/mapToProps_ConnectionShortcutWrap';
import { connect } from 'react-redux';

class ConnectionShortcutWrap extends React.Component {

    setConnectionParams(e){
        const savedConnections = this.props.savedConnections;
        const label = e.target.className.replace('shortcutLabel ','').split('_')[1];
        const connection = savedConnections[label];
        console.log(connection);
        this.props.setAllConnectionParametersToStore(connection);
    }

    renderConnectionShortcuts(connection, index){
        return (
            <ConnectionShortcut
                key={index}
                label={connection.label}
                onClick={this.setConnectionParams.bind(this)}
            />
        );
    }

    render() {
        const savedConnections = this.props.savedConnections;
        return (
            <div id="connectionShortcutWrap" onClick={this.props.onClick}>
                     {Object.keys(savedConnections).map((key, index) => this.renderConnectionShortcuts(savedConnections[key], index))}
            </div>
        )
    }
}

ConnectionShortcutWrap.propTypes = {
    onClick: PropTypes.func
};

export default connect(mapStateToProps, mapDispatchToProps)(ConnectionShortcutWrap);
 