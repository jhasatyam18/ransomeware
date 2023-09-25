import React from 'react';
import { withTranslation } from 'react-i18next';
import { NOTE_TEXT } from '../../constants/DMNoteConstant';

function DMFieldStaticText(props) {
  const { field, user, fieldKey } = props;
  const { shouldShow, text, icon, textType } = field;
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
        <span className={`${css} `}>
          <i className={icon} />
          &nbsp;&nbsp;&nbsp;
          {text}
        </span>
      );
    }
  };

  return (
    renderText()
  );
}
export default (withTranslation()(DMFieldStaticText));
