import axios from 'axios';
import 'regenerator-runtime';
import {connectToSocket, disconnectSocket} from '../../tools/DBClientUtils/socketIOClientUtils';
import { dbDisconnect,getMessageHistory } from './DBClientUtils';
import process_env_js from '../../.env.js';

// import 'babel-polyfill';

const loginUser = (component, id, email, nickname) => {
    console.log('log me in');
    component.props.loginUserToStore(true);
    component.props.recordUserDetailsToStore('customId', id);
    component.props.recordUserDetailsToStore('loginEmail', email);
    component.props.recordUserDetailsToStore('nickname', nickname);
    setSavedConnectionsToStore(component,id);
};

const setSavedConnectionsToStore = (component,customId) => {
    const savedConnections = localStorage.getItem('savedConnections') ? JSON.parse(localStorage.getItem('savedConnections')) : {};
    component.props.setSavedConnectionsToStore(savedConnections[customId]);
};

const handleLoginRejection = () => {
    console.log('rejected');
};

const loginProcess = async(component,{customId, email, nickname}) =>{
    loginUser(component, customId, email, nickname);
    await connectToSocket(component, customId, nickname);
    const messageHistory = await getMessageHistory(component, customId);
    //check here
    return messageHistory;
};

const sendLoginRequest = async (e, component, validated) => {
    const userDetails = component.props.storeUser;
    if (e) e.stopPropagation();
    if (validated) {
        const loginDetails = {
            email: userDetails.loginEmail,
            password: userDetails.loginPassword
        }
        try {
            const res = await axios.post(`${process_env_js.REMOTE_HOST}:${process_env_js.REMOTE_PORT}/users/login`,{details: loginDetails});
            if (res.data.userFound) {
                const userInfo = {
                    customId: res.data.userDetails[0]._id,
                    email: res.data.userDetails[0].email,
                    nickname: res.data.userDetails[0].nickname,
                };
                console.log(userInfo);
                return await loginProcess(component,userInfo);
            }
            else handleLoginRejection();
        }
        catch (err) {
            console.log(err);
        }
    } else {
        console.log('form not valid');
    }
};

const sendRegisterRequest = async (e,component, validated) => {
    const userDetails = component.props.storeUser;
    e.stopPropagation();
    if (validated) {
        console.log(userDetails);
        const registerDetails = {
            nickname: userDetails.nickname,
            email: userDetails.registerEmail,
            password: userDetails.passWord,
        }
        try {
            console.log(`${process_env_js.REMOTE_HOST}:${process_env_js.REMOTE_PORT}/users/register`);
            const res = await axios.post(`${process_env_js.REMOTE_HOST}:${process_env_js.REMOTE_PORT}/users/register`,
                {
                    details: registerDetails
                })
            console.log(res.data);
            const userInserted = res.data.userInserted;
            const userInfo = {
                customId: res.data._id,
                email: res.data.email,
                nickname: res.data.nickname,
            };
            if (userInserted) loginProcess(component,userInfo);
        }
        catch (err) {
            console.log(err);
        }
    } else {
        console.log('form not valid');
    }
};

const sendLogout = (e,component) => {
    dbDisconnect(e, component);
    disconnectSocket(component);
};

export { sendLoginRequest,sendRegisterRequest,sendLogout }
