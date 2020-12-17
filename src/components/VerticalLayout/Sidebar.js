import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { withRouter } from 'react-router-dom';
import { } from '../../store/actions';

// Simple bar
import SimpleBar from 'simplebar-react';

// i18n
import { withTranslation } from 'react-i18next';
import SidebarContent from './SidebarContent';

class Sidebar extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    if (document.body) document.body.setAttribute('data-sidebar', 'dark');
  }

  render() {
    const { type } = this.props;
    return (
      <>
        <div className="vertical-menu">
          <div data-simplebar className="h-100">
            {type !== 'condensed' ? (
              <SimpleBar style={{ maxHeight: '100%' }}>
                <SidebarContent />
              </SimpleBar>
            ) : (
              <SidebarContent />
            )}
          </div>
        </div>
      </>
    );
  }
}

Sidebar.propTypes = {
  type: PropTypes.string,
};

export default (withRouter(withTranslation()(Sidebar)));
