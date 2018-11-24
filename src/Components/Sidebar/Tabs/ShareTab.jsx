import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { MessageBox, UsersBox, TypeBox } from '../../../Components';
import { mapStateToProps } from '../../../store/mapToProps/mapToProps_ShareTab';
// const FontAwesome = require('react-fontawesome');

class ShareTab extends React.Component {

    renderMessageBoxes(chat, receiver,index) {
        // if(receiver !== '' && receiver !== undefined){
            let isActiveBox = this.props.storeReceiver.customId === receiver ? 'show' : 'hidden';
            // console.log(receiver);
            return (
                <MessageBox
                    key={index}
                    addClass={`${isActiveBox}`}
                    messages={chat.messages}
                    receiver={receiver}
                />
            )
        // }
    }

    render() {
        return (
            <div id="shareTab" className="tab glass">
                <div id='chatContainer'>
                    <div id='messagesAndUsers'>
                        {Object.keys(this.props.storeChats).map((chat, index) => this.renderMessageBoxes(this.props.storeChats[chat], chat,index))}
                        <TypeBox />
                    </div>
                    <UsersBox/>
                </div>
            </div>
        )
    }

};

ShareTab.propTypes = {
    storeChats: PropTypes.oneOfType([PropTypes.object,PropTypes.array]),
    storeReceiver: PropTypes.object,
};

export default connect(mapStateToProps)(ShareTab);
