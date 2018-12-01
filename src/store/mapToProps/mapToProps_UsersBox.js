import constants from '../constants';

const mapStateToProps = (state) => {
    return {
        storeAllUsers: state.share.allUsers,
        storeUser: state.user,
        storeActiveUsers: state.share.activeUsers,
        storeReceiver: state.share.receiver,
    }
}

const mapDispatchToProps = (dispatch) => {
    
    return {
        setReceiverToStore: (receiver) => {
            const action = {
                type: constants.SET_USER_TO,
                receiver
            }
            dispatch(action) 
        }
    }
}

export { mapStateToProps, mapDispatchToProps};
