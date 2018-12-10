import React from 'react';
import PropTypes from 'prop-types';

//insert function to display and hide

const Tooltip = ({tooltipContainerClass = '',displayTooltip,addClass,content}) => {
    return (
        <div className={tooltipContainerClass}>
            <div className={`tooltip ${displayTooltip} ${addClass}`}>
                {content}
            </div>
        </div>
    )
}

Tooltip.propTypes = {
    tooltipContainerClass: PropTypes.string,
    addClass: PropTypes.string,
    displayTooltip: PropTypes.string,
    content: PropTypes.string
}

export default Tooltip;
