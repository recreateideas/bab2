import React, { Component } from 'react';
import { connect } from 'react-redux';
// import { Button2 } from '../BasicComponents';
import PropTypes from 'prop-types';
import LoginIFrame from './LoginIFrame';
import { mapStateToProps } from '../../store/mapToProps/mapToProps_SlideRightOut';
import { downloadFile, saveResultsToCSV } from '../../tools/fileManagers';
import ReactTooltip from 'react-tooltip';

const FontAwesome = require('react-fontawesome');
const uglify_inactive = require('../../images/uglify.png');
const uglify_active = require('../../images/uglify_active.png');

class RightSlideOut extends Component {
    constructor(props) {
        super(props);
        this.state = {
            displayIFrame: false,
        }
    }

    toggleIFrame() {
        const isIFrameDisplayed = this.state.displayIFrame;
        this.setState({
            displayIFrame: !isIFrameDisplayed
        });
    }

    closeLogin(e) {
        e.preventDefault();
        e.stopPropagation();
        this.setState({
            displayIFrame: false
        });
    }

    saveQuery() {
        let fullState = this.props.storeAllState;
        const fileContent = this.prepareStateForExport(fullState);
        downloadFile({
            content: fileContent,
            extension: 'bab',
            filename: `baboon_query${+new Date()}.bab`
        });
        // console.log(fileContent);
    }

    prepareStateForExport(object) {
        let fullState = Object.assign({},object);
        if (fullState) {
            // delete fullState.config;
            delete fullState.greeting;
            delete fullState.isDBConnected;
            delete fullState.DBcollections;
            delete fullState.connectionMessage;
            delete fullState.db;
            delete fullState.mongo_results;
            delete fullState.user;
            return JSON.stringify(fullState);
        }
    };

    checkResultsLength() {
        const mongo_results = this.props.storeQueryResults;
        if (mongo_results && mongo_results.length > 0) {
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
                activeQuerySave: 'inactiveButtonIcon',
                activeShare: 'inactiveButtonIcon',
                activeUglify: 'inactiveButtonIcon',
            }
        }
        /******** TEST *********/
        // return {
        //     activeFont: '',
        //     activeExport: '',
        //     activeQuerySave: '',
        //     activeShare: '',
        // }
        /***********************/
    }

    saveResults() {
        saveResultsToCSV(this.props.storeQueryResults);
    }

    render() {
        let hideLoggedOut = this.props.storeUser.loggedIn ? 'display_none' : '';
        let hideLoggedIn = this.props.storeUser.loggedIn ? '' : 'display_none';
        let loggedInBorder = this.props.storeUser.loggedIn ? 'loggedInBorder' : '';
        const activeToolsClass = this.checkResultsLength();
        let uglify,uglifyClass='';
        if(activeToolsClass.activeUglify === ''){
            uglify = uglify_active;
            uglifyClass='activeImg';
        } else{
            uglify = uglify_inactive;
            uglifyClass='inactiveImg';
        };
        // console.log(this.checkResultsLength());
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
                                <div id='loginButton' className={`borderlessButton ${loggedInBorder}`} onClick={this.toggleIFrame.bind(this)}>
                                    <FontAwesome name='users' size='3x' className={`iconButton ${hideLoggedOut}`} />
                                    <FontAwesome name='user-check' size='3x' className={`iconButton loggedInButton ${hideLoggedIn}`} />
                                </div>
                            </li>
                            <li>
                                <div id='nicknameWrapper' className={`${hideLoggedIn}`}>
                                    <p id='nickname'>{this.props.storeUser.nickname}</p>
                                </div>
                            </li>
                        </ul>
                        <hr className="slideSeparator" />
                        <div id='fontSizeControls' className='toolContainer'>
                            <div className='slideOutDescriptionContainer'><p className='slideOutDescription'>font size</p></div>
                            <div id='increaseFont' onClick={activeToolsClass.activeFont === '' ? this.props.increaseFont : null}>
                                <h4 className={`fontButton ${activeToolsClass.activeFont}`}>+</h4>
                            </div>
                            <div><p className={`fontSize ${activeToolsClass.activeFont}`}>{this.props.fontSize}</p></div>
                            <div id='decreaseFont' onClick={activeToolsClass.activeFont === '' ? this.props.decreaseFont : null}>
                                <h4 className={`fontButton ${activeToolsClass.activeFont}`}>&#8722;</h4>
                            </div>
                        </div>
            {/* <hr className="slideSeparator" /> */}
                        <div id='formatResults' className='toolContainer'>
                            <div className='slideOutDescriptionContainer'><p className='slideOutDescription'>format</p></div>
                            <div>
                                {/* <FontAwesome name='file-export' size='2x' className={`iconButton ${activeToolsClass.activeQuerySave}`} onClick={this.saveResults.bind(this)} /> */}
                                <img src={uglify} className={`imageButton ${uglifyClass}`} alt='uglify' data-tip data-for='tooltip_uglify' onClick={activeToolsClass.activeUglify === '' ? this.props.toggleMinified : null}/>
                                <ReactTooltip id='tooltip_uglify' type='warning'>
                                    <span>uglify/pretty results</span>
                                </ReactTooltip>
                            </div>
                        </div>
            {/* <hr className="slideSeparator" /> */}
                        <div id='quickTools' className='toolContainer'>
                            <div className='slideOutDescriptionContainer'><p className='slideOutDescription'>tools</p></div>
                            <ul id='quickToolsList'>
                                <li id='saveResults' data-tip data-for='tooltip_CSV'>
                                    <FontAwesome name='file-export' size='2x' className={`iconButton ${activeToolsClass.activeQuerySave}`} onClick={activeToolsClass.activeQuerySave === '' ? this.saveResults.bind(this) : null} />
                                    <ReactTooltip id='tooltip_CSV' type='warning'>
                                        <span>export results to CSV</span>
                                    </ReactTooltip>
                                </li>
                                <li id='saveQuery' data-tip data-for='tooltip_saveQuery'>
                                    <FontAwesome name='save' size='2x' className={`iconButton ${activeToolsClass.activeExport}`} onClick={activeToolsClass.activeExport === '' ? this.saveQuery.bind(this): null} />
                                    <ReactTooltip id='tooltip_saveQuery' type='warning'>
                                        <span>save query to file</span>
                                    </ReactTooltip>
                                </li>
                                <li id='shareWorkspace' data-tip data-for='tooltip_shareWorkspace'>
                                    <FontAwesome name='share-alt' size='2x' className={`iconButton ${activeToolsClass.activeShare}`} />
                                    <ReactTooltip id='tooltip_shareWorkspace' type='warning'>
                                        <span>share workspace</span>
                                    </ReactTooltip>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
                <LoginIFrame
                    display={this.state.displayIFrame}
                    closeLogin={this.closeLogin.bind(this)}
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
