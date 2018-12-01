import React from 'react';
import PropTypes from 'prop-types';

const FontAwesome = require('react-fontawesome');

class ConnectionShortcut extends React.Component {

    constructor() {
        super();
        this.state = {
            displayDeleteButton: false,
        }
    }

    displayCloseButton(e) {
        this.setState({ displayDeleteButton: true, });
    }

    hideCloseButton(e) {
        this.setState({ displayDeleteButton: false, });
    }

    shortcutClicked(e){
        this.props.onClick(e);
    }

    render() {
        const displayCloseButtonClass = this.state.displayDeleteButton ? 'show' : 'hidden';
        const selectedShortcutClass = this.props.selectedShortcut === this.props.label ? 'selectedShortcut' : '';
        // console.log(selectedShortcutClass);
        return (
            <div onClick={this.shortcutClicked.bind(this)} onMouseEnter={this.displayCloseButton.bind(this)} onMouseLeave={this.hideCloseButton.bind(this)} className={`connectionOuterWrap connection${this.props.label}`}>
                <div className={`connectionShortcut ${selectedShortcutClass}`}>
                    <FontAwesome name='database' className={`shortcutIcon connection${this.props.label}`} />
                    <div className={`shortcutLabel connection${this.props.label}`}>
                        {this.props.label}
                    </div>
               
                <div className={`deleteConnectionIconWrap ${displayCloseButtonClass}`} onClick={this.props.onDelete}>
                        <FontAwesome className='deleteAttachmentIcon' name='times-circle' id={`connectionDelete${this.props.label}`}/>
                </div>
                </div>
            </div>
        )
    }
}

ConnectionShortcut.propTypes = {
    onClick: PropTypes.func
};

export default ConnectionShortcut;
