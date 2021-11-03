import React from 'react';
import { withTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

function DMBreadCrumb(props) {
  const { links, t } = props;
  function renderList() {
    const items = links.map((item) => (
      <li className="breadcrumb-item">
        <Link to={item.link} className="text-secondary">
          {t(`${item.label}`)}
        </Link>
      </li>
    ));
    return items;
  }
  return (
    <ol className="breadcrumb">
      {renderList()}
    </ol>
  );
}
export default (withTranslation()(DMBreadCrumb));
