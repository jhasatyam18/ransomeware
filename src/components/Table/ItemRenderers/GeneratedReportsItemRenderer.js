import React from 'react';
import { Link } from 'react-router-dom';
import { MODAL_GENERATE_REPORT_SCHEDULE } from '../../../constants/Modalconstant';
import { openModal } from '../../../store/actions/ModalActions';

const GeneratedReportsItemRenderer = (props) => {
  const { data, field, dispatch } = props;

  if (!data || !data[field]) {
    return <span style={{ marginLeft: '20px' }}>-</span>;
  }

  const handleLinkClick = () => {
    const options = { title: `${data.name}`, css: 'confirmation', size: 'lg', id: data.id };
    dispatch(openModal(MODAL_GENERATE_REPORT_SCHEDULE, options));
  };

  return (
    <Link style={{ marginLeft: '20px' }} onClick={handleLinkClick}>{data[field]}</Link>
  );
};

export default GeneratedReportsItemRenderer;
