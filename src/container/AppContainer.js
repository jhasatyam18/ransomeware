import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import App from '../App';

const propTypes = {
  dispatch: PropTypes.func.isRequired,
};

class AppContainer extends Component {
  render() {
    return (
      <App {...this.props} />
    );
  }
}
AppContainer.propTypes = propTypes;

function mapStateToProps(state) {
  const {
    layout, user, sites, drPlans, jobs, dashboard,
  } = state;
  return {
    layout,
    user,
    sites,
    drPlans,
    jobs,
    dashboard,
  };
}
export default connect(mapStateToProps)(AppContainer);
