import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  UncontrolledAlert,
} from 'reactstrap';

import { removeMessage } from '../store/actions/MessageActions';

import { MESSAGE_TYPES } from '../constants/MessageConstants';

class AppMessage extends Component {
  constructor() {
    super();
    setTimeout(
      () => {
        const { msgID, dispatch } = this.props;
        dispatch(removeMessage(msgID));
      },
      10000,
    );
  }

  getClassName(type) {
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
      default: className = 'primary';
    }
    return className;
  }

  render() {
    const { message } = this.props;
    const messageClass = this.getClassName(message.type);
    const msg = message ? message.text : '';
    if (!message || !message.text) { return null; }
    return (
      <div className={`${messageClass}`}>
        <UncontrolledAlert color={messageClass} role="alert">
          {msg}
        </UncontrolledAlert>
      </div>
    );
  }
}
const propTypes = {
  dispatch: PropTypes.func.isRequired,
  message: PropTypes.object.isRequired,
  msgID: PropTypes.any.isRequired,
};
AppMessage.propTypes = propTypes;

export default AppMessage;
