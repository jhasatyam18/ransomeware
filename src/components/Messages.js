import React, { Component } from 'react';
import PropTypes from 'prop-types';

import AppMessage from './Message';

const propTypes = {
  dispatch: PropTypes.func.isRequired,
  messages: PropTypes.object.isRequired,
};

class AppMessages extends Component {
  renderMessages() {
    const { messages, dispatch } = this.props;
    const keys = Object.keys(messages);
    return keys.map((time) => <AppMessage dispatch={dispatch} msgID={time} key={time} message={messages[time]} />);
  }

  render() {
    const { messages } = this.props;
    const keys = Object.keys(messages);
    if (keys.length <= 0) { return null; }
    return (
      <div className="message__notification__container">
        {this.renderMessages()}
      </div>
    );
  }
}
AppMessages.propTypes = propTypes;

export default AppMessages;
