/* eslint-disable no-unused-vars */
import { Dispatch } from 'redux';
import { UserInterface } from './interfaces';

export interface UpgradeStepsInterface {
    label: string;
    state: 'done' | 'running' | '';
    component: string;
    stepIsDisabled: boolean;
    postAction?: (() => void) | undefined;
    isAsync?: boolean;
    nextLabel?: string;
    backLabel?: string;
    disableNext?: ((user: UserInterface) => boolean) | boolean;
    doNotShoNextLabel?: boolean;
    url?: string;
    propsData?: Record<string, any>;
}

export interface ComponentInterface {
    component: string;
    data: UpgradeStepsInterface[];
    dispatch: Dispatch<any>;
}

// COMPONENT RENDERER INTERFACES

export interface RendererProps {
    data?: any;
    field?: any;
    dispatch: Dispatch<any>;
    user: UserInterface;
    component: string;
    upgrade: {
        steps: UpgradeStepsInterface[];
        currentStep: number;
    };
    propsData?: Record<string, any>;
    nextLabel?: string;
    t: any;
}

export interface UpgradeHistoryInterface {
    id: string;
    packageName: string;
    location: string;
    backupLocation: string;
    upgradePackageInfo: string;
    applicableNodes: string;
    totalNodes: number;
    steps: string;
    action: string;
    status: string;
    startTime: number;
    endTime: number;
    showRevertBtn?: boolean;
}
