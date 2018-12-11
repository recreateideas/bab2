import React, { Component } from 'react';
import { connect } from 'react-redux';
import ReactTooltip from 'react-tooltip';
import PropTypes from 'prop-types';
import LoginIFrame from './LoginIFrame';
import { mapStateToProps } from '../../store/mapToProps/mapToProps_SlideRightOut';
import { downloadFile, saveResultsToCSV } from '../../tools/fileManagers';
import { isNotEmptyArray, preventEventPropagation } from '../../tools/helpers';

const FontAwesome = require('react-fontawesome');
const uglify_inactive = require('../../images/uglify.png');
const uglify_active = require('../../images/uglify_active.png');

class RightSlideOut extends Component {
    constructor(props) {
        super(props);
        this.state = {
            displayIFrame: false,
        };
        this.toggleDisplayLoginIFrame = this.toggleDisplayLoginIFrame.bind(this);
        this.saveQueryToFile = this.saveQueryToFile.bind(this);
    }

    toggleDisplayLoginIFrame(e) {
        preventEventPropagation(e);
        const { displayIFrame } = this.state;
        this.setState({ displayIFrame: !displayIFrame });
    }

    saveQueryToFile() {
        const { storeAllState } = this.props;
        const fileContent = this.trimStateToExport(storeAllState);
        downloadFile({
            content: fileContent,
            extension: 'bab',
            filename: `baboon_query${+new Date()}.bab`
        });
    }

    trimStateToExport(storeAllState) {
        const { mongo, graphic, connection, share, user, ...stateToExport } = storeAllState;
        return JSON.stringify(stateToExport);
    };

    toggleActiveToolButtons() {
        const { storeQueryResults } = this.props;
        if (isNotEmptyArray(storeQueryResults)) {
            return {
                activeFont: '',
                activeExport: '',
                activeQuerySave: '',
                activeShare: '',
                activeUglify: '',
            }
        } else {
            return {
                activeFont: 'inactiveButtonIcon',
                activeExport: 'inactiveButtonIcon',
                activeQuerySave: '',
                activeShare: '',
                activeUglify: 'inactiveButtonIcon',
            }
        }
    }

    render() {

        const { storeQueryResults, increaseFont, fontSize, decreaseFont, toggleMinified, storeUser: { loggedIn, nickname } } = this.props;

        const hideLoggedOut = loggedIn ? 'display_none' : '';
        const hideLoggedIn = loggedIn ? '' : 'display_none';
        const loggedInBorder = loggedIn ? 'loggedInBorder' : '';

        const { activeFont, activeExport, activeQuerySave, activeShare, activeUglify } = this.toggleActiveToolButtons();
        let uglify, uglifyClass = '';
        if (activeUglify === '') {
            uglify = uglify_active;
            uglifyClass = 'activeImg';
        } else {
            uglify = uglify_inactive;
            uglifyClass = 'inactiveImg';
        };
        // console.log(this.toggleActiveToolButtons());
        return (
            <div>
                <div id="rightSlideOut">
                    <div id="rightSlideOut_toggle">
                        <FontAwesome name='magic' size='2x' style={{ color: 'white', lineHeight: '2em' }} />
                    </div>
                    <div id="rightSlideOut_inner">
                        {/* [Login + Exports] */}
                        <ul id='userPanel'>
                            <li>
                                <div id='loginButton' className={`borderlessButton ${loggedInBorder}`} onClick={this.toggleDisplayLoginIFrame}>
                                    <FontAwesome name='users' size='3x' className={`iconButton ${hideLoggedOut}`} />
                                    <FontAwesome name='user-check' size='3x' className={`iconButton loggedInButton ${hideLoggedIn}`} />
                                </div>
                            </li>
                            <li>
                                <div id='nicknameWrapper' className={`${hideLoggedIn}`}>
                                    <p id='nickname'>{nickname}</p>
                                </div>
                            </li>
                        </ul>
                        <hr className="slideSeparator" />
                        <div id='fontSizeControls' className='toolContainer'>
                            <div className='slideOutDescriptionContainer'><p className='slideOutDescription'>font size</p></div>
                            <div id='increaseFont' onClick={activeFont === '' ? increaseFont : null}>
                                <h4 className={`fontButton ${activeFont}`}>+</h4>
                            </div>
                            <div><p className={`fontSize ${activeFont}`}>{fontSize}</p></div>
                            <div id='decreaseFont' onClick={activeFont === '' ? decreaseFont : null}>
                                <h4 className={`fontButton ${activeFont}`}>&#8722;</h4>
                            </div>
                        </div>
                        <div id='formatResults' className='toolContainer'>
                            <div className='slideOutDescriptionContainer'><p className='slideOutDescription'>format</p></div>
                            <div>
                                <img src={uglify} className={`imageButton ${uglifyClass}`} alt='uglify' data-tip data-for='tooltip_uglify' onClick={activeUglify === '' ? toggleMinified : null} />
                                <ReactTooltip id='tooltip_uglify' type='warning' children={`uglify/pretty results`} />
                            </div>
                        </div>
                        <div id='quickTools' className='toolContainer'>
                            <div className='slideOutDescriptionContainer'><p className='slideOutDescription'>tools</p></div>
                            <ul id='quickToolsList'>
                                <li id='saveResults' data-tip data-for='tooltip_CSV'>
                                    <FontAwesome name='file-export' size='2x' className={`iconButton ${activeExport}`} onClick={activeExport === '' ? () => saveResultsToCSV(storeQueryResults): null} />
                                    <ReactTooltip id='tooltip_CSV' type='warning' children={`export results to CSV`} />
                                </li>
                                <li id='saveQuery' data-tip data-for='tooltip_saveQuery'>
                                    <FontAwesome name='save' size='2x' className={`iconButton ${activeQuerySave}`} onClick={activeQuerySave === '' ? this.saveQueryToFile : null} />
                                    <ReactTooltip id='tooltip_saveQuery' type='warning' children={`save query to file`} />
                                </li>
                                <li id='shareWorkspace' data-tip data-for='tooltip_shareWorkspace'>
                                    <FontAwesome name='share-alt' size='2x' className={`iconButton ${activeShare}`} />
                                    <ReactTooltip id='tooltip_shareWorkspace' type='warning' children={`share workspace`} />
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
                <LoginIFrame
                    display={this.state.displayIFrame}
                    closeLogin={this.toggleDisplayLoginIFrame}
                />
            </div>
        );
    }
}


RightSlideOut.propTypes = {
    decreaseFont: PropTypes.func,
    increaseFont: PropTypes.func,
    fontSize: PropTypes.number,
    storeUser: PropTypes.object,
};

export default connect(
    mapStateToProps,
)(RightSlideOut);
