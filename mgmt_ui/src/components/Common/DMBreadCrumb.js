import React from 'react';
import { withTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

function DMBreadCrumb(props) {
  const { links, t } = props;
  function renderList() {
    const items = links.map((item, index) => (
      <li className="breadcrumb-item" key={`breadcrumb-${item.link}-${index + 1}`}>
        <Link to={item.link} className="text-muted">
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
