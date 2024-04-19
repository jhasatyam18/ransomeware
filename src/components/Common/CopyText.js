import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCopy } from '@fortawesome/free-solid-svg-icons';
import { withTranslation } from 'react-i18next';
import { COPY_TEXT } from '../../constants/InputConstants';

const CopyText = ({ text, head, t }) => {
  const [copyText, setCopyText] = useState(t('Copy'));
  const handleCopy = () => {
    const textToCopy = Array.isArray(text) ? text.join('\n') : text;
    navigator.clipboard.writeText(textToCopy);
    setCopyText(t('copied'));
    setTimeout(() => {
      setCopyText(t('Copy'));
    }, COPY_TEXT.TEXT_CHANGE_TIMEOUT);
  };

  const renderCommands = () => {
    if (Array.isArray(text)) {
      return text.map((command) => <div key={command}>{command}</div>);
    }
    return <div>{text}</div>;
  };

  return (
    <div className="copy_text w-100">
      <div className="header">
        <div className="text-muted">
          <span>{head}</span>
        </div>
        <div className="copyIcon">
          <a href="#" onClick={handleCopy}>
            <FontAwesomeIcon icon={faCopy} style={{ marginRight: '5px' }} />
            {copyText}
          </a>
        </div>
      </div>
      <div className="data">
        {renderCommands()}
      </div>
    </div>
  );
};

export default (withTranslation()(CopyText));
