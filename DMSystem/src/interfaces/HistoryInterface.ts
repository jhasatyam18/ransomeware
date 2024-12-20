export interface PackageInfo {
    metaInformation: {
        name: string;
        size: string;
        description: string;
        checksum: string;
    };
    packages: {
        package: string;
        description: string;
        component: string;
        checksum: string;
        platform: string;
        versionInfo: {
            major: string;
            minor: string;
            patch: string;
            build: string;
            minimumCompatibleMajor: string;
            minimumCompatibleMinor: string;
        };
        preScript: string;
        postScript: string;
        issuesSummary: {
            id: string;
            summary: string;
        }[];
    }[];
}

export interface UpgradeNodeInterface {
    nodeName: string;
    nodeHost: string;
    currentVersion: string;
    newVersion: string;
    status: string;
    nodeStatus: string;
    isRevert: string;
    nodeType: string;
    appliedVersion: string;
    revertVersion?: string;
}

export interface Step {
    step: string;
    isRevertible: boolean;
    status: string;
    subStep: string;
    startTime: number;
    endTime: number;
    failureMessage: string;
}

export interface UpgradeData {
    id: string;
    packageName: string;
    location: string;
    backupLocation: string;
    upgradePackageInfo: PackageInfo;
    applicableNodes: Node[];
    totalNodes: number;
    steps: Step[];
    action: string;
    status: string;
    startTime: number;
    endTime: number;
}
