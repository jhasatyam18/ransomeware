import React, { Component } from 'react';
import { connect } from 'react-redux';
import Ripple from '../components/shared/Ripple';

class GlobalContainer extends Component {
  render() {
    return <Ripple {...this.props} />;
  }
}

function mapStateToProps(state) {
  const { global } = state;
  return { global };
}
export default connect(mapStateToProps)(GlobalContainer);
