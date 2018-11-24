import React from 'react';
import PropTypes from 'prop-types';

//insert function to display and hide

const Tooltip = props => {
    return (
        <div className={`${props.tooltipContainerClass || ''}`}>
            <div className={`tooltip ${props.displayTooltip} ${props.addClass}`}>
                {props.content}
            </div>
        </div>
    )
}

Tooltip.propTypes = {
    displayTooltip: PropTypes.string,
    content: PropTypes.string
}

export default Tooltip;
