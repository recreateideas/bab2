import React from 'react';
import PropTypes from 'prop-types';

const FontAwesome = require('react-fontawesome');

class DateTimePickerButton extends React.Component {

    render() {
        const { onClick } = this.props;
        return (
            <button
                className="pickerButton"
                onClick={onClick}>
                <FontAwesome name='calendar-alt' style={{ fontSize: '18px', top: '-5px', position: 'relative', left: '0.5px' }} />
            </button>
        )
    }
}

DateTimePickerButton.propTypes = {
    onClick: PropTypes.func
};

export default DateTimePickerButton;
