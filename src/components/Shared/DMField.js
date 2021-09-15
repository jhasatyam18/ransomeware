import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { FIELDS, FIELD_TYPE } from '../../constants/FieldsConstant';
import { getFieldComponents } from '../../utils/ComponentFactory';
import DMFieldCheckbox from './DMFieldCheckbox';
import DMFieldNumber from './DMFieldNumber';
import DMFieldRadio from './DMFieldRadio';
import DMFieldSelect from './DMFieldSelect';
import DMFieldText from './DMFieldText';
// Import Images

class DMField extends Component {
  renderField() {
    const { dispatch, fieldKey, user, disabled } = this.props;
    const field = FIELDS[fieldKey];
    const { type, COMPONENT } = field;
    switch (type) {
      case FIELD_TYPE.SELECT:
        return <DMFieldSelect dispatch={dispatch} fieldKey={fieldKey} field={field} user={user} disabled={disabled} />;
      case FIELD_TYPE.NUMBER:
        return <DMFieldNumber dispatch={dispatch} fieldKey={fieldKey} field={field} user={user} disabled={disabled} />;
      case FIELD_TYPE.CHECKBOX:
        return <DMFieldCheckbox dispatch={dispatch} fieldKey={fieldKey} field={field} user={user} disabled={disabled} />;
      case FIELD_TYPE.RADIO:
        return <DMFieldRadio dispatch={dispatch} fieldKey={fieldKey} field={field} user={user} disabled={disabled} />;
      case FIELD_TYPE.CUSTOM:
        return getFieldComponents(dispatch, fieldKey, user, COMPONENT);
      default:
        return <DMFieldText dispatch={dispatch} fieldKey={fieldKey} field={field} user={user} disabled={disabled} />;
    }
  }

  render() {
    return (
      <>
        {this.renderField()}
      </>
    );
  }
}
const propTypes = {
  dispatch: PropTypes.func.isRequired,
  fieldKey: PropTypes.string.isRequired,
  user: PropTypes.object.isRequired,
};
DMField.propTypes = propTypes;

export default DMField;
