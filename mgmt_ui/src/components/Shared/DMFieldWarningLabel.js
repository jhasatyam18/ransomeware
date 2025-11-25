import React from 'react';
import { withTranslation } from 'react-i18next';

function DMFieldWarningLabel(props) {
  const { field, user, fieldKey } = props;
  const { shouldShow, text } = field;
  const showField = typeof shouldShow === 'undefined' || (typeof shouldShow === 'function' ? shouldShow(user, fieldKey) : shouldShow);
  if (!showField) return null;
  const renderText = () => (
    <div className="card_note_warning margin-top-5">
      <i className="fas fa-exclamation-triangle text-warning" />
              &nbsp;&nbsp;&nbsp;
      {text}
    </div>
  );

  return renderText();
}
export default (withTranslation()(DMFieldWarningLabel));
