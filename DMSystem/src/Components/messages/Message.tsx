import React, { FC, useEffect } from 'react';
import { UncontrolledAlert } from 'reactstrap';
import { Dispatch } from 'redux';
import { MessageProps } from '../../interfaces/interfaces';
import { MESSAGE_TYPES } from '../../Constants/MessageConstants';
import { removeMessage } from '../../store/actions/MessageActions';

interface Props {
    msgID: string;
    dispatch: Dispatch<any>;
    message: MessageProps;
}

const AppMessage: FC<Props> = (props) => {
    useEffect(() => {
        setTimeout(() => {
            const { msgID, dispatch, message } = props;
            const { isSticky } = message;
            if (!isSticky) {
                dispatch(removeMessage(msgID));
            }
        }, 10000);
    });

    function onDismiss() {
        const { msgID, dispatch } = props;
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

    const { message } = props;
    const messageClass = getClassName(message.type);
    const msg = message ? message.text : '';
    if (!message || !message.text) {
        return null;
    }
    return (
        <div className={`${messageClass} dm__message`}>
            <UncontrolledAlert color={messageClass} role="alert" toggle={onDismiss} style={{ maxWidth: 600 }}>
                {msg}
            </UncontrolledAlert>
        </div>
    );
};

export default AppMessage;
