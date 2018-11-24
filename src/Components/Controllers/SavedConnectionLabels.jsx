import React from 'react';
import { connect } from 'react-redux';
import { Background, ConnectTab, QueryTab } from './Components';
import printConsoleLogo from './graphicHelpers/PrintConsoleLogo';
import { mapStateToProps, mapDispatchToProps } from './store/mapToProps/mapToProps_App';
import ToolsTab from './Components/Sidebar/Tabs/ToolsTab';
import SettingsTab from './Components/Sidebar/Tabs/SettingsTab';
import ReactTooltip from 'react-tooltip';

const FontAwesome = require('react-fontawesome');

class SavedConnectionLabels extends React.Component{

    renderLabels(){
        console.log('renderLabels');
    }
    render(){
        return(
            <div>

            </div>
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(SavedConnectionLabels);
