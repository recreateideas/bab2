import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { downloadFile } from '../../tools/fileManagers';
import { mapStateToProps } from '../../store/mapToProps/mapToProps_MessageBox';
const FontAwesome = require('react-fontawesome');
class MessageBox extends React.Component {

    scrollToBottom() {
        // this.messagesEnd.scrollIntoView({ behavior: "smooth" ,block: 'center',inline: 'center'});
        this.messagesEnd.parentNode.scrollTop = this.messagesEnd.offsetTop;
    }

    componentDidMount() {
        this.scrollToBottom();
    }

    componentDidUpdate() {
        this.scrollToBottom();
    }

    downloadAttachment(e,attachment) {
        // console.log(e);
        e.stopPropagation();
        // console.log(attachment);
        downloadFile({
            content: attachment.fileContent,
            filename: attachment.name
        });
    }

    renderAttachment(attachment, key, direction) {
        return (
            <div key={key} id={`attachment_${key}`} className={`attachmentFiles`} onClick={(e) => { this.downloadAttachment(e,attachment) }}>
                {this.renderFileIcon(attachment)}
                <p className='attachmentText title'>{`${attachment.name}`}</p>
                <p className='attachmentText'>{`${attachment.type} - ${attachment.size}kb`}</p>
            </div>
        );
    }

    renderFileIcon(attachment) {
        return (
            <div className={`attachmentIconWrapper`}>
                <div className={`attachmentIconFrame`} onClick={(e) => { this.downloadAttachment(e,attachment) }}>
                    <FontAwesome name='file-download' size={`2x`} className={`attachmentIcon`} />
                </div>
            </div>
        )
    }

    renderMessage(message, key) {
        const messageTypeClass = `message_bubble ${message.direction}`;
        const displayText = message.content !== '' ? '' : 'hidden';
        return (
            <div key={key} className={`messageContainer ${message.direction}`}>
                <div className={`message ${messageTypeClass}`}>
                    <p className={`h7 messageText ${displayText}`}>{`${message.content}`}</p>
                    <div className='messageAttachments'>
                        {message.attachment ? message.attachment.map((attachment, key) => this.renderAttachment(attachment, key, message.direction)) : ''}
                    </div>
                </div>
                <p className='messageDate'>{`${message.date}`}</p>
            </div>
        )
    }

    isUserActive(id) {
        const activeUsers = this.props.storeActiveUsers;
        let found = null;
        // console.log(activeUsers);
        activeUsers.filter(user => user.customId === id).forEach(user => { found = true });
        return found;
    }

    render() {
        // console.log(this.props.storeReceiver);
        const activeUser = this.isUserActive(this.props.storeReceiver.customId) ? 'activeUser' : 'inactiveUser';
        const status = this.isUserActive(this.props.storeReceiver.customId) ? '(online)' : '(offline)';
        return (
            <div className='messageBoxWrapper'>
                <div className='receiver'>
                    <div className={`connectedCircle big ${activeUser}`}></div>
                    <p className={`h7 receiverTitle`}>{this.props.storeReceiver ? this.props.storeReceiver.nickname : 'unknown'}</p>
                    <p className='statusTitle'>{` ${status}`}</p>
                </div>
                <div id="messageBox" className={`${this.props.addClass} messageBox`}>
                    {this.props.messages.map((message, key) => this.renderMessage(message, key))}
                    <div style={{ float: "left", clear: "both" }} className={`messageBottomSpacer`}
                        ref={(el) => { this.messagesEnd = el; }}>
                    </div>
                </div>
            </div>
        )
    }

};

MessageBox.propTypes = {
    storeActiveUsers: PropTypes.array,
    storeReceiver: PropTypes.object,
    storeChats: PropTypes.object,
};

export default connect(mapStateToProps)(MessageBox);
