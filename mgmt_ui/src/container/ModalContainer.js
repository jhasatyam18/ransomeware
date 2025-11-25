import React from 'react';
import { connect } from 'react-redux';
import DMModal from '../components/Modals/DMModal';

function ModalContainer(props) {
  const { modal, dispatch, user } = props;
  if (modal.length === 0 || Object.keys(modal).length === 0) {
    return null;
  }
  return (
    <>
      {modal.map((modelKey) => <DMModal dispatch={dispatch} modal={modelKey} user={user} />)}
    </>
  );
}

function mapStateToProps(state) {
  const { modal, user, dispatch } = state;
  return { modal, user, dispatch };
}

export default connect(mapStateToProps)(ModalContainer);
