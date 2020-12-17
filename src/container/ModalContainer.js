import React, { Component } from 'react';
import { connect } from 'react-redux';
import DMModal from '../components/Modals/DMModal';

class ModalContainer extends Component {
  render() {
    const { modal, dispatch, user } = this.props;
    return <DMModal disatch={dispatch} modal={modal} user={user} {...this.props} />;
  }
}

function mapStateToProps(state) {
  const { modal, user } = state;
  return { modal, user };
}
export default connect(mapStateToProps)(ModalContainer);
