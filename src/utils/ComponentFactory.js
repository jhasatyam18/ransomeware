import React from 'react';
import VMVmwarePlacementInfoItemRenderer from '../components/Table/ItemRenderers/VMVmwarePlacementInfoItemRenderer';
import VMInstanceItemRenderer from '../components/Table/ItemRenderers/VMInstanceItemRenderer';
import Memory from '../components/Common/InstanceMemory';
import DMTree from '../components/Shared/DMTree';
import CloudTags from '../components/Common/CloudTags';
import NetworkConfig from '../components/Common/NetworkConfig';
import Location from '../components/Common/Location';
import SecurityGroups from '../components/Common/SecurityGroups';
import ReplicationInterval from '../components/Forms/ReplicationInterval';
import DMDatePicker from '../components/Shared/DMDatePicker';
import DMFieldNumber from '../components/Shared/DMFieldNumber';
import DMFieldSelect from '../components/Shared/DMFieldSelect';
import DMMultiSelect from '../components/Shared/DMMultiSelect';
import DMTimePicker from '../components/Shared/DMTimePicker';
import AlertAckItemRenderer from '../components/Table/ItemRenderers/AlertAckItemRendrer';
import DateItemRenderer from '../components/Table/ItemRenderers/DateItemRenderer';
import DRPlanNameItemRenderer from '../components/Table/ItemRenderers/DRPlanNameItemRenderer';
import EmailRecipientItemRenderer from '../components/Table/ItemRenderers/EmailRecipientItemRenderer';
import EventLevelItemRenderer from '../components/Table/ItemRenderers/EventLevelItemRenderer';
import LicenseActionItemRenderer from '../components/Table/ItemRenderers/LicenseActionItemRenderer';
import LicenseStatusItemRender from '../components/Table/ItemRenderers/LicenseStatusItemRender';
import LicenseUsageItemRenderer from '../components/Table/ItemRenderers/LicenseUsageItemRenderer';
import NodeActionItemRenderer from '../components/Table/ItemRenderers/NodeActionItemRenderer';
import NodeNameItemRenderer from '../components/Table/ItemRenderers/NodeNameItemRenderer';
// Table Item renderers
import OsTypeItemRenderer from '../components/Table/ItemRenderers/OsTypeItemRenderer';
import RecoverySiteLinkRenderer from '../components/Table/ItemRenderers/RecoverySiteLinkRenderer';
import RecoveryStatusItemRenderer from '../components/Table/ItemRenderers/RecoveryStatusItemRenderer';
import RecoveryTypeItemRenderer from '../components/Table/ItemRenderers/RecoveryTypeItemRenderer';
import ReplicationIntervalItemRenderer from '../components/Table/ItemRenderers/ReplicationIntervalItemRenderer';
import RoleItemRenderer from '../components/Table/ItemRenderers/RoleItemRenderer';
import ServerPortItemRenderer from '../components/Table/ItemRenderers/ServerPortItemRenderer';
import SizeItemRenderer from '../components/Table/ItemRenderers/SizeItemRenderer';
import SshRdpRenderer from '../components/Table/ItemRenderers/SshRdpRenderer';
import StatusItemRenderer from '../components/Table/ItemRenderers/StatusItemRenderer';
import SupportBundleActionsRenderer from '../components/Table/ItemRenderers/SupportBundleActionsRenderer';
import ThrottlingItemRenderer from '../components/Table/ItemRenderers/ThrottlingItemRenderer';
import ThrottlingTimeRenderer from '../components/Table/ItemRenderers/ThrottlingTimeRenderer';
import TimeDurationItemRenderer from '../components/Table/ItemRenderers/TimeDurationItemRenderer';
import TransferSizeItemRenderer from '../components/Table/ItemRenderers/TransferSizeItemRenderer';
import ViewAlertInfoItemRenderer from '../components/Table/ItemRenderers/ViewAlertInfoItemRenderer';
import VMBootOrderItemRenderer from '../components/Table/ItemRenderers/VMBootOrderItemRenderer';
import VMDisksItemRenderer from '../components/Table/ItemRenderers/VMDisksItemRenderer';
import VMPasswordItemRenderer from '../components/Table/ItemRenderers/VMPasswordItemRenderer';
import VMSizeItemRenderer from '../components/Table/ItemRenderers/VMSizeItemRenderer';
import VMUsernameItemRenderer from '../components/Table/ItemRenderers/VMUsernameItemRenderer';
import VMNetworkInfoItemRenderer from '../components/Table/ItemRenderers/VMNetworkInfoItemRenderer';
import { DATE_PICKER_COMP, FIELDS, FIELD_TYPE, MULTISELECT_ITEM_COMP, REPLICATION_INTERVAL_COMP, TIME_PICKER_COMP } from '../constants/FieldsConstant';
import { STACK_COMPONENT_NETWORK, STACK_COMPONENT_LOCATION, STACK_COMPONENT_MEMORY, STACK_COMPONENT_SECURITY_GROUP, STACK_COMPONENT_TAGS } from '../constants/StackConstants';
import { ALERT_ACK_ITEM_RENDERER, DATE_ITEM_RENDERER, DR_PLAN_NAME_ITEM_RENDERER, EMAIL_RECIPIENT_ACTION_ITEM_RENDER, EVENT_LEVEL_ITEM_RENDERER, LICENSE_ACTION_ITEM_RENDERER, LICENSE_STATUS_ITEM_RENDER, LICENSE_USAGE_ITEM_RENDERER, NODE_ACTION_RENDERER, NODE_NAME_ITEM_RENDERER, OS_TYPE_ITEM_RENDERER, PROTECTED_VM_ACTIONS_ITEM_ITEM_RENDERER, PROTECTION_SITE_LINK_ITEM_RENDERER, RECOVERY_SITE_LINK_ITEM_RENDERER, RECOVERY_STATUS_ITEM_RENDERER, RECOVERY_TYPE_ITEM_RENDERER, REPLICATION_INTERVAL_ITEM_RENDERER, ROLE_ITEM_RENDERER, SCRIPT_ITEM_RENDERER, SERVER_PORT_ITEM_RENDERER, SITE_LOCATION_ITEM_RENDERER, SIZE_ITEM_RENDERER, SSH_RDP_ITEM_RENDERER, STATUS_ITEM_RENDERER, SUPPORT_BUNDLE_ACTION_ITEM_RENDERER, THROTTLING_ACTION_ITEM_RENDER, THROTTLING_TIME_ITEM_RENDER, TIME_DURATION_RENDERER, TRANSFER_SIZE_ITEM_RENDERER, VIEW_ALERT_INFO_RENDERER, VM_BOOT_ORDER_ITEM_RENDER, VM_DISK_ITEM_RENDERER, VM_NETWORK_INFO_ITEM_RENDERER, VM_SIZE_ITEM_RENDERER, VM_UPASSWORD_ITEM_RENDERER, VM_USERNAME_ITEM_RENDERER } from '../constants/TableConstants';
import ScriptItemRenderer from '../components/Table/ItemRenderers/ScriptItemRenderer';
import ProtectedSiteLinkRenderer from '../components/Table/ItemRenderers/ProtectedSiteLinkItemRenderer';
import DMSearchSelect from '../components/Shared/DMSearchSelect';
import ProtectedVMItemRenderer from '../components/Table/ItemRenderers/ProtectedVMItemRenderer';
import SiteLocationItemRenderer from '../components/Table/ItemRenderers/SiteLocationItemRenderer';

export function getStackComponent(dispatch, user, children, conf, data) {
  const field = children[conf];
  switch (field.type) {
    case STACK_COMPONENT_NETWORK:
      return <NetworkConfig dispatch={dispatch} networkKey={conf} field={children[conf]} user={user} data={data} />;
    case STACK_COMPONENT_TAGS:
      return <CloudTags dispatch={dispatch} vmKey={conf} user={user} field={field} />;
    case STACK_COMPONENT_SECURITY_GROUP:
      return <SecurityGroups dispatch={dispatch} vmKey={conf} user={user} field={field} />;
    case FIELD_TYPE.NUMBER:
      return <DMFieldNumber dispatch={dispatch} fieldKey={conf} field={children[conf]} user={user} hideLabel="true" />;
    case FIELD_TYPE.SELECT_SEARCH:
      return <DMSearchSelect dispatch={dispatch} fieldKey={conf} field={children[conf]} user={user} hideLabel="true" />;
    case FIELD_TYPE.TREE:
      return <DMTree dispatch={dispatch} fieldKey={conf} field={children[conf]} user={user} hideLabel="true" />;
    case STACK_COMPONENT_LOCATION:
      return <Location dispatch={dispatch} fieldKey={conf} field={children[conf]} user={user} hideLabel="true" />;
    case STACK_COMPONENT_MEMORY:
      return <Memory dispatch={dispatch} fieldKey={conf} field={children[conf]} user={user} hideLabel="true" />;
    default:
      return <DMFieldSelect dispatch={dispatch} fieldKey={conf} field={children[conf]} user={user} hideLabel="true" />;
  }
}

export function getFieldComponents(dispatch, fieldKey, user, component, hideLabel) {
  const field = FIELDS[fieldKey];
  switch (component) {
    case REPLICATION_INTERVAL_COMP:
      return <ReplicationInterval dispatch={dispatch} fieldKey={fieldKey} user={user} field={field} hideLabel={hideLabel} />;
    case MULTISELECT_ITEM_COMP:
      return <DMMultiSelect dispatch={dispatch} fieldKey={fieldKey} user={user} field={field} hideLabel={hideLabel} />;
    case DATE_PICKER_COMP:
      return <DMDatePicker dispatch={dispatch} fieldKey={fieldKey} user={user} field={field} hideLabel={hideLabel} />;
    case TIME_PICKER_COMP:
      return <DMTimePicker dispatch={dispatch} fieldKey={fieldKey} user={user} field={field} hideLabel={hideLabel} />;
    default:
      return <div>404</div>;
  }
}

export function getItemRendererComponent(render, data, field, user, dispatch) {
  switch (render) {
    case OS_TYPE_ITEM_RENDERER:
      return <OsTypeItemRenderer data={data} />;
    case VM_SIZE_ITEM_RENDERER:
      return <VMSizeItemRenderer data={data} />;
    case DR_PLAN_NAME_ITEM_RENDERER:
      return <DRPlanNameItemRenderer data={data} />;
    case DATE_ITEM_RENDERER:
      return <DateItemRenderer data={data} field={field} />;
    case STATUS_ITEM_RENDERER:
      return <StatusItemRenderer data={data} field={field} />;
    case TRANSFER_SIZE_ITEM_RENDERER:
      return <TransferSizeItemRenderer data={data} field={field} />;
    case RECOVERY_TYPE_ITEM_RENDERER:
      return <RecoveryTypeItemRenderer data={data} field={field} />;
    case TIME_DURATION_RENDERER:
      return <TimeDurationItemRenderer data={data} field={field} />;
    case RECOVERY_SITE_LINK_ITEM_RENDERER:
      return <RecoverySiteLinkRenderer data={data} field={field} user={user} />;
    case SSH_RDP_ITEM_RENDERER:
      return <SshRdpRenderer data={data} field={field} user={user} />;
    case VM_USERNAME_ITEM_RENDERER:
      return <VMUsernameItemRenderer data={data} user={user} dispatch={dispatch} />;
    case VM_UPASSWORD_ITEM_RENDERER:
      return <VMPasswordItemRenderer data={data} user={user} dispatch={dispatch} />;
    case REPLICATION_INTERVAL_ITEM_RENDERER:
      return <ReplicationIntervalItemRenderer data={data} field={field} />;
    case EVENT_LEVEL_ITEM_RENDERER:
      return <EventLevelItemRenderer data={data} field={field} />;
    case ALERT_ACK_ITEM_RENDERER:
      return <AlertAckItemRenderer data={data} field={field} dispatch={dispatch} />;
    case VIEW_ALERT_INFO_RENDERER:
      return <ViewAlertInfoItemRenderer data={data} field={field} dispatch={dispatch} />;
    case SERVER_PORT_ITEM_RENDERER:
      return <ServerPortItemRenderer data={data} />;
    case SIZE_ITEM_RENDERER:
      return <SizeItemRenderer data={data} field={field} />;
    case SUPPORT_BUNDLE_ACTION_ITEM_RENDERER:
      return <SupportBundleActionsRenderer data={data} field={field} dispatch={dispatch} />;
    case NODE_NAME_ITEM_RENDERER:
      return <NodeNameItemRenderer data={data} />;
    case EMAIL_RECIPIENT_ACTION_ITEM_RENDER:
      return <EmailRecipientItemRenderer data={data} dispatch={dispatch} user={user} />;
    case THROTTLING_ACTION_ITEM_RENDER:
      return <ThrottlingItemRenderer data={data} dispatch={dispatch} user={user} />;
    case NODE_ACTION_RENDERER:
      return <NodeActionItemRenderer data={data} dispatch={dispatch} user={user} />;
    case VM_BOOT_ORDER_ITEM_RENDER:
      return <VMBootOrderItemRenderer data={data} user={user} dispatch={dispatch} />;
    case LICENSE_USAGE_ITEM_RENDERER:
      return <LicenseUsageItemRenderer data={data} field={field} />;
    case LICENSE_ACTION_ITEM_RENDERER:
      return <LicenseActionItemRenderer data={data} dispatch={dispatch} user={user} />;
    case LICENSE_STATUS_ITEM_RENDER:
      return <LicenseStatusItemRender data={data} field={field} />;
    case THROTTLING_TIME_ITEM_RENDER:
      return <ThrottlingTimeRenderer data={data} field={field} />;
    case RECOVERY_STATUS_ITEM_RENDERER:
      return <RecoveryStatusItemRenderer data={data} />;
    case VM_DISK_ITEM_RENDERER:
      return <VMDisksItemRenderer data={data} />;
    case ROLE_ITEM_RENDERER:
      return <RoleItemRenderer data={data} />;
    case VM_NETWORK_INFO_ITEM_RENDERER:
      return <VMNetworkInfoItemRenderer data={data} />;
    case SCRIPT_ITEM_RENDERER:
      return <ScriptItemRenderer data={data} dispatch={dispatch} user={user} />;
    case PROTECTED_VM_ACTIONS_ITEM_ITEM_RENDERER:
      return <ProtectedVMItemRenderer data={data} dispatch={dispatch} />;
    case PROTECTION_SITE_LINK_ITEM_RENDERER:
      return <ProtectedSiteLinkRenderer data={data} user={user} />;
    case VMInstanceItemRenderer:
      return <VMInstanceItemRenderer data={data} />;
    case VMVmwarePlacementInfoItemRenderer:
      return <VMVmwarePlacementInfoItemRenderer data={data} />;
    case SITE_LOCATION_ITEM_RENDERER:
      return <SiteLocationItemRenderer data={data} dispatch={dispatch} user={user} />;
    default:
      return (<div> 404 </div>);
  }
}
