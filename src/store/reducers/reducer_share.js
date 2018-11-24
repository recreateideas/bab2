import constants from '../constants';
import initialState from '../initialState';

const share = (share = initialState.share, action) => {
    let messageHistory=[];
    const obj = Object.assign({}, share);
    switch (action.type) {
        case constants.SET_USERS:
            return Object.assign({}, share, { ...share, [action.usersType]: action.data });
        case constants.SET_USER_TO:
            return Object.assign({}, share, { ...share, receiver: action.receiver });
        case constants.PUSH_MESSAGE:
            if(action.message.length && action.message.length > 0){
                messageHistory = share.chats && share.chats[action.message[0].receiverId] ? share.chats[action.message[0].receiverId].messages : [];
                action.message.forEach(singleMess => {
                    // console.log( singleMess);
                    const newMessage = {
                        direction: action.direction,
                        content: singleMess.content,
                        date: singleMess.dateSent,
                        attachment: singleMess.attachment,
                    }
                    messageHistory.push(newMessage);
                });
            } else {
                messageHistory = share.chats && share.chats[action.message.receiverId] ? share.chats[action.message.receiverId].messages : [];
                const newMessage = {
                    direction: action.direction,
                    content: action.message.content,
                    date: action.message.dateSent,
                    attachment: action.message.attachment,
                }
                messageHistory.push(newMessage);
            }
            // console.log(messageHistory);
            const newState = Object.assign({}, share, { ...share, chats: { ...share.chats, [action.message.receiverId]: {...share.chats[action.message.receiverId], messages: messageHistory}} });
            localStorage.setItem('chats',JSON.stringify(newState.chats));
            return  Object.assign({}, share, newState);
        case constants.LOAD_LOCALSTORAGE_MESSASGES:
            return Object.assign({}, share, { ...share, chats: action.chats });
        case constants.SET_TYPING_STATUS:
            return Object.assign({}, share, { ...share, receiver: {...share.receiver, typing: action.typing }});
        default:
            return Object.assign({}, share, obj);
    }
}

export default share;


// LOAD_LOCALSTORAGE_MESSASGES
