import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { } from '../../store/actions';
// Simple bar
import SimpleBar from 'simplebar-react';
// i18n
import { withTranslation } from 'react-i18next';
import { APPLICATION_THEME, THEME_CONSTANT } from '../../constants/UserConstant';
import SidebarContent from './SidebarContent';

const Sidebar = ({ type }) => {
  const theme = localStorage.getItem(APPLICATION_THEME) || '';

  useEffect(() => {
    if (document.body) {
      if (theme !== THEME_CONSTANT.LIGHT) {
        document.body.setAttribute('data-sidebar', THEME_CONSTANT.DARK);
      } else {
        document.body.setAttribute('data-sidebar', theme);
      }
    }
  }, [theme]);

  return (
    <>
      <div className="vertical-menu">
        <div data-simplebar className="h-100">
          {type !== 'condensed' ? (
            <SimpleBar className="sidebar-height">
              <SidebarContent />
            </SimpleBar>
          ) : (
            <SidebarContent />
          )}
        </div>
      </div>
    </>
  );
};

Sidebar.propTypes = {
  type: PropTypes.string,
};

export default (withTranslation()(Sidebar));
