import React from 'react';
import { connect } from 'react-redux';
import { Background, ConnectTab, QueryTab } from './Components';
import printConsoleLogo from './tools/graphicHelpers/PrintConsoleLogo';
import { mapStateToProps, mapDispatchToProps } from './store/mapToProps/mapToProps_App';
import ToolsTab from './Components/Sidebar/Tabs/ToolsTab';
import ShareTab from './Components/Sidebar/Tabs/ShareTab';
import SettingsTab from './Components/Sidebar/Tabs/SettingsTab';
import ReactTooltip from 'react-tooltip';
import PropTypes from 'prop-types';
import { fileAPICheck} from './tools/fileManagers';
// import styles from './css/test.css';
import './css/App.css';
// require('./css/App.css');

import { connectToSocket } from './tools/DBClientUtils/socketIOClientUtils';

const FontAwesome = require('react-fontawesome');


class App extends React.Component {


    componentWillMount() {
        printConsoleLogo();
        fileAPICheck(this);
        const user = JSON.parse(localStorage.getItem('user'));
        if (user) {
            console.log('welcome back chimp!');
            this.props.recordUserObjectToStore(user);
            connectToSocket(this, user.customId, user.nickname);
            this.props.loadLocalStorageMessagesToStore();
            // update messages with waitingRoom
        }
    }

    displayConnectedBadge() {
        let classProp;
        const isConnected = this.props.storeDBConnected;
        classProp = isConnected === false ? 'zeroVisibility' : 'fullVisibility';
        return classProp;
    }

    render() {
        const connectOpacity = this.displayConnectedBadge();
        console.log(process.env);
        return (
            <div id="App" className='test'>
                <Background />
                <div id='toggleContainer' className='toggleContainer'>
                    <input type="checkbox" id="slide" name="" value="" defaultChecked={false} />
                    <div className="container mainContainer">

                        <div className="sidebar">
                            <label htmlFor="slide" className="toggle">
                                <FontAwesome name='bars' />{/*☰*/}
                            </label>
                            <div id="tabs" className=''>
                                <input type="radio" name="tabs" id="toggle-tab1" defaultChecked={true} />
                                <div className='connectIndicatorWrapper'>
                                    <FontAwesome name='check-circle' size='2x' className={`connectIndicator ${connectOpacity}`} />
                                </div>
                                <label id='connectorTab' htmlFor="toggle-tab1" data-tip data-for='tooltip_connectorTab'>
                                    <FontAwesome name='plug' size='2x' className='connectPlug' style={{ textShadow: '0 1px 0 rgba(255, 255, 255, 0.7)' }} />
                                </label>
                                <ReactTooltip id='tooltip_connectorTab' type='success'>
                                    <span>Connection Centre</span>
                                </ReactTooltip>

                                <input type="radio" name="tabs" id="toggle-tab2" />
                                <label htmlFor="toggle-tab2" data-tip data-for='tooltip_queryTab'>
                                    <FontAwesome name='feather' size='2x' style={{ textShadow: '0 1px 0 rgba(255, 255, 255, 0.7)' }} />
                                </label>
                                <ReactTooltip id='tooltip_queryTab' type='success'>
                                    <span>Query Jungle</span>
                                </ReactTooltip>

                                <input type="radio" name="tabs" id="toggle-shareTab" />
                                <label htmlFor="toggle-shareTab" data-tip data-for='tooltip_shareTab'>
                                    <FontAwesome name='comments' size='2x' style={{ textShadow: '0 1px 0 rgba(255, 255, 255, 0.7)' }} />
                                </label>
                                <ReactTooltip id='tooltip_shareTab' type='success'>
                                    <span>Share</span>
                                </ReactTooltip>

                                <input type="radio" name="tabs" id="toggle-tab3" />
                                <label htmlFor="toggle-tab3" data-tip data-for='tooltip_toolsTab'>
                                    <FontAwesome name='flask' size='2x' style={{ textShadow: '0 1px 0 rgba(255, 255, 255, 0.7)' }} />
                                </label>
                                <ReactTooltip id='tooltip_toolsTab' type='success'>
                                    <span>Potions</span>
                                </ReactTooltip>
                                <input type="radio" name="tabs" id="toggle-tab4" />
                                <label htmlFor="toggle-tab4" data-tip data-for='tooltip_settingsTab'>
                                    <FontAwesome name='cogs' size='2x' style={{ textShadow: '0 1px 0 rgba(255, 255, 255, 0.7)' }} />
                                </label>
                                <ReactTooltip id='tooltip_settingsTab' type='success'>
                                    <span>Settings</span>
                                </ReactTooltip>
                                <ConnectTab />
                                <QueryTab />
                                <ShareTab/>
                                <div id="tab3" className="tab glass">
                                    <h4>Tools</h4>
                                    <ToolsTab />
                                </div>
                                <SettingsTab />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

App.propType = {
    storeDBConnected: PropTypes.bool,
    recordUserObjectToStore: PropTypes.func
};


export default connect(mapStateToProps, mapDispatchToProps)(App);
