
const mapStateToProps = (state) => {
    return {
        storeChats: state.share.chats,
        storeReceiver: state.share.receiver,
    }
}


export { mapStateToProps };
