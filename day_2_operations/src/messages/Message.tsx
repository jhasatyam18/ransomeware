import React, { FC, useEffect } from 'react';
import { UncontrolledAlert } from 'reactstrap';
import { Dispatch } from 'redux';
import { MessageProps } from '../interfaces/interface';
import { removeMessage } from '../store/reducers/messageReducer';
import { EXCLUDE_MESSAGES, MESSAGE_TYPES } from '../constants/userConstant';
interface Props {
    msgID: string;
    dispatch: Dispatch<any>;
    message: MessageProps;
}

const AppMessage: FC<Props> = ({ msgID, dispatch, message }) => {
    useEffect(() => {
        setTimeout(() => {
            const { isSticky } = message;
            if (!isSticky) {
                dispatch(removeMessage(msgID));
            }
        }, 10000);
    });

    function onDismiss() {
        dispatch(removeMessage(msgID));
    }

    function getClassName(type: string) {
        let className = '';
        switch (type) {
            case MESSAGE_TYPES.INFO:
                className = 'info ';
                break;
            case MESSAGE_TYPES.WARNING:
                className = 'warning';
                break;
            case MESSAGE_TYPES.ERROR:
                className = 'danger';
                break;
            case MESSAGE_TYPES.SUCCESS:
                className = 'success';
                break;
            default:
                className = 'primary';
        }
        return className;
    }

    const messageClass = getClassName(message.type);
    const msg = message ? message.text : '';
    if (!message || !message.text) {
        return null;
    }
    // add message which we don't want to show in EXCLUDE_MESSAGES constant
    if (EXCLUDE_MESSAGES.indexOf(msg) !== -1) {
        return null;
    }
    return (
        <div color={messageClass} className={`${messageClass} dm__message`}>
            <UncontrolledAlert color={messageClass} role="alert" className="custom-alert" toggle={onDismiss} style={{ maxWidth: 600 }}>
                {msg}
            </UncontrolledAlert>
        </div>
    );
};

export default AppMessage;
