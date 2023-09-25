import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { FIELDS, FIELD_TYPE } from '../../constants/FieldsConstant';
import { getFieldComponents } from '../../utils/ComponentFactory';
import DMFieldCheckbox from './DMFieldCheckbox';
import DMFieldNumber from './DMFieldNumber';
import DMFieldRadio from './DMFieldRadio';
import DMFieldSelect from './DMFieldSelect';
import DMFieldText from './DMFieldText';
import DMFieldLabel from './DMFieldLabel';
import DMFieldRange from './DMFieldRange';
import DMTree from './DMTree';
import DMSearchSelect from './DMSearchSelect';
import DMFieldStaticText from './DMfieldStaticText';
// Import Images

class DMField extends Component {
  renderField() {
    const { dispatch, fieldKey, user, disabled, text, hideLabel } = this.props;
    const field = FIELDS[fieldKey];
    const { type, COMPONENT } = field;
    switch (type) {
      case FIELD_TYPE.SELECT:
        return <DMFieldSelect dispatch={dispatch} fieldKey={fieldKey} field={field} user={user} disabled={disabled} />;
      case FIELD_TYPE.NUMBER:
        return <DMFieldNumber dispatch={dispatch} fieldKey={fieldKey} field={field} user={user} disabled={disabled} />;
      case FIELD_TYPE.CHECKBOX:
        return <DMFieldCheckbox dispatch={dispatch} fieldKey={fieldKey} field={field} user={user} disabled={disabled} hideLabel={hideLabel} />;
      case FIELD_TYPE.RADIO:
        return <DMFieldRadio dispatch={dispatch} fieldKey={fieldKey} field={field} user={user} disabled={disabled} />;
      case FIELD_TYPE.LABEL:
        return <DMFieldLabel dispatch={dispatch} fieldKey={fieldKey} field={field} text={text} user={user} />;
      case FIELD_TYPE.RANGE:
        return <DMFieldRange dispatch={dispatch} fieldKey={fieldKey} field={field} user={user} disabled={disabled} hideLabel={hideLabel} />;
      case FIELD_TYPE.SELECT_SEARCH:
        return <DMSearchSelect dispatch={dispatch} fieldKey={fieldKey} field={field} user={user} disabled={disabled} hideLabel={hideLabel} />;
      case FIELD_TYPE.TREE:
        return <DMTree dispatch={dispatch} fieldKey={fieldKey} field={field} user={user} disabled={disabled} hideLabel={hideLabel} />;
      case FIELD_TYPE.CUSTOM:
        return getFieldComponents(dispatch, fieldKey, user, COMPONENT, hideLabel);
      case FIELD_TYPE.STATICTEXT:
        return <DMFieldStaticText dispatch={dispatch} user={user} fieldKey={fieldKey} field={field} />;
      default:
        return <DMFieldText dispatch={dispatch} fieldKey={fieldKey} field={field} user={user} hideLabel={hideLabel} disabled={disabled} />;
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
