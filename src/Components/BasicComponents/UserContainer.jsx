import React from 'react';
import PropTypes from 'prop-types';

class UserContainer extends React.Component {


    render() {
        return (
            <div id={this.props.containerId} className={`${this.props.addClass} userContainer`} onClick={this.props.click} data-customid={this.props.customId} data-nickname={this.props.nickname}>
                <div className='connectedBadge'>
                    <div className={`connectedCircle ${this.props.activeUser}`}></div>
                </div>
                <div className='userTextWrap'>
                    <p className='nicknameText h7'>{this.props.nickname}</p><br />
                    <p className='lastActiveText'>{this.props.lastActive}</p><br />
                </div>
            </div>
        )
    }
}

UserContainer.propTypes = {
    addClass: PropTypes.string,
    containerId: PropTypes.string,
    nickname: PropTypes.string,
    lastActive: PropTypes.string,
    click: PropTypes.func,
    customId: PropTypes.string
};


export default UserContainer;
