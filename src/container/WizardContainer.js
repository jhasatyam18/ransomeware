import React, { Component } from 'react';
import { connect } from 'react-redux';

const DMWizard = React.lazy(() => import('../components/Wizards/DMWizard'));
class ModalContainer extends Component {
  render() {
    const { wizard, dispatch, user } = this.props;
    const { show, options } = wizard;
    if (show) {
      return <DMWizard dispatch={dispatch} wizard={wizard} user={user} options={options} />;
    }
    return null;
  }
}

function mapStateToProps(state) {
  const { wizard, user } = state;
  return { wizard, user };
}
export default connect(mapStateToProps)(ModalContainer);
