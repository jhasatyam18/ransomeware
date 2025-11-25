import { COPY_CONFIG, PLATFORM_TYPES } from '../constants/userConstant';
import { InstanceData, UserInterface } from '../interfaces/interface';
import { getGCPNetworkValue, getLabelWithResourceGrp, getMemoryInfo, getNetworkOptions, getStorageWithUnit } from './appUtils';

interface Volume {
    resourceID?: string;
    size?: number;
}

interface Instance {
    resourceName?: string;
    resourceID?: string;
}

interface RecoveryJob {
    config: string;
}

interface CleanupInfo {
    title: string;
    values: { title: string; value: string }[];
}

interface CopyConfigOption {
    value: string;
    label: string;
}

export function getCleanupInfoForVM(recoveryJob: RecoveryJob): CleanupInfo[] {
    const { config } = recoveryJob;
    if (!config) {
        return [];
    }
    let parsedData: Volume[] | Instance;
    try {
        parsedData = JSON.parse(config);
    } catch (error) {
        return [];
    }
    const data: CleanupInfo[] = [];
    // If parsedData is an array (Volumes), process each volume
    if (Array.isArray(parsedData)) {
        parsedData.forEach((vol, index) => {
            const volConfig = getCleanupVolumeInfo(vol, index);
            data.push(volConfig);
        });
    } else {
        // Otherwise, it's a single VM instance
        const vmConfig = getCleanUPVMConfig(parsedData);
        data.push(vmConfig);
    }
    return data;
}

function getCleanupVolumeInfo(vol: Volume, index: number): CleanupInfo {
    const keys = [
        { title: 'Platform ID', value: vol.resourceID || '' },
        { title: 'Size', value: getStorageWithUnit(vol.size || 0) },
    ];
    const title = `Volume-${index}`;
    return { title, values: keys };
}

function getCleanUPVMConfig(instance: Instance): CleanupInfo {
    const keys = [
        { title: 'Name', value: instance.resourceName || '' },
        { title: 'Platform ID', value: instance.resourceID || '' },
    ];
    const title = 'Cleanup Instance Detail';
    return { title, values: keys };
}

export function getRecoveryInfoForVM({ user, configToCopy, recoveryConfig, platformType }: { user: UserInterface; configToCopy: CopyConfigOption[]; recoveryConfig: InstanceData; platformType: string }) {
    let sourceConfig: any = [];
    if (typeof recoveryConfig !== 'undefined' && sourceConfig) {
        sourceConfig = recoveryConfig;
    }
    const data: any = [];
    configToCopy.forEach((conf: any) => {
        switch (conf.value) {
            case COPY_CONFIG.GENERAL_CONFIG:
                const keys = getGeneralConfig({ sourceConfig, platformType });
                const genConf = { title: 'label.general', values: keys };
                data.push(genConf);
                break;
            case COPY_CONFIG.NETWORK_CONFIG:
                const nwKeys = getNetworkConfig({ sourceConfig, user, platformType });
                const nwConf = { title: 'label.network', values: nwKeys };
                data.push(nwConf);
                break;
            // case COPY_CONFIG.REP_SCRIPT_CONFIG:
            //     const repScripts = getRepScriptInfo(sourceConfig, user);
            //     if (repScripts) {
            //         const repS = { title: 'label.replication.scripts', values: repScripts };
            //         data.push(repS);
            //     }
            //     break;
            case COPY_CONFIG.REC_SCRIPT_CONFIG:
                const recScripts = getRecoveryScriptInfo(sourceConfig);
                if (recScripts) {
                    const recS = { title: 'label.recovery.scripts', values: recScripts };
                    data.push(recS);
                }
                break;
            default:
                return data;
        }
    });
    return data;
}

function getGeneralConfig({ sourceConfig, platformType }: { sourceConfig: InstanceData; platformType: string }) {
    const { instanceType, volumeType, volumeIOPS, tags, folderPath, hostMoref, datastoreMoref, numCPU, datacenterMoref, securityGroups, availZone, tenancy, hostType, affinity, image, license } = sourceConfig;
    const { memoryMB } = sourceConfig;
    // let recoveryPlatform = getValue({key:'ui.values.recoveryPlatform', values}) || 'VMware'
    // if the workflow is to see last successfull test recovery then recovery platform will be the local platform
    // if (typeof workFlow !== 'undefined' && workFlow === UI_WORKFLOW.LAST_TEST_RECOVERY_SUMMARY) {
    //   recoveryPlatform = user.platformType;
    // }
    let memory: (string | number)[] | string = getMemoryInfo(memoryMB) || '';
    if (Array.isArray(memory) && memory[0] === 0) {
        memory = '';
    } else if (Array.isArray(memory)) {
        memory = memory.join(' ');
    }
    let tagData = '';
    if (tags && tags.length > 0) {
        tags.forEach((tag: any) => {
            tagData = `${tagData} ${tag.key}-${tag.value}`;
        });
    }
    let keys: any = [];
    switch (platformType) {
        case PLATFORM_TYPES.AWS:
            if (typeof tenancy !== 'undefined' && tenancy === 'host') {
                // add the tenancy keys
                keys = [...keys, { title: 'Tenancy', value: tenancy }, { title: 'Target Host Type', value: hostType }, { title: hostType === 'Cluster' ? 'Host Resource Group' : 'Host ID', value: hostMoref }, { title: 'Affinity', value: affinity }, { title: 'AMI', value: image }, { title: 'License', value: license }];
            }
            keys = [...keys, { title: 'instance.type', value: instanceType }, { title: 'volume.type', value: volumeType }, { title: 'volume.iops', value: volumeIOPS }, { title: 'label.instance.tags', value: tagData }];
            break;
        case PLATFORM_TYPES.GCP:
            keys = [
                { title: 'instance.type', value: instanceType },
                { title: 'volume.type', value: volumeType },
                { title: 'label.instance.tags', value: tagData },
                { title: 'label.security.groups', value: securityGroups },
            ];
            break;
        case PLATFORM_TYPES.VMware:
            keys = [
                { title: 'label.datacenter', value: datacenterMoref },
                { title: 'label.folderPath', value: folderPath },
                { title: 'label.compute.resource', value: hostMoref },
                { title: 'label.storage', value: datastoreMoref },
                { title: 'label.cpu.nums', value: numCPU },
                { title: 'label.memory', value: memory },
            ];
            break;
        case PLATFORM_TYPES.Azure:
            keys = [
                { title: 'label.Resourcegrp', value: folderPath },
                { title: 'vm.size', value: instanceType },
                { title: 'volume.type', value: volumeType },
                { title: 'label.instance.tags', value: tagData },
                { title: 'label.network.tags', value: securityGroups },
                { title: 'label.available.zone', value: availZone },
            ];
            break;
        default:
            break;
    }

    return keys;
}

function getNetworkConfig({ sourceConfig, user, platformType }: { sourceConfig: InstanceData; user: UserInterface; platformType: string }) {
    const { networks = [], availZone } = sourceConfig;
    const netWorkKeys: any = [];
    networks.forEach((nw: any, index: number) => {
        const { vpcId = '', Subnet = '', isPublicIP = '', networkTier = '', isFromSource, securityGroups, adapterType, networkMoref } = nw;
        let { subnet = '', network, publicIP } = nw;
        if (subnet === '' && Subnet !== '') {
            subnet = Subnet;
        }
        let keys: any = [];
        switch (platformType) {
            case PLATFORM_TYPES.AWS:
                keys = [
                    { title: 'label.vpc.id', value: vpcId },
                    { title: 'label.subnet', value: subnet },
                    { title: 'label.availZone', value: availZone },
                    { title: 'label.auto.publicIP', value: isPublicIP },
                    { title: 'label.networkTier', value: networkTier },
                    { title: 'label.security.groups', value: securityGroups },
                    { title: 'label.network', value: networkMoref },
                ];
                if (platformType === PLATFORM_TYPES.AWS) {
                    keys = [...keys, { title: 'label.copy.fromSource', value: isFromSource }];
                }
                break;
            case PLATFORM_TYPES.GCP:
                const networkOption = getNetworkOptions(user);
                networkOption.forEach((netopt: any) => {
                    if (netopt.value === network) {
                        network = netopt.label;
                    }
                });
                if (network !== '' || typeof network !== 'undefined') {
                    network = getGCPNetworkValue(network);
                }
                keys = [
                    { title: 'label.network', value: network },
                    { title: 'label.subnet', value: subnet },
                    { title: 'label.networkTier', value: networkTier },
                    { title: 'label.auto.publicIP', value: isPublicIP },
                ];
                break;
            case PLATFORM_TYPES.VMware:
                keys = [
                    { title: 'label.network', value: network },
                    { title: 'label.adapter.type', value: adapterType },
                    { title: 'label.auto.publicIP', value: isPublicIP },
                ];
                break;
            case PLATFORM_TYPES.Azure:
                let networkLabel = '';
                let subnetLabel = '';
                let securityLabel = '';
                if (network !== '') {
                    networkLabel = getLabelWithResourceGrp(network);
                }
                if (subnet !== '') {
                    subnetLabel = getLabelWithResourceGrp(subnet);
                }
                if (securityGroups !== '') {
                    securityLabel = getLabelWithResourceGrp(securityGroups);
                }
                if (publicIP !== '') {
                    publicIP = getLabelWithResourceGrp(publicIP);
                }
                keys = [
                    { title: 'label.network', value: networkLabel || '' },
                    { title: 'label.subnet', value: subnetLabel || '' },
                    { title: 'label.security.groups', value: securityLabel || '' },
                    { title: 'label.auto.publicIP', value: typeof isPublicIP !== 'undefined' ? isPublicIP : '' },
                ];
                break;
            default:
                break;
        }
        const nic = { title: `Nic-${index + 1}`, values: keys };
        netWorkKeys.push(nic);
    });
    return netWorkKeys;
}

function getRecoveryScriptInfo(sourceConfig: InstanceData) {
    const { preScript, postScript } = sourceConfig;
    const keys = [
        { title: 'label.preScript', value: preScript },
        { title: 'label.postScript', value: postScript },
    ];
    if (preScript === '' || postScript === '' || typeof preScript === 'undefined' || typeof postScript === 'undefined') {
        return null;
    }
    return keys;
}

// function getRepScriptInfo(sourceConfig: InstanceData, user: UserInterface) {
//     const { repPostScript, repPreScript } = sourceConfig;
//     const keys = [
//         { title: 'label.preScript', value: repPreScript },
//         { title: 'label.postScript', value: repPostScript },
//     ];
//     if (repPostScript === '' || repPreScript === '' || typeof repPostScript === 'undefined' || typeof repPreScript === 'undefined') {
//         return null;
//     }
//     return keys;
// }
