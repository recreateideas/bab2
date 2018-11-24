import React from 'react';

// const FontAwesome = require('react-fontawesome');
const SettingsTab = () => {
    return (
        <div id="tab4" className="tab glass">
            <img src={require('../../../images/ReCreate Ideas_whiteoutlineGREY.png')} alt='logo' id='ReCreateLogoTools' />
            <h4>Settings</h4>
            <ul>s
                <li><p className='.h8'>* Default name for CSV exported files</p></li>
                <li><p className='.h8'>* Maximum of items to return from query</p></li>
                <li><p className='.h8'>* Account settings</p></li>
                <li><p className='.h8'>--* Choose avatar</p></li>
                <li><p className='.h8'>* </p></li>
                <li>* Manage Subscription ($1/month)</li>
            </ul>
        </div>
    )
};


export default SettingsTab;
