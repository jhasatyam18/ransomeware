import { faCircleCheck, faCircleMinus, faEdit, faPlus, faTrash } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import React from 'react';
import { withTranslation } from 'react-i18next';
import ActionButton from '../../Common/ActionButton';
import { NODE_UPDATE_SCHEDULER_CREATE } from '../../../constants/RouterConstants';
import { openModal } from '../../../store/actions/ModalActions';
import { MODAL_CONFIRMATION_WARNING } from '../../../constants/Modalconstant';
import { disableNodeSchedule, enableNodeSchedule, handleCreateNodeScheduleSelection, removeSchedule } from '../../../store/actions/NodeScheduleAction';
import { parseCronToScheduleFields, parseCronToTime } from '../../../utils/SystemUpdateScheduleUtils';
import { valueChange } from '../../../store/actions';
import { STORE_KEYS } from '../../../constants/StoreKeyConstants';
import { hasRequestedPrivileges } from '../../../utils/PrivilegeUtils';
import { NODE_TYPES, STATIC_KEYS } from '../../../constants/InputConstants';

const NodeSchedulerActionButton = (props) => {
  const { t, settings, dispatch, user } = props;
  const { selectedScheduledNodes, nodes } = settings;
  const history = useNavigate();
  const disableReconfigure = Object.keys(selectedScheduledNodes).length !== 1;
  const disableEnable = Object.keys(selectedScheduledNodes).length !== 1 || selectedScheduledNodes[Object.keys(selectedScheduledNodes)[0]].status === 'Enabled';
  const disableDisableBtn = Object.keys(selectedScheduledNodes).length !== 1 || selectedScheduledNodes[Object.keys(selectedScheduledNodes)[0]].status === 'Disabled';
  const handleNewScheduleClick = () => {
    history(NODE_UPDATE_SCHEDULER_CREATE);
  };

  const onRemove = () => {
    const selectedScheduleKey = Object.keys(selectedScheduledNodes);
    const options = { title: t('confirmation'), confirmAction: removeSchedule, message: `Are you sure you want to remove selected Schedule - ${selectedScheduledNodes[selectedScheduleKey].node.name} ?`, id: selectedScheduledNodes[selectedScheduleKey].uuid };
    dispatch(openModal(MODAL_CONFIRMATION_WARNING, options));
  };

  const onEnableSchedule = () => {
    const selectedScheduleObj = Object.values(selectedScheduledNodes)[0];
    const options = { title: 'Confirmation', confirmAction: enableNodeSchedule, message: `Are you sure you want to make selected ${selectedScheduleObj.node.name} schedule Enable ?`, id: selectedScheduleObj.uuid };
    dispatch(openModal(MODAL_CONFIRMATION_WARNING, options));
  };
  const onDisableSchedule = () => {
    const selectedScheduleObj = Object.values(selectedScheduledNodes)[0];
    const options = { title: 'Confirmation', confirmAction: disableNodeSchedule, message: `Are you sure you want to make selected ${selectedScheduleObj.node.name} schedule Disable ?`, id: selectedScheduleObj.uuid };
    dispatch(openModal(MODAL_CONFIRMATION_WARNING, options));
  };

  const reconfigureSchedule = () => {
    const selectedKey = Object.keys(selectedScheduledNodes)[0]; // since only 1 is allowed
    const data = selectedScheduledNodes[selectedKey];
    const selectedPowerOffDay = data.powerOffDays;
    const selectedSchedule = nodes
      ?.filter((node) => node.nodeType === NODE_TYPES.PrepNode)
      .find((node) => node.id === +selectedKey);
    dispatch(handleCreateNodeScheduleSelection(selectedSchedule, true, 'id'));
    if (!data) return;
    const { powerOnCronSchedule, powerOffCronSchedule, occurrence } = data;
    const powerOnTime = parseCronToTime(powerOnCronSchedule);
    const powerOffTime = parseCronToTime(powerOffCronSchedule);
    const parsed = parseCronToScheduleFields(powerOnCronSchedule);
    // Dispatch to set values in Redux store
    dispatch(valueChange(STORE_KEYS.UI_NODE_UPDATE_SCHEDULER_POWER_ON_TIME, powerOnTime));
    dispatch(valueChange(STORE_KEYS.UI_NODE_UPDATE_SCHEDULER_POWER_OFF_TIME, powerOffTime));
    dispatch(valueChange(STORE_KEYS.UI_SCHEDULE_WORKFLOW, STATIC_KEYS.EDIT));
    dispatch(valueChange(STORE_KEYS.UI_NODE_UPDATE_SCHEDULER_OCCURRENCE_OPTION, parsed.type));
    dispatch(valueChange(STORE_KEYS.UI_NODE_UPDATE_SCHEDULER_OCCURRENCE, parsed.repeat));
    dispatch(valueChange(STORE_KEYS.UI_NODE_UPDATE_SCHEDULER_POWER_OFF_DAY, selectedPowerOffDay));
    dispatch(valueChange(STORE_KEYS.UI_SCHEDULE_TIME_ZONE, { label: data.timeZone, value: data.timeZone }));
    if (parsed.type === STATIC_KEYS.WEEK) {
      dispatch(valueChange(STORE_KEYS.UI_NODE_UPDATE_SCHEDULER_DAY_OF_WEEK, parsed.dayOfWeek));
      dispatch(valueChange(STORE_KEYS.UI_NODE_UPDATE_SCHEDULER_OCCURRENCE, occurrence));
    } else if (parsed.type === STATIC_KEYS.MONTH) {
      dispatch(valueChange(STORE_KEYS.UI_NODE_UPDATE_SCHEDULER_DAY_OF_MONTH, +parsed.dayOfMonth));
    }
    history(NODE_UPDATE_SCHEDULER_CREATE);
  };

  return (
    <>
      <div className="btn-group padding-left-20" role="group" aria-label="First group">
        <ActionButton label="New Schedule" icon={faPlus} t={t} key="newUserConfiguration" onClick={handleNewScheduleClick} isDisabled={!hasRequestedPrivileges(user, ['nodesystemupdate.create'])} />
        <ActionButton label="Reconfigure" icon={faEdit} t={t} key="addNewUser" onClick={reconfigureSchedule} isDisabled={disableReconfigure || !hasRequestedPrivileges(user, ['nodesystemupdate.edit'])} />
        <ActionButton label="remove" icon={faTrash} t={t} key="removeUser" onClick={onRemove} isDisabled={disableReconfigure || !hasRequestedPrivileges(user, ['nodesystemupdate.delete'])} />
        <ActionButton label="Enable" onClick={onEnableSchedule} icon={faCircleCheck} t={t} key="resetUserPassword" isDisabled={disableEnable || !hasRequestedPrivileges(user, ['nodesystemupdate.edit'])} />
        <ActionButton label="Disable" onClick={onDisableSchedule} icon={faCircleMinus} t={t} key="resetUserPassword" isDisabled={disableDisableBtn || !hasRequestedPrivileges(user, ['nodesystemupdate.edit'])} />
      </div>
    </>
  );
};

export default (withTranslation()(NodeSchedulerActionButton));
