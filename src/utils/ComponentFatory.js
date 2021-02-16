import React from 'react';
import NetworkConfig from '../components/Common/NetworkConfig';
import DMFieldSelect from '../components/Shared/DMFieldSelect';
import CloudTags from '../components/Common/CloudTags';
import { STACK_COMPONENT_NETWORK, STACK_COMPONENT_SECURITY_GROUP, STACK_COMPONENT_TAGS } from '../constants/StackConstants';
import { FIELDS, REPLICATION_INTERVAL_COMP } from '../constants/FieldsConstant';
import ReplicationInterval from '../components/Forms/ReplicationInterval';
import SecurityGroups from '../components/Common/SecurityGroups';

export function getStackComponent(dispatch, user, children, conf) {
  const field = children[conf];
  switch (field.type) {
    case STACK_COMPONENT_NETWORK:
      return <NetworkConfig dispatch={dispatch} networkKey={conf} field={children[conf]} user={user} />;
    case STACK_COMPONENT_TAGS:
      return <CloudTags dispatch={dispatch} vmKey={conf} user={user} />;
    case STACK_COMPONENT_SECURITY_GROUP:
      return <SecurityGroups dispatch={dispatch} vmKey={conf} user={user} />;
    default:
      return <DMFieldSelect dispatch={dispatch} fieldKey={conf} field={children[conf]} user={user} hideLabel="true" />;
  }
}

export function getFieldCompponents(dispatch, fieldKey, user, component) {
  const field = FIELDS[fieldKey];
  switch (component) {
    case REPLICATION_INTERVAL_COMP:
      return <ReplicationInterval dispatch={dispatch} fieldKey={fieldKey} user={user} field={field} />;
    default:
      return <div>404</div>;
  }
}
