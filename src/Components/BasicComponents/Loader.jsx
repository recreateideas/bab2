import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux'
import { mapStateToProps, mapDispatchToProps } from '../../store/mapToProps/mapToProps_Loaders';


class Loader extends React.Component {
    constructor(){
        super();
        this.state = {
            display: 'hidden'
        };
    }

    componentWillReceiveProps(nextProps){
        console.log(nextProps);
        this.setState({
            display: nextProps.queryLoader
        });
    }

    render() {
        const display = this.state.display || this.props.display;
        const addClass = this.props.addClass;
        return (
            <div className={`loaderBackdrop ${addClass} ${display}`}>
                <div id={this.props.loaderId} className={`loader ${this.props.loaderType} ${this.props.addLoaderClass}`}>Searching...</div>
            </div>
        )
    }
};

Loader.propTypes = {
    loaderType: PropTypes.string,
    displayLoader: PropTypes.string,
};

export default connect(mapStateToProps, mapDispatchToProps)(Loader);
