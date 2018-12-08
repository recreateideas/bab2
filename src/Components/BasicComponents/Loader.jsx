import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux'
import { mapStateToProps, mapDispatchToProps } from '../../store/mapToProps/mapToProps_Loaders';

const Loader = ({ addClass, loaderId, loaderType, addLoaderClass, display = 'hidden' }) => {
    return (
        <div className={`loaderBackdrop ${addClass} ${display}`}>
            <div id={loaderId} className={`loader ${loaderType} ${addLoaderClass}`}>
                bear with me...
                </div>
        </div>
    )
};

Loader.propTypes = {
    addClass: PropTypes.string,
    loaderId: PropTypes.string,
    loaderType: PropTypes.string,
    displayLoader: PropTypes.string,
};

export default connect(mapStateToProps, mapDispatchToProps)(Loader);
