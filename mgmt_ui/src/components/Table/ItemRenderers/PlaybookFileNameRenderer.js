import React from 'react';
import { Link } from 'react-router-dom';
import { PLAYBOOK_DETAILS_PAGE } from '../../../constants/RouterConstants';

function PlaybookFileNameRenderer({ data, field }) {
  const fileName = data[field] || 'File.xlsx';
  const { id } = data;
  const path = PLAYBOOK_DETAILS_PAGE.replace(':name', id);

  return (
    <Link to={`${path}`}>
      {fileName}
    </Link>
  );
}

export default PlaybookFileNameRenderer;
