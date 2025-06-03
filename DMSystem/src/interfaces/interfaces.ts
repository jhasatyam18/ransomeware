import { IconProp } from '@fortawesome/fontawesome-svg-core';
import React from 'react';
import { Dispatch } from 'redux';
import { UpgradeStepsInterface } from './upgradeInterfaces';

export interface INITIAL_STATE {
    global: {
        loaderKeys: {};
    };
    layout: string;
    messages: Record<string, MessageProps>;
    user: UserInterface;
    modal: [];
    dashboard: {
        titles: {};
    };
    upgrade: {
        steps: UpgradeStepsInterface[];
        currentStep: number;
    };
}

export interface BootOrder {
    name: string;
    bootorder: number;
}

export interface Global {
    loaderKeys: Record<string, any>;
}

export interface Modal {
    content: any;
    options: Record<string, any>;
    show: boolean;
}

export interface Dashboard {
    titles: Record<string, any>;
}

export interface MessageProps {
    type: string;
    text: string;
    isSticky?: boolean;
    msgType: string;
    id: string;
}

export interface UserInterface {
    id: number;
    context: { refresh: number; updateID: number };
    passwordChangeReq: boolean;
    allowCancel: boolean;
    passwordResetReq: boolean;
    allowReset: boolean;
    isAuthenticated: boolean;
    token: string;
    userName: string;
    isSystemDefault: boolean;
    isValidating: boolean;
    values: {
        [key: string]: any;
    };
    errors: {
        [key: string]: any;
    };
    appType: string;
    platformType: string;
    localVMIP: string;
    privileges: string[];
    license: { applicationKey: string; version: '-' };
    roles: Record<string, any>[];
    users: Record<string, any>[];
    [key: string]: any;
}

export type StatusKey = 'partially-completed' | 'running' | 'completed';

export interface MessagesProps {
    dispatch: Dispatch<any>;
    messages: Record<string, MessageProps>;
}

export interface SiteInterface {
    description: string;
    id: number;
    isUpdated: boolean;
    name: string;
    node: NodeInterface;
    platformDetails: PlatformDetailsInterface;
    remoteSiteId: string;
}

export interface NodeInterface {
    id: number;
    hostname: string;
    isLocalNode: boolean;
    managementPort: number;
    name: string;
    nodeKey: string;
    nodePlatformID: string;
    nodeType: string;
    platformType: string;
    replicationCtrlPort: number;
    replicationDataPort: number;
    status: string;
    username: string;
    version: string;
    revertVersion?: string;
    systemPackageVersion: string;
}

export interface UpgradeInstallationStatus {
    action: string;
    status: string;
}

// Dashboard Tiles

export interface SiteDetail {
    id: number;
    name: string;
}

export interface TilesData {
    siteCount: number;
    protectionPlans: number;
    siteConnections: any;
    siteDetails: SiteDetail[];
    protectedVMs: number;
    protectedStorage: number;
}

export interface PlatformDetailsInterface {
    id: number;
    platformType: string;
    hostname: string;
    port: number;
    username: string;
    password: string;
    region: string;
    availZone: string;
    secretKey: string;
    accessKey: string;
    projectId: string;
    storageAccount: string;
    tenantId: string;
    clientId: string;
}

export type SideBarMenuItem = {
    label: string;
    to: string;
    icon: IconProp;
    isActivePath: string[];
    hasSubMenu?: boolean;
    subMenu?: SideBarMenuItem[];
    hasChildren: boolean;
};

export type NodeVersionData = {
    name: string;
    version: string;
    status: string;
};

export interface NodeUpgradeVersionInterface {
    name: string;
    size: number;
    showSummary?: boolean;
    packages: {
        componentType: string;
        version: string;
        component: Record<string, string>[];
        package: string;
        packageSummary: string[];
    }[];
    action?: string;
}

export interface NewInterface {
    name: string;
    size: number;
    description: string;
    checksum: string;
    packages: Record<string, any>[];
}
// Define type for options
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
    show: boolean;
    options: ModalOptions;
    content?: React.ReactNode;
    floatModalRight?: boolean;
}

export interface UserPreferences {
    themePreference: 'light' | 'dark'; // Add other possible values if needed
    userType: 'System' | 'SAML'; // Expand as needed
    username: string;
}

type Role = {
    id: number;
    name: string;
    description: string;
    isSystemDefault: boolean;
    privileges: any; // or replace `any` with a more specific type if known
};

export type UserDtails = {
    id: number;
    username: string;
    fullName: string;
    password: string;
    email: string;
    description: string;
    isSystemDefault: boolean;
    isForcePasswordChange: boolean;
    role: Role;
};
