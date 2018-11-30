import io from 'socket.io-client';
import 'regenerator-runtime';
import 'babel-polyfill';
import { findAllUsers, getMessageHistory } from './DBClientUtils';
import process_env_js from '../../.env.js';

let socket;
let userFinishedTyping;
let typingCount = 0;

const connectToSocket = (component, customId, nickname) => {
    socket = connect();


    socket.on('connect', async () => {
        console.log('EVENT: connect');
        performConnectionToSocket(socket, component, customId, nickname);
    });

    socket.on('receiveActiveUsers', (users) => {
        component.props.saveUsersToStore('activeUsers', users);
    });

    socket.on('otherUserIsTyping', (data) => {
        // console.log(data.sender.nickname);
        // console.log(`${data.sender.nickname} has ${data.activity} typing...`);
        // console.log(component);
        component.props.setTypingStatusToStore(data.sender, data.activity);
    });

    socket.on('incomingMessage', message => {
        console.log('MESSAGE', message);
        // console.log(component);
        component.props.pushMessageToHistory('received', message);
        // console.log(component);
    });

    socket.on('messageSent', message => {
        console.log('SENT MESSAGE: ', message);
        clearTimeout(userFinishedTyping);
        typingCount = 0;
        component.props.pushMessageToHistory('sent', message);
        // console.log(component);
    });

    socket.on('disconnect', () => {
        console.log('EVENT: disconnected');
        performConnectionToSocket(socket, component, customId, nickname);
    })

    socket.on('error', function () {
        console.log('EVENT: error');
        performConnectionToSocket(socket, component, customId, nickname);
    });

    socket.on('shouldReconnect', () => {
        console.log('EVENT: shouldReconnect');
        performConnectionToSocket(socket, component, customId, nickname);
    })
};

const performConnectionToSocket = async (socket, component, customId, nickname) => {
    try{
        console.log('performing connection to socket...');
        // console.log(customId);
        // console.log(nickname);
        await findAllUsers(component);
        await getMessageHistory(component);
        await socket.emit('updateClientInfo', { customId, nickname });        /* TEST --> socket.emit('updateClientInfo', { customId:'123456789', nickname: 'second_test_user2' }); */
        await socket.emit('getActiveUsers');
    }
    catch(err){
        console.log(`Error while performing connection to socket -> ${err}`);
    }
};

const connect = () => {
    socket = io(`${process_env_js.REMOTE_SOCKET_HOST}:${process_env_js.REMOTE_SOCKET_PORT}`, { reconnection: true });
    return socket;
};

const emitUserTyping = (sender, receiver) => {
    if(typingCount === 0){
        socket.emit('thisUserIsTyping', { sender, receiver, activity: 'started' });
    }
    typingCount++;
    clearTimeout(userFinishedTyping);
    userFinishedTyping = setTimeout(()=>{
        typingCount = 0;
        socket.emit('thisUserIsTyping', { sender, receiver, activity: 'finished' });
    },5000);
};

const emitMessage = (sender, message) => {
    console.log(message);
    console.log('sender --> ',sender);
    console.log('receiver ->>', message.receiver);
    socket.emit('thisUserIsTyping', { sender, receiver: message.receiver, activity: 'finished' });
    socket.emit('sendMessageToClient', { senderId: sender.customId, senderNickname: sender.nickname, message });
};

const storeClientInfo = (customId, nickname) => {
    socket.emit('updateClientInfo', { customId, nickname });
};

const disconnectSocket = (component) => {
    /*** comment to text multi sockets ***/
    socket.disconnect();/*****************/
    /*************************************/
    // console.log(socket);
    component.props.saveUsersToStore('activeUsers', []);
    component.props.saveUsersToStore('allUsers', []);
    // socket.emit('disconnect');
};

const getSocket = () => {
    return socket;
};


export { connectToSocket, storeClientInfo, emitUserTyping, emitMessage, disconnectSocket, getSocket };
