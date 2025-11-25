import React from 'react';

function PlaybookIssuesColumnRenderer({ data, field }) {
  if (typeof data === 'undefined' || data.length === 0) {
    return null;
  }
  return (
    <>
      <ul type="I">
        { data[field] !== null && data[field].map((el) => (
          <li>
            {el}
          </li>
        ))}
      </ul>
    </>
  );
}

export default PlaybookIssuesColumnRenderer;
