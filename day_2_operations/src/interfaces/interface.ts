import { IconProp } from '@fortawesome/fontawesome-svg-core';
import React from 'react';

export interface MessageProps {
    type: string;
    text: string;
    isSticky?: boolean;
    msgType: string;
    id: string;
}
export type GlobalInterface = {
    loaderKeys: {
        [key: string]: string;
    };
    context: { refresh: number };
    expandedPage: string;
    lastSyncTime: number;
};

export interface LayoutState {
    leftSideBarType: string;
    [key: string]: any;
}

export interface INITIAL_STATE_INTERFACE {
    global: GlobalInterface;
    layout: LayoutState;
    messages: Record<string, MessageProps>;
    user: UserInterface;
    modal: Record<string, any>[];
    dashboard: Record<string, any>;
    site: { sites: Record<string, any>[] };
    nodes: { nodes: Record<string, any>[]; selectedNode: Record<string, any>[] };
    sites: { sites: Record<string, any>[]; selectedSites: Record<string, any>[] };
    jobs: { replications: Record<string, any>[]; recovery: Record<string, any>[] };
    plan: { plan: Record<string, any>[]; vm: Record<string, any>[] };
    alerts: { data: Record<string, any>[]; unread: Record<string, any>[] };
    license: Record<string, any>[];
    settings: { bundles: Record<string, any>[] };
}

export interface UserInterface {
    passwordChangeReq: boolean;
    id: number;
    privileges: string[];
    isAuthenticated: boolean;
    token: string;
    userName: string;
    isSystemDefault: boolean;
    activeTab: number;
    values: Record<string, any>;
    errors: Record<string, any>;
    passwordReset: boolean;
    allowCancel: boolean;
    userDetails: UserDetails;
    userPreferences: UserPreferences;
    appType: string;
    platformType: string;
    localVMIP: string;
    zone: string;
    license: Record<string, any>;
}

export interface GetValueProps {
    key: string;
    values: Record<string, any>;
}
export interface ModalOptions {
    css?: string;
    size?: string;
    floatModalRight?: boolean;
    width?: string;
    modalActions?: boolean;
    title?: string;
    onCloseParams?: any[];
    [key: string]: any;
}
export interface ModalData {
    options: ModalOptions;
    content?: React.ReactNode;
    floatModalRight?: boolean;
}

export type SiteInterFace = {
    id: string;
    name: string;
    platform: 'AWS' | 'Azure' | 'GCP' | string; // Extend as needed
    location: string;
    protectionPlans: string; // Change to `number` if it's numeric
};

export interface JobsProps {
    data: Record<string, any>;
}
export interface JobInterface {
    replication: Record<string, any>[];
    recovery: Record<string, any>[];
}

export interface SiteInterface {
    id: string;
    name: string;
    hostName: string;
    userName: string;
    password: string;
    platformType: string;
    location: string;
    mgmtPort: number;
    totalProtectionPlans: number;
}

export interface SelectedSites {
    [key: string]: SiteInterface; // dynamically keyed object with Site type
}

export interface SitesState {
    sites: SiteInterface[];
    selectedSites: SelectedSites;
}

export interface ProtectionPlan {
    id: string;
    name: string;
    replicationInterval: number;
    lastTestRecoveryTime: number;
    status: string;
    totalPITCopies: number;
    sourcePlanID: number;
    targetPlanID: number;
    isCleanupRequired: boolean;
    isDRReady: boolean;
    sourceSiteID: string;
    sourceSite: SiteInterface;
    targetSiteID: string;
    targetSite: SiteInterface;
    alerts: string;
}

export interface TableColumn {
    label: string;
    field: string;
    allowSort?: boolean;
    allowFilter?: boolean;
    checked?: boolean;
    itemRenderer?: string;
    width?: number | string | any;
    defaultSort?: number;
}
export interface GlobalState {
    loaderKeys: Record<string, any>; // Dictionary-like object for loader keys
    context: {
        refresh: number;
    };
    expandedPage: string;
}

interface Network {
    Subnet: string;
    adapterType: string;
    dns: string;
    gateway: string;
    id: string;
    isFromSource: boolean;
    isPublicIP: boolean;
    macAddress: string;
    netmask: string;
    network: string;
    networkKey: number;
    networkPlatformID: string;
    networkTier: string;
    privateIP: string;
    publicIP: string;
    securityGroups: string;
    vpcId: string;
}

export interface InstanceData {
    affinity: string;
    availZone: string;
    bootPriority: number;
    datacenterMoref: string;
    datastoreMoref: string;
    deleteCheckpoint: boolean;
    deleteInstance: boolean;
    encryptionKey: string;
    folderPath: string;
    hostMoref: string;
    hostType: string;
    id: string;
    image: string;
    instanceID: string;
    instanceName: string;
    instanceType: string;
    isResetRequired: boolean;
    license: string;
    memoryMB: number;
    networks: Network[]; // Array of network objects
    numCPU: number;
    postScript: string;
    preScript: string;
    recoveryEntityType: string;
    securityGroups: string;
    sourceMoref: string;
    tags: any[]; // Assuming it's an array of strings
    tenancy: string;
    testRecoveryConfig: string;
    volumeIOPS: number;
    volumeType: string;
}

interface RecoveryStep {
    name: string;
    message: string;
    time: number;
    status: string;
    data: string;
}

export interface RecoveryData {
    bootOrder: number;
    config: string; // Could be a JSON string or parsed object
    endTime: number;
    failureMessage: string;
    guestOS: string;
    id: number;
    instanceID: string;
    isPreserveCheckpoint: boolean;
    privateIP: string;
    protectionPlanID: number;
    protectionPlanName: string;
    publicIP: string;
    recoveryCheckpointID: string;
    recoveryPointTime: number;
    recoveryType: string;
    startTime: number;
    status: string;
    step: RecoveryStep[] | string; // Could be an array or a JSON string
    testRecoverySnapshots: string;
    vmMoref: string;
    vmName: string;
}

export interface UserDetails {
    id: number;
    username: string;
    fullName: string;
    password: string;
    email: string;
    description: string;
    isSystemDefault: boolean;
    isForcePasswordChange: boolean;
    role: {
        id: number;
        name: string;
        description: string;
        isSystemDefault: boolean;
        privileges: any | null; // Replace `any` with a more specific type if known
    };
}

export interface UserPreferences {
    userType: 'System' | 'Saml' | '';
    themePreference: 'dark' | 'light';
    username: string;
}
export interface DashboardTitles {
    sites: number;
    protectionPlans: number;
    vms: number;
    storage: number;
    siteConnections?: object;
    siteDetails?: object;
}

export interface SiteOptions {
    value: string;
    label: string;
    type: string;
}

export type Theme = 'light' | 'dark';

export interface FieldOption {
    label: string;
    value: string;
}
export type SideBarMenuItem = {
    label: string;
    to: string;
    icon: IconProp;
    isActivePath: string[];
    hasSubMenu?: boolean;
    subMenu?: SideBarMenuItem[];
    hasChildren?: boolean;
};

export interface LicenseData {
    ID: number;
    siteName: string;
    allowMigration: boolean;
    allowRecovery: boolean;
    completedMigrations: string;
    completedRecoveries: string;
    createTime: number;
    expiredTime: number;
    isActive: boolean;
    isExpired: boolean;
    licenseType: string;
    migrationLimit: string;
    platform: string;
    recoveryLimit: string;
}

export interface SupportBundlePayload {
    description: string;
    generatedBy: string;
}
