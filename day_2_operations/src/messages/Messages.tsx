import React from 'react';
import { Dispatch } from 'redux';
import { MessageProps } from '../interfaces/interface';
import AppMessage from './Message';

interface Props {
    dispatch: Dispatch<any>;
    messages: Record<string, MessageProps>;
}

const AppMessages: React.FC<Props> = (props: Props) => {
    function renderMessages() {
        const { messages, dispatch } = props;
        const keys = Object.keys(messages);
        return keys.map((time) => <AppMessage dispatch={dispatch} msgID={time} key={time} message={messages[time]} />);
    }

    const { messages } = props;
    const keys = Object.keys(messages);
    if (keys.length <= 0) {
        return null;
    }
    return <div className="message__notification__container">{renderMessages()}</div>;
};

export default AppMessages;
