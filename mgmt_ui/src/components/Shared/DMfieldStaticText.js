import React from 'react';
import { withTranslation } from 'react-i18next';
import { NOTE_TEXT } from '../../constants/DMNoteConstant';

function DMFieldStaticText(props) {
  const { field, user, fieldKey } = props;
  const { shouldShow, text, icon, textType, className } = field;
  const showField = typeof shouldShow === 'undefined' || (typeof shouldShow === 'function' ? shouldShow(user, fieldKey) : shouldShow);
  if (!showField) return null;
  let css = '';
  if (textType === NOTE_TEXT.WARNING) {
    css = 'card_note_warning';
  } else if (textType === NOTE_TEXT.ERROR) {
    css = 'card_note_error';
  } else {
    css = 'card_note_info';
  }
  const renderText = () => {
    if (text) {
      return (
        <p className={`${css} ${className || ''}`}>
          <i className={`${icon} ${css}`} />
            &nbsp;&nbsp;
          {text}
        </p>
      );
    }
  };

  return (
    renderText()
  );
}
export default (withTranslation()(DMFieldStaticText));
