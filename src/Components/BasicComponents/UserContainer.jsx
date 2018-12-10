import React, {Component} from 'react';
import PropTypes from 'prop-types';

const UserContainer = ({containerId,addClass,click,customId,nickname,activeUser,lastActive}) => {

        return (
            <div id={containerId} className={`${addClass} userContainer`} onClick={click} data-customid={customId} data-nickname={nickname}>
                <div className='connectedBadge'>
                    <div className={`connectedCircle ${activeUser}`}></div>
                </div>
                <div className='userTextWrap'>
                    <p className='nicknameText h7'>{nickname}</p><br />
                    <p className='lastActiveText h7'>{lastActive}</p><br />
                </div>
            </div>
        )
}

UserContainer.propTypes = {
    addClass: PropTypes.string,
    containerId: PropTypes.string,
    nickname: PropTypes.string,
    lastActive: PropTypes.string,
    click: PropTypes.func,
    activeUser: PropTypes.string,
    customId: PropTypes.string
};


export default UserContainer;
