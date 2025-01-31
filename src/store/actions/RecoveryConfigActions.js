import { API_LATEST_TEST_RECOVERY_PPLAN } from '../../constants/ApiConstants';
import { COPY_CONFIG, PLATFORM_TYPES, STATIC_KEYS, UI_WORKFLOW, AWS_TENANCY_TYPES } from '../../constants/InputConstants';
import { MESSAGE_TYPES } from '../../constants/MessageConstants';
import { APP_SET_TIMEOUT } from '../../constants/UserConstant';
import { callAPI } from '../../utils/ApiUtils';
import { getLabelWithResourceGrp, getMemoryInfo, getNetworkIDFromName, getSubnetIDFromName } from '../../utils/AppUtils';
import { getValue } from '../../utils/InputUtils';
import { getSourceConfig } from '../../utils/PayloadUtil';
import { fetchByDelay } from '../../utils/SlowFetch';
import { setPublicIPWhileEdit } from './DrPlanActions';
import { addMessage } from './MessageActions';
import { closeModal } from './ModalActions';
import { updateValues, valueChange } from './UserActions';
import { setVMwareTargetData } from './VMwareActions';

export function copyInstanceConfiguration({ sourceVM, targetVMs, configToCopy, sourceData }) {
  return (dispatch, getState) => {
    const { user } = getState();
    let sourceConfig = {};
    if (typeof sourceData !== 'undefined') {
      sourceConfig = sourceData;
    } else {
      sourceConfig = getSourceConfig(sourceVM, user);
    }
    let resp = {};
    for (let targetVM = 0; targetVM < targetVMs.length; targetVM += 1) {
      for (let i = 0; i < configToCopy.length; i += 1) {
        switch (configToCopy[i].value) {
          case COPY_CONFIG.GENERAL_CONFIG:
            const gn = setGeneralConfiguration(sourceConfig, targetVMs[targetVM], user, dispatch);
            resp = { ...resp, ...gn };
            break;
          case COPY_CONFIG.NETWORK_CONFIG:
            const nw = setNetworkConfig(sourceConfig, targetVMs[targetVM], user, dispatch);
            resp = { ...resp, ...nw };
            break;
          case COPY_CONFIG.REP_SCRIPT_CONFIG:
            const repS = setReplicationScripts(sourceConfig, targetVMs[targetVM]);
            resp = { ...resp, ...repS };
            break;
          case COPY_CONFIG.REC_SCRIPT_CONFIG:
            const recS = setRecoveryScripts(sourceConfig, targetVMs[targetVM], user);
            resp = { ...resp, ...recS };
            break;
          default:
            dispatch(addMessage(`Invalid config ${configToCopy[i].value}`));
        }
      }
    }
    dispatch(closeModal());
    setTimeout(() => {
      dispatch(updateValues(resp));
    }, APP_SET_TIMEOUT);
  };
}

function setGeneralConfiguration(sourceConfig, targetVM, user, dispatch) {
  const { volumeType, volumeIOPS, tags, memoryMB, hostMoref, datastoreMoref, numCPU, datacenterMoref, availZone, securityGroups = '', encryptionKey, tenancy, hostType, affinity, image, license } = sourceConfig;
  let { instanceType, folderPath, securityGroup = '' } = sourceConfig;
  const { values } = user;
  const memory = getMemoryInfo(memoryMB);
  const recoveryPlatform = getValue('ui.values.recoveryPlatform', values);
  const tagsData = [];
  let generalConfig = {};
  if (securityGroup === '' && securityGroups !== '') {
    securityGroup = securityGroups;
  }
  if (tags && tags.length > 0) {
    tags.forEach((tag) => {
      tagsData.push({ key: tag.key, value: tag.value });
    });
  }
  if (recoveryPlatform === PLATFORM_TYPES.VMware) {
    instanceType = '';
    folderPath = [folderPath];
    fetchByDelay(dispatch, setVMwareTargetData, 2000, [`${targetVM}-vmConfig.general`, datacenterMoref, hostMoref]);
    generalConfig = {
      [`${targetVM}-vmConfig.general.numcpu`]: getValue(`${targetVM}-vmConfig.general.numcpu`, values) || numCPU || 2,
      [`${targetVM}-vmConfig.general-memory`]: parseInt(getValue(`${targetVM}-vmConfig.general-memory`, values), 10) || parseInt(memory[0], 10) || 2,
      [`${targetVM}-vmConfig.general-unit`]: getValue(`${targetVM}-vmConfig.general-unit`, values) || memory[1] || '',
      [`${targetVM}-vmConfig.general.hostMoref`]: getValue(`${targetVM}-vmConfig.general.hostMoref`, values) || { label: hostMoref, value: hostMoref },
    };
  } else {
    folderPath = { label: folderPath, value: folderPath };
    instanceType = { label: instanceType, value: instanceType };
  }

  if (typeof tenancy !== 'undefined' && tenancy === AWS_TENANCY_TYPES.Dedicated_Host) {
    generalConfig = {
      ...generalConfig,
      // add the tenancy keys
      [`${targetVM}-vmConfig.general.tenancy`]: getValue(`${targetVM}-vmConfig.general.tenancy`, values) || tenancy,
      [`${targetVM}-vmConfig.general.hostType`]: getValue(`${targetVM}-vmConfig.general.hostType`, values) || hostType,
      [`${targetVM}-vmConfig.general.hostMoref`]: getValue(`${targetVM}-vmConfig.general.hostMoref`, values) || hostMoref,
      [`${targetVM}-vmConfig.general.affinity`]: getValue(`${targetVM}-vmConfig.general.affinity`, values) || affinity,
      [`${targetVM}-vmConfig.general.image`]: getValue(`${targetVM}-vmConfig.general.image`, values) || image,
      [`${targetVM}-vmConfig.general.license`]: getValue(`${targetVM}-vmConfig.general.license`, values) || license,
    };
  }
  if (typeof tenancy !== 'undefined' && tenancy === AWS_TENANCY_TYPES.Shared) {
    generalConfig = {
      ...generalConfig,
      [`${targetVM}-vmConfig.general.tenancy`]: getValue(`${targetVM}-vmConfig.general.tenancy`, values) || tenancy,
    };
  }

  let networkTags = [];
  if (securityGroup) {
    networkTags = securityGroup.split(',');
  }
  generalConfig = {
    ...generalConfig,
    [`${targetVM}-vmConfig.general.instanceType`]: getValue(`${targetVM}-vmConfig.general.instanceType`, values) || instanceType || '',
    [`${targetVM}-vmConfig.general.volumeType`]: getValue(`${targetVM}-vmConfig.general.volumeType`, values) || volumeType || '',
    [`${targetVM}-vmConfig.general.dataStoreMoref`]: getValue(`${targetVM}-vmConfig.general.dataStoreMoref`, values) || { label: datastoreMoref, value: datastoreMoref },
    [`${targetVM}-vmConfig.general.datacenterMoref`]: getValue(`${targetVM}-vmConfig.general.datacenterMoref`, values) || datacenterMoref || '',
    [`${targetVM}-vmConfig.general.folderPath`]: getValue(`${targetVM}-vmConfig.general.folderPath`, values) || folderPath || '',
    [`${targetVM}-vmConfig.general.volumeType`]: getValue(`${targetVM}-vmConfig.general.volumeType`, values) || volumeType || '',
    [`${targetVM}-vmConfig.general.volumeIOPS`]: getValue(`${targetVM}-vmConfig.general.volumeIOPS`, values) || volumeIOPS || 0,
    [`${targetVM}-vmConfig.general.encryptionKey`]: getValue(`${targetVM}-vmConfig.general.encryptionKey`, values) || encryptionKey || '',
    [`${targetVM}-vmConfig.general.tags`]: getValue(`${targetVM}-vmConfig.general.tags`, values) || tagsData || '',
    [`${targetVM}-vmConfig.general.availibility.zone`]: getValue(`${targetVM}-vmConfig.general.availibility.zone`, values) || availZone || '',
    [`${targetVM}-vmConfig.network.securityGroup`]: getValue(`${targetVM}-vmConfig.network.securityGroup`, values) || networkTags || '',

  };
  return generalConfig;
}

/**
 * reset general config of a vm
 * @param {*} user and the vm key which need to reset
 * @returns reseted general config
 */

export function resetGeneralConfig({ user, targetVM }) {
  // getting the flow because if the flow is test-recovery then we only need to set the property which it has eg aws -> instance type ,vmware->everything editable
  const { values } = user;
  const flow = getValue(STATIC_KEYS.UI_WORKFLOW, values);
  const recoveryPlatform = getValue('ui.values.recoveryPlatform', values);
  let generalConfig;
  if (flow === UI_WORKFLOW.TEST_RECOVERY) {
    switch (recoveryPlatform) {
      case PLATFORM_TYPES.AWS:
        generalConfig = {
          [`${targetVM}-vmConfig.general.instanceType`]: '',
        };
        break;
      case PLATFORM_TYPES.GCP:
        generalConfig = {
          [`${targetVM}-vmConfig.general.instanceType`]: '',
        };
        break;
      case PLATFORM_TYPES.VMware:
        generalConfig = {
          [`${targetVM}-vmConfig.general.instanceType`]: '',
          [`${targetVM}-vmConfig.general.folderPath`]: '',
          [`${targetVM}-vmConfig.general.hostMoref`]: '',
          [`${targetVM}-vmConfig.general.dataStoreMoref`]: '',
          [`${targetVM}-vmConfig.general.datacenterMoref`]: '',
          [`${targetVM}-vmConfig.general.numcpu`]: 2,
          [`${targetVM}-vmConfig.general-memory`]: 0,
          [`${targetVM}-vmConfig.general-unit`]: '',
        };
        break;
      case PLATFORM_TYPES.Azure:
        generalConfig = {
          [`${targetVM}-vmConfig.general.folderPath`]: '',
          [`${targetVM}-vmConfig.general.availibility.zone`]: '',
          [`${targetVM}-vmConfig.general.instanceType`]: '',
          [`${targetVM}-vmConfig.general.volumeType`]: '',
          [`${targetVM}-vmConfig.general.tags`]: '',
        };
        break;
      default:
        break;
    }
  } else {
    generalConfig = {
      [`${targetVM}-vmConfig.general.instanceType`]: '',
      [`${targetVM}-vmConfig.general.volumeType`]: '',
      [`${targetVM}-vmConfig.general.hostMoref`]: '',
      [`${targetVM}-vmConfig.general.dataStoreMoref`]: '',
      [`${targetVM}-vmConfig.general.datacenterMoref`]: '',
      [`${targetVM}-vmConfig.general.numcpu`]: 2,
      [`${targetVM}-vmConfig.general-memory`]: 0,
      [`${targetVM}-vmConfig.general-unit`]: '',
      [`${targetVM}-vmConfig.general.folderPath`]: '',
      [`${targetVM}-vmConfig.general.volumeType`]: '',
      [`${targetVM}-vmConfig.general.volumeIOPS`]: 0,
      [`${targetVM}-vmConfig.general.encryptionKey`]: '',
      [`${targetVM}-vmConfig.general.tags`]: '',
      [`${targetVM}-vmConfig.general.availibility.zone`]: '',
      [`${targetVM}-vmConfig.network.securityGroup`]: '',
    };
  }
  return generalConfig;
}

function setNetworkConfig(sourceConfig, targetVM, user, dispatch) {
  const { values } = user;
  const { networks = [] } = sourceConfig;
  const { availZone } = sourceConfig;
  const selectedVMs = getValue(STATIC_KEYS.UI_SITE_SELECTED_VMS, values);
  const workflow = getValue(STATIC_KEYS.UI_WORKFLOW, values);
  const recoveryPlatform = getValue('ui.values.recoveryPlatform', values);
  const sourceVMConfig = selectedVMs[targetVM];
  let networkConfig = {};
  const networkKey = `${targetVM}-vmConfig.network.net1`;
  const eths = getValue(`${networkKey}`, values) || [];
  const nics = sourceVMConfig.virtualNics || [];
  const key = `${targetVM}-vmConfig.network.net1`;
  // for test recovery flow we need to add network based on source config
  if (workflow === UI_WORKFLOW.TEST_RECOVERY) {
    const e = [];
    for (let index = 0; index < networks.length; index += 1) {
      e.push({ key: `${networkKey}-eth-${index}`, ...networks[index] });
    }
    dispatch(valueChange(`${networkKey}`, e));
  } else {
    // set networks while creating new pplan
    setNicsOnVM(dispatch, eths, nics, networkKey);
  }

  if (networks && networks.length > 0 && sourceVMConfig) {
    if (nics && nics.length > 0) {
      for (let index = 0; index < networks.length; index += 1) {
        if (typeof networks[index] !== 'undefined' && networks[index]) {
          const { vpcId = '', Subnet = '', networkTier = '', isFromSource, securityGroups, adapterType, networkMoref, networkPlatformID } = networks[index];
          let { subnet, network, publicIP, isPublicIP = '', dns = '', netmask = '', gateway = '', privateIP = '', macAddress = '' } = networks[index];
          let sgs = (securityGroups ? securityGroups.split(',') : []);
          if (typeof subnet === 'undefined' || subnet === '' && Subnet !== '') {
            subnet = Subnet;
          }
          if (workflow === UI_WORKFLOW.CREATE_PLAN) {
            privateIP = '';
          }
          if (recoveryPlatform === PLATFORM_TYPES.VMware) {
            network = { label: network, value: networkPlatformID };
            if (workflow !== UI_WORKFLOW.TEST_RECOVERY) {
              isPublicIP = false;
              publicIP = '';
              dns = '';
              netmask = '';
              gateway = '';
              macAddress = '';
            }
          } else if (recoveryPlatform === PLATFORM_TYPES.Azure) {
            const { publicIp } = setPublicIPWhileEdit(isPublicIP, publicIP, networkKey, index, dispatch);
            network = getNetworkIDFromName(network, values);
            subnet = getSubnetIDFromName(subnet, values, network);
            if (workflow === UI_WORKFLOW.CREATE_PLAN) {
              if (publicIp === 'true' || publicIp === 'false') {
                publicIP = publicIp;
              } else {
                publicIP = '';
              }
            } else if (workflow !== UI_WORKFLOW.CREATE_PLAN) {
              if (publicIp === 'true' || publicIp === 'false' || publicIP !== '') {
                publicIP = publicIp;
              } else {
                publicIP = 'false';
              }
            }

            if (typeof securityGroups !== 'undefined' && securityGroups !== '') {
              const label = getLabelWithResourceGrp(securityGroups);
              sgs = { label, value: securityGroups };
            }
          } else if (recoveryPlatform === PLATFORM_TYPES.AWS && workflow === UI_WORKFLOW.CREATE_PLAN) {
            // Made elastic IP empty in case of AWS while creating plan
            network = '';
          }
          const nwCon = setNetworkConfigValues({ key, index, vpcId, subnet, availZone, isPublicIP, publicIP, network, networkTier, isFromSource, sgs, adapterType, networkMoref, dns, netmask, gateway, privateIP, macAddress, values });

          networkConfig = { ...networkConfig, ...nwCon };
        }
      }
    }
  }
  return networkConfig;
}

/**
 *
 * @param {*} key -> netwirk key, index-> network ind,and other network fieldd
 * we should only provide network fields if we want to set network config i.e in case of copy config
 * and if we don't want to copy network config thet should not provide network fields i.e in case of reset config
 * used in two cases for copy config to set networks and for reset to reset network
 * @returns object network config
 */

export function setNetworkConfigValues({ values, key, index, vpcId, subnet, availZone, publicIP, isPublicIP, network, networkTier, isFromSource, sgs, adapterType, networkMoref, dns, netmask, gateway, privateIP, macAddress }) {
  const isPublic = getValue(`${key}-eth-${index}-isPublic`, values);
  const nwCon = {
    [`${key}-eth-${index}-vpcId`]: getValue(`${key}-eth-${index}-vpcId`, values) || vpcId || '',
    [`${key}-eth-${index}-subnet`]: getValue(`${key}-eth-${index}-subnet`, values) || subnet || '',
    [`${key}-eth-${index}-availZone`]: getValue(`${key}-eth-${index}-availZone`, values) || availZone || '',
    [`${key}-eth-${index}-isPublic`]: isPublic !== '' ? isPublic : isPublicIP || '',
    [`${key}-eth-${index}-network`]: getValue(`${key}-eth-${index}-network`, values) || network || '',
    [`${key}-eth-${index}-networkTier`]: getValue(`${key}-eth-${index}-networkTier`, values) || networkTier || '',
    [`${key}-eth-${index}-isFromSource`]: getValue(`${key}-eth-${index}-isFromSource`, values) || isFromSource || '',
    [`${key}-eth-${index}-securityGroups`]: getValue(`${key}-eth-${index}-securityGroups`, values) || sgs || '',
    [`${key}-eth-${index}-adapterType`]: getValue(`${key}-eth-${index}-adapterType`, values) || adapterType || '',
    [`${key}-eth-${index}-networkMoref`]: getValue(`${key}-eth-${index}-networkMoref`, values) || networkMoref || '',
    [`${key}-eth-${index}-publicIP`]: getValue(`${key}-eth-${index}-publicIP`, values) || publicIP || '',
    [`${key}-eth-${index}-dnsserver`]: getValue(`${key}-eth-${index}-dnsserver`, values) || dns || '',
    [`${key}-eth-${index}-gateway`]: getValue(`${key}-eth-${index}-gateway`, values) || gateway || '',
    [`${key}-eth-${index}-netmask`]: getValue(`${key}-eth-${index}-netmask`, values) || netmask || '',
    [`${key}-eth-${index}-privateIP`]: getValue(`${key}-eth-${index}-privateIP`, values) || privateIP || '',
    [`${key}-eth-${index}-macAddress`]: getValue(`${key}-eth-${index}-macAddress`, values) || macAddress || '',
  };
  return nwCon;
}

/**
 * copy  replication script of source vm to target vm
 * @param {*} sourceConfig -> source vm configs
 * @param {*} targetVM -> target vm moref to set source vm resplication script to target vm replication script
 * @returns key value pairs to set values
 */

function setReplicationScripts(sourceConfig, targetVM) {
  const { repPostScript, repPreScript } = sourceConfig;
  const scripts = {
    [`${targetVM}-protection.scripts.preScript`]: repPreScript,
    [`${targetVM}-protection.scripts.postScript`]: repPostScript,
  };
  return scripts;
}

/**
 * copy  recovery script of source vm to target vm
 * @param {*} sourceConfig -> source vm configs
 * @param {*} targetVM -> target vm moref to set source vm  scriptrecovery to target vm recovery script
 * @returns key value pairs to set values
 */

function setRecoveryScripts(sourceConfig, targetVM, user) {
  const { preScript, postScript } = sourceConfig;
  const { values } = user;
  const scripts = {
    [`${targetVM}-vmConfig.scripts.preScript`]: getValue(`${targetVM}-vmConfig.scripts.preScript`, values) || preScript,
    [`${targetVM}-vmConfig.scripts.postScript`]: getValue(`${targetVM}-vmConfig.scripts.postScript`, values) || postScript,
  };
  return scripts;
}

/**
 *  set the empty nics in recovery configuration page based on source vm  nics
 * @param {*} dispatch
 * @param {*} eths
 * @param {*} vNics
 * @param {*} networkKey
 */
export function setNicsOnVM(dispatch, eths, vNics, networkKey) {
  let virtualNics = vNics;
  if (!eths || eths.length === 0) {
    if (virtualNics === null) {
      virtualNics = [{ emptyObj: 'To allow one nic configuration' }];
    }
    for (let index = 0; index < virtualNics.length; index += 1) {
      // aws
      dispatch(valueChange(`${networkKey}-eth-${index}-subnet`, ''));
      dispatch(valueChange(`${networkKey}-eth-${index}-availZone`, ''));
      dispatch(valueChange(`${networkKey}-eth-${index}-isPublic`, false));
      dispatch(valueChange(`${networkKey}-eth-${index}-privateIP`, ''));
      dispatch(valueChange(`${networkKey}-eth-${index}-securityGroups`, ''));
      dispatch(valueChange(`${networkKey}-eth-${index}-network`, ''));
      dispatch(valueChange(`${networkKey}-eth-${index}-publicIP`, ''));
      dispatch(valueChange(`${networkKey}-eth-${index}-networkTier`, ''));
      dispatch(valueChange(`${networkKey}-eth-${index}-adapterType`, ''));
      dispatch(valueChange(`${networkKey}-eth-${index}-macAddress`, ''));
      eths.push({ key: `${networkKey}-eth-${index}`, isPublicIP: false, publicIP: '', privateIP: '', subnet: '', securityGroup: '' });
    }
    dispatch(valueChange(`${networkKey}`, eths));
  }
}

/**
 * set current recovery info in test recovery flow
 * set last successfull test recovery info
 * @returns null
 */

export function fetchLastTestRecovery() {
  return (dispatch, getState) => {
    const { user } = getState();
    const { values } = user;
    const pplanId = getValue('recovery.protectionplanID', values);
    const url = API_LATEST_TEST_RECOVERY_PPLAN.replace('<id>', pplanId);
    const prev = getValue('ui.prev.recovery.config.test', values) || [];
    const current = getValue('ui.prev.current.config.test', values) || [];
    if (prev.length === 0 && current.length === 0) {
      return callAPI(url)
        .then((json) => {
          let parsedTestRecoveryConfig = {};
          let currentTestRecoveryConfig = {};
          json.recoveryEntities.instanceDetails.forEach((js) => {
            if (js.testRecoveryConfig) {
              const item = JSON.parse(js.testRecoveryConfig);
              parsedTestRecoveryConfig = { ...parsedTestRecoveryConfig, [item.sourceMoref]: item };
            }
          });

          json.recoveryEntities.instanceDetails.forEach((inst) => {
            const item = inst;
            currentTestRecoveryConfig = { ...currentTestRecoveryConfig, [item.sourceMoref]: item };
          });
          dispatch(valueChange('ui.previous.recovery.config.test', parsedTestRecoveryConfig));
          dispatch(valueChange('ui.current.recovery.config.test', currentTestRecoveryConfig));
        },
        (err) => {
          dispatch(addMessage(err.message, MESSAGE_TYPES.ERROR));
        });
    }
  };
}

/**
 *Reset recovery configuration of a vms
 * @param {*} targetVMs ->array of vm key of vm which needs to be reset
 * @param {*} configToReset -> array of configurations which needs to be reset
 * @returns null
 */

export function resetInstanceConfiguration({ targetVMs, configToReset }) {
  return (dispatch, getState) => {
    const { user } = getState();
    const { values } = user;
    let res = {};
    for (let targetVM = 0; targetVM < targetVMs.length; targetVM += 1) {
      for (let config = 0; config < configToReset.length; config += 1) {
        switch (configToReset[config].value) {
          case COPY_CONFIG.GENERAL_CONFIG:
            const general = resetGeneralConfig({ targetVM: targetVMs[targetVM], user });
            res = { ...res, ...general };
            break;
          case COPY_CONFIG.NETWORK_CONFIG:
            const net = resetNetworkConfig(targetVMs[targetVM], values);
            res = { ...res, ...net };
            break;
          case COPY_CONFIG.REP_SCRIPT_CONFIG:
            const repl = resetReplicationScript(targetVMs[targetVM]);
            res = { ...res, ...repl };
            break;
          case COPY_CONFIG.REC_SCRIPT_CONFIG:
            const rec = resetRecoveryScript(targetVMs[targetVM]);
            res = { ...res, ...rec };
            break;
          default:
            break;
        }
      }
    }
    dispatch(closeModal());
    dispatch(updateValues(res));
  };
}

const resetNetworkConfigValues = ({ key, index }) => {
  const nwCon = {
    [`${key}-eth-${index}-vpcId`]: '',
    [`${key}-eth-${index}-subnet`]: '',
    [`${key}-eth-${index}-availZone`]: '',
    [`${key}-eth-${index}-isPublic`]: '',
    [`${key}-eth-${index}-network`]: '',
    [`${key}-eth-${index}-networkTier`]: '',
    [`${key}-eth-${index}-isFromSource`]: '',
    [`${key}-eth-${index}-securityGroups`]: '',
    [`${key}-eth-${index}-adapterType`]: '',
    [`${key}-eth-${index}-networkMoref`]: '',
    [`${key}-eth-${index}-publicIP`]: '',
    [`${key}-eth-${index}-dnsserver`]: '',
    [`${key}-eth-${index}-gateway`]: '',
    [`${key}-eth-${index}-netmask`]: '',
    [`${key}-eth-${index}-privateIP`]: '',
  };
  return nwCon;
};
export function resetNetworkConfig(targetVM, values) {
  const selectedVMs = getValue(STATIC_KEYS.UI_SITE_SELECTED_VMS, values);
  const vm = selectedVMs[targetVM];
  let networkConfig = {};
  if (typeof vm !== 'undefined') {
    const nics = vm.virtualNics;
    const networkKey = `${targetVM}-vmConfig.network.net1`;
    if (typeof nics !== 'undefined' && nics.length > 0) {
      for (let i = 0; i < nics.length; i += 1) {
        const nw = resetNetworkConfigValues({ key: networkKey, index: i });
        networkConfig = { ...networkConfig, ...nw };
      }
    }
  }
  return networkConfig;
}

export function resetReplicationScript(targetVM) {
  const scripts = {
    [`${targetVM}-protection.scripts.preScript`]: '',
    [`${targetVM}-protection.scripts.postScript`]: '',
  };
  return scripts;
}

export function resetRecoveryScript(targetVM) {
  const scripts = {
    [`${targetVM}-vmConfig.scripts.preScript`]: '',
    [`${targetVM}-vmConfig.scripts.postScript`]: '',
  };
  return scripts;
}
