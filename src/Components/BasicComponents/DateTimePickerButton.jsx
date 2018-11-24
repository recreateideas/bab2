import React from 'react';
import PropTypes from 'prop-types';

const FontAwesome = require('react-fontawesome');

class DateTimePickerButton extends React.Component {

    render() {
        return (
            <button
                className="pickerButton"
                onClick={this.props.onClick}>
                <FontAwesome  name='calendar-alt' /*spin*/ style={{ fontSize:'18px',top: '-5px',position:'relative',left:'0.5px'}} />
            </button>
        )
    }
}

DateTimePickerButton.propTypes = {
    onClick: PropTypes.func
};

export default DateTimePickerButton;
