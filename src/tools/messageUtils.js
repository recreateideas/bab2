

const formatMessages = (userId, messageHistory) => {
    let formattedMessages = {};
    console.log('@@@ messageHistory',messageHistory);
    // let newId='',newDirection='';
    if(messageHistory && messageHistory.length > 0){
        messageHistory.forEach(message => {
            if (!formattedMessages.hasOwnProperty(message.receiverId) && message.receiverId !== userId) {
                console.log('1');
                formattedMessages[message.receiverId] = {
                    messages: [
                        {
                            direction: 'sent',
                            content: message.content,
                            date: message.dateSent,
                            attachment: message.attachment,
                        }
                    ]
                };
            } else if (!formattedMessages.hasOwnProperty(message.senderId) && message.senderId !== userId) {
                console.log('2');
                formattedMessages[message.senderId] = {
                    messages: [
                        {
                            direction: 'received',
                            content: message.content,
                            date: message.dateSent,
                            attachment: message.attachment,
                        }
                    ]
                };
            } else if (formattedMessages.hasOwnProperty(message.receiverId) && message.receiverId !== userId) {
                console.log('3');
                formattedMessages[message.receiverId].messages.push(
                    {
                        direction: 'sent',
                        content: message.content,
                        date: message.dateSent,
                        attachment: message.attachment,
                    }
                )
            } else if (formattedMessages.hasOwnProperty(message.senderId) && message.senderId !== userId) {
                console.log('4');
                formattedMessages[message.senderId].messages.push(
                    {
                        direction:'received',
                        content: message.content,
                        date: message.dateSent,
                        attachment: message.attachment,
                    }
                )
            }
        });
    }
    return formattedMessages;
};

const formatDate = (date) => {
    return [date.getMonth() + 1,
    date.getDate(),
    date.getFullYear()].join('/') + ' ' +
        [date.getHours(),
        date.getMinutes(),
        date.getSeconds()].join(':');
}

export { formatMessages, formatDate }
