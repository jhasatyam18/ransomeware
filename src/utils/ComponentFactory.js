import React from 'react';
import VmNameLinkRenderer from '../components/Table/ItemRenderers/VmNameLinkRenderer';
import VmRpoStatusItemRenderer from '../components/Table/ItemRenderers/VmRpoStatusItemRenderer';
import ReverseDisabledVmWarningModal from '../components/Table/ItemRenderers/ReverseDisabledVmWarningModal';
import VmReplStatusRenderer from '../components/Table/ItemRenderers/VmReplStatusRenderer';
import { MODAL_SHOW_WINPREP_UPDATE_WARNING } from '../constants/Modalconstant';
import WinPrepUpdateWarningMsg from '../components/Modals/WinPrepUpdateWarningMsg';
import ReportScheduleRenderer from '../components/Table/ItemRenderers/ReportScheduleRenderer';
import GeneratedReportsItemRenderer from '../components/Table/ItemRenderers/GeneratedReportsItemRenderer';
import UpdateScheduleRenderer from '../components/Table/ItemRenderers/UpdateScheduleRenderer';
import ReportProtectionPlanComp from '../components/Shared/ReportProtectionPlanComp';
import ReportScheduleEmailRenderer from '../components/Table/ItemRenderers/ReportScheduleEmailRenderer';
import ReportVMSIterationRenderer from '../components/Table/ItemRenderers/ReportVMSIterationRenderer';
import DMFieldText from '../components/Shared/DMFieldText';
import VMTenancyTypeItemRenderer from '../components/Table/ItemRenderers/VMTenancyTypeItemRenderer';
import LatestRefeshRecoveryStatus from '../components/Table/ItemRenderers/LatestRefeshRecoveryStatus';
import CloudTags from '../components/Common/CloudTags';
import Memory from '../components/Common/InstanceMemory';
import Location from '../components/Common/Location';
import NetworkConfig from '../components/Common/NetworkConfig';
import SecurityGroups from '../components/Common/SecurityGroups';
import ReplicationInterval from '../components/Forms/ReplicationInterval';
import PlaybookChangesRenderer from '../components/DRPlans/Playbook/PlaybookChangesRenderer';
import SinglePlaybookActions from '../components/DRPlans/Playbook/SinglePlaybookActions';
import SinglePlaybookStatusRenderer from '../components/DRPlans/Playbook/SinglePlaybookStatusRenderer';
import DMDatePicker from '../components/Shared/DMDatePicker';
import DMFieldNumber from '../components/Shared/DMFieldNumber';
import DMFieldSelect from '../components/Shared/DMFieldSelect';
import DMMultiSelect from '../components/Shared/DMMultiSelect';
import DMSearchSelect from '../components/Shared/DMSearchSelect';
import DMTimePicker from '../components/Shared/DMTimePicker';
import DMTree from '../components/Shared/DMTree';
import AlertAckItemRenderer from '../components/Table/ItemRenderers/AlertAckItemRendrer';
import CheckpoinLinkRenderer from '../components/Table/ItemRenderers/CheckpointLinkRenderer';
import CheckpointRecoveryJobItemRenderer from '../components/Table/ItemRenderers/CheckpointRecoveryJobItemRenderer';
import DateItemRenderer from '../components/Table/ItemRenderers/DateItemRenderer';
import DiskReplicationTypeItemRenderer from '../components/Table/ItemRenderers/DiskReplicationTypeItemRenderer';
import DownloadPlaybookFromPlanList from '../components/Table/ItemRenderers/DownloadPlaybookFromPlanList';
import DRPlanNameItemRenderer from '../components/Table/ItemRenderers/DRPlanNameItemRenderer';
import EmailRecipientItemRenderer from '../components/Table/ItemRenderers/EmailRecipientItemRenderer';
import EntityTypeOptionRenderer from '../components/Table/ItemRenderers/EntityTypeOptionRenderer';
import EventDescriptionRenderer from '../components/Table/ItemRenderers/EventDescriptionRenderer';
import EventLevelItemRenderer from '../components/Table/ItemRenderers/EventLevelItemRenderer';
import LicenseActionItemRenderer from '../components/Table/ItemRenderers/LicenseActionItemRenderer';
import LicenseStatusItemRender from '../components/Table/ItemRenderers/LicenseStatusItemRender';
import LicenseUsageItemRenderer from '../components/Table/ItemRenderers/LicenseUsageItemRenderer';
import NodeActionItemRenderer from '../components/Table/ItemRenderers/NodeActionItemRenderer';
import NodeNameItemRenderer from '../components/Table/ItemRenderers/NodeNameItemRenderer';
import NodeStatusRenderer from '../components/Table/ItemRenderers/NodeStatusRenderer';
// Table Item renderers
import OsTypeItemRenderer from '../components/Table/ItemRenderers/OsTypeItemRenderer';
import PlaybookPlanNameRenderer from '../components/Table/ItemRenderers/PaybookPlanNameRenderer';
import PlatformtypeItemRenderer from '../components/Table/ItemRenderers/PlatformtypeItemRenderer';
import PlaybookConfigureRenderer from '../components/Table/ItemRenderers/PlaybookConfigureRenderer';
import PlaybookFileNameRenderer from '../components/Table/ItemRenderers/PlaybookFileNameRenderer';
import PlaybookIssuesColumnRenderer from '../components/Table/ItemRenderers/PlaybookIssuesColumnRenderer';
import PlaybookPlanStatusRenderer from '../components/Table/ItemRenderers/PlaybookPlanStatusRenderer';
import PreserveCheckpoint from '../components/Table/ItemRenderers/PreserveCheckpoint';
import ProtectedSiteLinkRenderer from '../components/Table/ItemRenderers/ProtectedSiteLinkItemRenderer';
import ProtectedVMItemRenderer from '../components/Table/ItemRenderers/ProtectedVMItemRenderer';
import QuiesceSourceSnapItemRenderer from '../components/Table/ItemRenderers/QuiesceSourceSnapItemRenderer';
import QuiesceVmNameRenderer from '../components/Table/ItemRenderers/QuiesceVmNameRenderer';
import RecveryCheckpointOptionRenderer from '../components/Table/ItemRenderers/RecoveryCheckpointOptionRenderer';
import RecoverySiteLinkRenderer from '../components/Table/ItemRenderers/RecoverySiteLinkRenderer';
import RecoveryStatusItemRenderer from '../components/Table/ItemRenderers/RecoveryStatusItemRenderer';
import RecoveryStatusRenderer from '../components/Table/ItemRenderers/RecoveryStatusRenderer';
import RecoveryTypeItemRenderer from '../components/Table/ItemRenderers/RecoveryTypeItemRenderer';
import ReplicationIntervalItemRenderer from '../components/Table/ItemRenderers/ReplicationIntervalItemRenderer';
import ReplicationPriorityItemRenderer from '../components/Table/ItemRenderers/ReplicationPriorityItemRenderer';
import ReplicationTypeOptionRenderer from '../components/Table/ItemRenderers/ReplicationTypeOptionRenderer';
import JobsVMNameRenderer from '../components/Table/ItemRenderers/ReplicationVMNameRenderer';
import ReverseEntityTypeRenderer from '../components/Table/ItemRenderers/ReverseEntityTypeRenderer';
import ReverseVMDescriptionRenderer from '../components/Table/ItemRenderers/ReverseVMDescriptionRenderer';
import RoleItemRenderer from '../components/Table/ItemRenderers/RoleItemRenderer';
import ScriptItemRenderer from '../components/Table/ItemRenderers/ScriptItemRenderer';
import ServerPortItemRenderer from '../components/Table/ItemRenderers/ServerPortItemRenderer';
import SiteLinkRenderer from '../components/Table/ItemRenderers/SiteLinkRenderer';
import SiteLocationItemRenderer from '../components/Table/ItemRenderers/SiteLocationItemRenderer';
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
import VMInstanceItemRenderer from '../components/Table/ItemRenderers/VMInstanceItemRenderer';
import VMNetworkInfoItemRenderer from '../components/Table/ItemRenderers/VMNetworkInfoItemRenderer';
import VMPasswordItemRenderer from '../components/Table/ItemRenderers/VMPasswordItemRenderer';
import VMPlacementInfoItemRenderer from '../components/Table/ItemRenderers/VMPlacementInfoItemRenderer';
import VMSizeItemRenderer from '../components/Table/ItemRenderers/VMSizeItemRenderer';
import VMUsernameItemRenderer from '../components/Table/ItemRenderers/VMUsernameItemRenderer';
import { DATE_PICKER_COMP, FIELDS, FIELD_TYPE, MULTISELECT_ITEM_COMP, REPLICATION_INTERVAL_COMP, REPORT_PRTECTION_PLAN_COMP, TIME_PICKER_COMP } from '../constants/FieldsConstant';
import { STACK_COMPONENT_LOCATION, STACK_COMPONENT_MEMORY, STACK_COMPONENT_NETWORK, STACK_COMPONENT_SECURITY_GROUP, STACK_COMPONENT_TAGS } from '../constants/StackConstants';
import { ALERT_ACK_ITEM_RENDERER, CHECKPOINTS_LINK_RENDERER, CHECKPOINT_RECOVERY_JOB_ITEM_RENDERER, DATE_ITEM_RENDERER, DISK_REPLICATION_TYPE_ITEM_RENDERER, DR_PLAN_NAME_ITEM_RENDERER, DR_PLAN_RECOVERY_STATUS_RENDERER, EMAIL_RECIPIENT_ACTION_ITEM_RENDER, EMAIL_SUBSCRIBED_EVENT_ITEM_RENDER, ENTITY_TYPE_OPTION_RENDERER, EVENT_DESCRIPTION_RENDERER, EVENT_LEVEL_ITEM_RENDERER, JOBS_VM_NAME_RENDERER, LATEST_REFRESH_RECOVERY_STATUS, LICENSE_ACTION_ITEM_RENDERER, LICENSE_STATUS_ITEM_RENDER, LICENSE_USAGE_ITEM_RENDERER, NODE_ACTION_RENDERER, NODE_NAME_ITEM_RENDERER, NODE_STATUS_RENDERER, OS_TYPE_ITEM_RENDERER, PLATFORM_TYPE_ITEM_RENDERER, PLAYBOOK_ACTION_RENDERER, PLAYBOOK_CHANGES_RENDERER, PLAYBOOK_CONFIGURE_RENDERER, PLAYBOOK_FILENAME_RENDERER, PLAYBOOK_ITEM_RENDERER, PLAYBOOK_PLAN_NAME_LINK_RENDERER, PLAYBOOK_PLAN_STATUS_RENDERER, PLAYBOOK_RENDER_ISSUES_COLUMN, PRESERVE_CHECKPOINT, PROTECTED_VM_ACTIONS_ITEM_ITEM_RENDERER, PROTECTION_SITE_LINK_ITEM_RENDERER, QUIESCE_SOURCE_SNAPSHOT_RENDERER, QUIESCE_VMNAME_RENDERER, RECOVERY_CHECKPOINT_OPTION_RENDERER, RECOVERY_SITE_LINK_ITEM_RENDERER, RECOVERY_STATUS_ITEM_RENDERER, RECOVERY_STATUS_RENDERER, RECOVERY_TYPE_ITEM_RENDERER, REPLICATION_INTERVAL_ITEM_RENDERER, REPLICATION_PRIORITY_RENDERER, REPLICATION_TYPE_OPTION_RENDERER, REPORT_AVG_RPO_RENDERER, REVERSE_SUMMARY_ENTITY_TYPE_RENDERER, REVERSE_VM_DESCRIPTION_RENDERER, ROLE_ITEM_RENDERER, SCRIPT_ITEM_RENDERER, SERVER_PORT_ITEM_RENDERER, SINGLE_PLAYBOOK_STATUS_RENDERER, SITE_LOCATION_ITEM_RENDERER, SITE_NAME_LINK_RENDERER, SIZE_ITEM_RENDERER, SSH_RDP_ITEM_RENDERER, STATUS_ITEM_RENDERER, SUPPORT_BUNDLE_ACTION_ITEM_RENDERER, THROTTLING_ACTION_ITEM_RENDER, THROTTLING_TIME_ITEM_RENDER, TIME_DURATION_RENDERER, TRANSFER_SIZE_ITEM_RENDERER, VIEW_ALERT_INFO_RENDERER, VM_BOOT_ORDER_ITEM_RENDER, VM_DISK_ITEM_RENDERER, VM_NETWORK_INFO_ITEM_RENDERER, VM_PLACEMENT_INFO_ITEM_RENDERER, VM_SIZE_ITEM_RENDERER, VM_TENANCY_ITEM_RENDERER, VM_UPASSWORD_ITEM_RENDERER, VM_USERNAME_ITEM_RENDERER, REPORT_DATA_REDUCTION_RATIO, REPORT_VMS_ITERATION, WRAP_TEXT_ITEM_RENDERER, SYSTEM_UPGRADE_SCHEDULE_ITEM_RENDERER, SCHEDULE_NODE_LOCATION_ITEM_RENDERER, REPORT_SCHEDULE_ITEM_RENDERER, GENERATED_REPORTS_ITEM_RENDERER, REPORT_JOB_NAME_ITEM_RENDERER, END_TIME_REPORT_SHEDULE_JOB, REPORT_SCHEDULE_EMAIL_ITEM_RENDERER, SCHEDULE_STATUS_RENDERER, PLAN_LIST_WORKLOAD, VM_REPL_STATUS, REVERSE_SHOW_DISABLED_VM_REPL_WARNING, VM_REPL_STATUS_ICON, VM_NAME_LINK } from '../constants/TableConstants';
import { DrPlanRecoveryStatusRenderer } from '../components/Table/ItemRenderers/DRPlanRecoveryStatusRenderer';
import EmailSubscribedEventRenderer from '../components/Table/ItemRenderers/EmailSubscribedEventRenderer';
import ReportAverageRPORenderer from '../components/Table/ItemRenderers/ReportAverageRPORenderer';
import ReportDataReductionRenderer from '../components/Table/ItemRenderers/ReportDataReductionRenderer';
import CleanupMsgRender from '../components/Messages/CleanupMsgRender';
import { RENDER_CLEANUP_MESSAGE } from '../constants/MessageConstants';
import WrapTextItemRenderer from '../components/Table/ItemRenderers/WrapTextItemRenderer';
import ScheduleNodeLocationRenderer from '../components/Table/ItemRenderers/ScheduleNodeLocationRenderer';
import ReportJobNameRenderer from '../components/Table/ItemRenderers/ReportJobNameRenderer';
import ReportScheduleEndTime from '../components/Table/ItemRenderers/ReportScheduleEndTime';
import ReportScheduleStatusRenderer from '../components/Table/ItemRenderers/ReportScheduleStatusRenderer';
import PlanListWorkloadRenderer from '../components/Table/ItemRenderers/PlanListWorkloadRenderer';

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
    case FIELD_TYPE.TEXT:
      return <DMFieldText dispatch={dispatch} fieldKey={conf} field={children[conf]} user={user} hideLabel="true" />;
    default:
      return <DMFieldSelect dispatch={dispatch} fieldKey={conf} field={children[conf]} user={user} hideLabel="true" />;
  }
}

export function getFieldComponents(dispatch, fieldKey, user, component, hideLabel, disabled) {
  const field = FIELDS[fieldKey];
  switch (component) {
    case REPLICATION_INTERVAL_COMP:
      return <ReplicationInterval dispatch={dispatch} fieldKey={fieldKey} user={user} field={field} hideLabel={hideLabel} />;
    case MULTISELECT_ITEM_COMP:
      return <DMMultiSelect dispatch={dispatch} fieldKey={fieldKey} user={user} field={field} hideLabel={hideLabel} />;
    case DATE_PICKER_COMP:
      return <DMDatePicker dispatch={dispatch} fieldKey={fieldKey} user={user} field={field} hideLabel={hideLabel} />;
    case TIME_PICKER_COMP:
      return <DMTimePicker dispatch={dispatch} fieldKey={fieldKey} user={user} field={field} hideLabel={hideLabel} disabled={disabled} />;
    case REPORT_PRTECTION_PLAN_COMP:
      return <ReportProtectionPlanComp dispatch={dispatch} fieldKey={fieldKey} user={user} field={field} hideLabel={hideLabel} disabled={disabled} />;
    default:
      return <div>404</div>;
  }
}

export function getItemRendererComponent({ render, data, field, user, dispatch, options }) {
  switch (render) {
    case OS_TYPE_ITEM_RENDERER:
      return <OsTypeItemRenderer data={data} />;
    case VM_SIZE_ITEM_RENDERER:
      return <VMSizeItemRenderer data={data} />;
    case DR_PLAN_NAME_ITEM_RENDERER:
      return <DRPlanNameItemRenderer data={data} />;
    case DATE_ITEM_RENDERER:
      return <DateItemRenderer data={data} field={field} dispatch={dispatch} user={user} options={options} />;
    case STATUS_ITEM_RENDERER:
      return <StatusItemRenderer data={data} field={field} options={options} />;
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
    case EMAIL_SUBSCRIBED_EVENT_ITEM_RENDER:
      return <EmailSubscribedEventRenderer data={data} dispatch={dispatch} user={user} />;
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
    case VM_PLACEMENT_INFO_ITEM_RENDERER:
      return <VMPlacementInfoItemRenderer data={data} />;
    case SITE_LOCATION_ITEM_RENDERER:
      return <SiteLocationItemRenderer data={data} dispatch={dispatch} user={user} />;
    case SITE_NAME_LINK_RENDERER:
      return <SiteLinkRenderer data={data} dispatch={dispatch} user={user} />;
    case RECOVERY_STATUS_RENDERER:
      return <RecoveryStatusRenderer data={data} field={field} dispatch={dispatch} user={user} />;
    case SINGLE_PLAYBOOK_STATUS_RENDERER:
      return <SinglePlaybookStatusRenderer playbook={data} field={field} dispatch={dispatch} user={user} />;
    case PLAYBOOK_FILENAME_RENDERER:
      return <PlaybookFileNameRenderer data={data} field={field} dispatch={dispatch} />;
    case PLAYBOOK_ACTION_RENDERER:
      return <SinglePlaybookActions data={data} field={field} dispatch={dispatch} user={user} />;
    case PLAYBOOK_CONFIGURE_RENDERER:
      return <PlaybookConfigureRenderer data={data} dispatch={dispatch} />;
    case PLAYBOOK_CHANGES_RENDERER:
      return <PlaybookChangesRenderer dispatch={dispatch} data={data} field={field} />;
    case PLAYBOOK_RENDER_ISSUES_COLUMN:
      return <PlaybookIssuesColumnRenderer dispatch={dispatch} data={data} field={field} />;
    case PLAYBOOK_PLAN_NAME_LINK_RENDERER:
      return <PlaybookPlanNameRenderer dispatch={dispatch} user={user} field={field} data={data} />;
    case REPLICATION_PRIORITY_RENDERER:
      return <ReplicationPriorityItemRenderer data={data} field={field} dispatch={dispatch} user={user} />;
    case RECOVERY_CHECKPOINT_OPTION_RENDERER:
      return <RecveryCheckpointOptionRenderer data={data} dispatch={dispatch} user={user} field={field} />;
    case PRESERVE_CHECKPOINT:
      return <PreserveCheckpoint data={data} dispatch={dispatch} user={user} field={field} />;
    case CHECKPOINTS_LINK_RENDERER:
      return <CheckpoinLinkRenderer data={data} dispatch={dispatch} user={user} field={field} />;
    case CHECKPOINT_RECOVERY_JOB_ITEM_RENDERER:
      return <CheckpointRecoveryJobItemRenderer data={data} field={field} />;
    case PLAYBOOK_PLAN_STATUS_RENDERER:
      return <PlaybookPlanStatusRenderer data={data} field={field} dispatch={dispatch} user={user} />;
    case PLAYBOOK_ITEM_RENDERER:
      return <DownloadPlaybookFromPlanList data={data} field={field} dispatch={dispatch} user={user} />;
    case QUIESCE_SOURCE_SNAPSHOT_RENDERER:
      return <QuiesceSourceSnapItemRenderer data={data} field={field} dispatch={dispatch} user={user} />;
    case QUIESCE_VMNAME_RENDERER:
      return <QuiesceVmNameRenderer data={data} dispatch={dispatch} user={user} />;
    case DISK_REPLICATION_TYPE_ITEM_RENDERER:
      return <DiskReplicationTypeItemRenderer data={data} field={field} dispatch={dispatch} user={user} />;
    case PLATFORM_TYPE_ITEM_RENDERER:
      return <PlatformtypeItemRenderer data={data} user={user} />;
    case EVENT_DESCRIPTION_RENDERER:
      return <EventDescriptionRenderer data={data} />;
    case JOBS_VM_NAME_RENDERER:
      return <JobsVMNameRenderer data={data} dispatch={dispatch} />;
    case NODE_STATUS_RENDERER:
      return <NodeStatusRenderer data={data} dispatch={dispatch} user={user} />;
    case REVERSE_SUMMARY_ENTITY_TYPE_RENDERER:
      return <ReverseEntityTypeRenderer data={data} user={user} />;
    case REPLICATION_TYPE_OPTION_RENDERER:
      return <ReplicationTypeOptionRenderer data={data} dispatch={dispatch} user={user} field={field} />;
    case ENTITY_TYPE_OPTION_RENDERER:
      return <EntityTypeOptionRenderer data={data} dispatch={dispatch} user={user} field={field} />;
    case REVERSE_VM_DESCRIPTION_RENDERER:
      return <ReverseVMDescriptionRenderer data={data} user={user} field={field} />;
    case VM_TENANCY_ITEM_RENDERER:
      return <VMTenancyTypeItemRenderer data={data} user={user} field={field} />;
    case DR_PLAN_RECOVERY_STATUS_RENDERER:
      return <DrPlanRecoveryStatusRenderer data={data} user={user} field={field} />;
    case LATEST_REFRESH_RECOVERY_STATUS:
      return <LatestRefeshRecoveryStatus data={data} user={user} field={field} />;
    case REPORT_AVG_RPO_RENDERER:
      return <ReportAverageRPORenderer data={data} user={user} field={field} />;
    case REPORT_VMS_ITERATION:
      return <ReportVMSIterationRenderer data={data} field={field} />;
    case REPORT_DATA_REDUCTION_RATIO:
      return <ReportDataReductionRenderer data={data} field={field} />;
    case WRAP_TEXT_ITEM_RENDERER:
      return <WrapTextItemRenderer data={data} field={field} />;
    case SYSTEM_UPGRADE_SCHEDULE_ITEM_RENDERER:
      return <UpdateScheduleRenderer data={data} field={field} />;
    case SCHEDULE_NODE_LOCATION_ITEM_RENDERER:
      return <ScheduleNodeLocationRenderer data={data} field={field} />;
    case MODAL_SHOW_WINPREP_UPDATE_WARNING:
      return <WinPrepUpdateWarningMsg options={options} />;
    case REPORT_SCHEDULE_ITEM_RENDERER:
      return <ReportScheduleRenderer data={data} field={field} />;
    case REPORT_JOB_NAME_ITEM_RENDERER:
      return <ReportJobNameRenderer data={data} field={field} />;
    case END_TIME_REPORT_SHEDULE_JOB:
      return <ReportScheduleEndTime data={data} field={field} dispatch={dispatch} user={user} />;
    case GENERATED_REPORTS_ITEM_RENDERER:
      return <GeneratedReportsItemRenderer dispatch={dispatch} data={data} field={field} />;
    case REPORT_SCHEDULE_EMAIL_ITEM_RENDERER:
      return <ReportScheduleEmailRenderer dispatch={dispatch} data={data} field={field} />;
    case SCHEDULE_STATUS_RENDERER:
      return <ReportScheduleStatusRenderer dispatch={dispatch} data={data} field={field} />;
    case PLAN_LIST_WORKLOAD:
      return <PlanListWorkloadRenderer data={data} />;
    case VM_REPL_STATUS:
      return <VmReplStatusRenderer data={data} />;
    case REVERSE_SHOW_DISABLED_VM_REPL_WARNING:
      return <ReverseDisabledVmWarningModal options={options} />;
    case VM_REPL_STATUS_ICON:
      return <VmRpoStatusItemRenderer dispatch={dispatch} data={data} field={field} options={options} />;
    case VM_NAME_LINK:
      return <VmNameLinkRenderer dispatch={dispatch} data={data} field={field} options={options} />;
    default:
      return (<div> 404 </div>);
  }
}

export function getMessageComponent(dispatch, data) {
  switch (data.itemRenderer) {
    case RENDER_CLEANUP_MESSAGE:
      return <CleanupMsgRender dispatch={dispatch} data={data} />;
    default:
      return <div>404</div>;
  }
}
