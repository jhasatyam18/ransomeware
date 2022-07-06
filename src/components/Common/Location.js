import React from 'react';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';
import { getValue } from '../../utils/InputUtils';
import { openModal } from '../../store/actions/ModalActions';
import { MODAL_LOCATION_CONFIG } from '../../constants/Modalconstant';

function Location(props) {
  const { dispatch, field, fieldKey, user, t } = props;
  const { values } = user;
  let labelValue = getValue(fieldKey, values);
  let loc = '';
  if (labelValue.length > 0) {
    labelValue = labelValue[0].split(':');
    const [i] = labelValue;
    loc = i;
  }

  const handleClick = () => {
    const options = field;
    options.fieldKey = fieldKey;
    dispatch(openModal(MODAL_LOCATION_CONFIG, options));
  };

  return (
    <>
      <tr>
        <td className="padding-left-20">
          <a href="#" onClick={() => handleClick()}>
            {t('title.select')}
            &nbsp;&nbsp;
          </a>
          {loc}
        </td>
      </tr>
    </>
  );
}

function mapStateToProps(state) {
  const { user, dispatch } = state;
  return { user, dispatch };
}

export default connect(mapStateToProps)(withTranslation()(Location));
