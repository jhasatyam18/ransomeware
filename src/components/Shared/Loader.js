import React from 'react';
import { withTranslation } from 'react-i18next';
import { CardTitle } from 'reactstrap';

function Loader(props) {
  const { t } = props;
  return (
    <div className="ripple__container">
      <div className="ripple__box">
        <div className="spinner-chase">
          <div className="chase-dot" key="r-1-1" />
          <div className="chase-dot" key="r-1-2" />
          <div className="chase-dot" key="r-1-3" />
          <div className="chase-dot" key="r-1-4" />
          <div className="chase-dot" key="r-1-5" />
          <div className="chase-dot" key="r-1-6" />
        </div>
        <div className="loader-header padding-top-30">
          <CardTitle>
            {t('loading')}
          </CardTitle>
        </div>
      </div>
    </div>

  );
}

export default (withTranslation()(Loader));
