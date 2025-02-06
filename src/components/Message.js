import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  UncontrolledAlert,
} from 'reactstrap';

import { removeMessage } from '../store/actions/MessageActions';

import { MESSAGE_TYPES } from '../constants/MessageConstants';
import { getMessageComponent } from '../utils/ComponentFactory';

class AppMessage extends Component {
  constructor() {
    super();
    this.onDismiss = this.onDismiss.bind(this);
  }

  componentDidMount() {
    setTimeout(
      () => {
        const { msgID, dispatch, message } = this.props;
        const { isSticky } = message;
        if (!isSticky) {
          dispatch(removeMessage(msgID));
        }
      },
      10000,
    );
  }

  onDismiss() {
    const { msgID, dispatch } = this.props;
    dispatch(removeMessage(msgID));
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
    const { message, dispatch } = this.props;
    const { data } = message;
    const messageClass = this.getClassName(message.type);
    const msg = message ? message.text : '';
    if (!message || !message.text) { return null; }
    return (
      <div className={`${messageClass} dm__message`}>
        <UncontrolledAlert color={messageClass} role="alert" toggle={this.onDismiss} style={{ maxWidth: 600 }}>
          {data && data !== null ? getMessageComponent(dispatch, data) : msg}
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
