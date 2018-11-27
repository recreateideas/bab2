import React from 'react';
import PropTypes from 'prop-types';
import { ConnectionShortcut } from '../BasicComponents';
import { mapStateToProps, mapDispatchToProps } from '../../store/mapToProps/mapToProps_ConnectionShortcutWrap';
import { connect } from 'react-redux';

class ConnectionShortcutWrap extends React.Component {

    constructor() {
        super();
        this.state = {
            selectedShortcut: '',
        }
    }

    setConnectionParams(e) {
        if (!this.props.storeConnection.isDBConnected) {
            const savedConnections = this.props.savedConnections;
            const label = e.target.className.replace('shortcutLabel ', '').replace('connection', '');
            const connection = savedConnections[label];
            this.props.setAllConnectionParametersToStore(connection);
            this.setState({ selectedShortcut: label });
        }
    }

    deleteConnection(e) {
        e.preventDefault();
        e.stopPropagation();
        if (!this.props.storeConnection.isDBConnected) {
            let newSavedConnections = {};
            const label = e.target.id.replace('connectionDelete', '');
            const savedConnections = this.props.savedConnections;
            const customId = this.props.storeUser.customId;
            delete savedConnections[label];
            if(this.state.selectedShortcut === label){
                // const defaultConnection = this.props._connection;
                this.props.setAllConnectionParametersToStore();
            }
            newSavedConnections[customId] = savedConnections;
            this.props.setSavedConnectionsToStore(savedConnections);
            localStorage.setItem('savedConnections', JSON.stringify(newSavedConnections));
        }
    }

    renderConnectionShortcuts(connection, index) {
        return (
            <ConnectionShortcut
                key={index}
                label={connection.label}
                onClick={this.setConnectionParams.bind(this)}
                onDelete={this.deleteConnection.bind(this)}
                selectedShortcut={this.state.selectedShortcut}
            />
        );
    }

    render() {
        const savedConnections = this.props.savedConnections;
        const disabledClass = this.props.storeConnection.isDBConnected ? 'disabled' : '';
        return (
            <div id="connectionShortcutWrap" onClick={this.props.onClick} className={disabledClass}>
                {Object.keys(savedConnections).map((key, index) => this.renderConnectionShortcuts(savedConnections[key], index))}
            </div>
        )
    }
}

ConnectionShortcutWrap.propTypes = {
    onClick: PropTypes.func
};

export default connect(mapStateToProps, mapDispatchToProps)(ConnectionShortcutWrap);
