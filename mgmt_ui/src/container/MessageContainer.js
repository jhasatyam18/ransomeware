import React, { Component } from 'react';
import { connect } from 'react-redux';
import AppMessages from '../components/Messages';

class MessageContainer extends Component {
  render() {
    return <AppMessages {...this.props} />;
  }
}

function mapStateToProps(state) {
  const { messages } = state;
  return { messages };
}
export default connect(mapStateToProps)(MessageContainer);
