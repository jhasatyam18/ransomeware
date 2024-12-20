import React from 'react';
import { withTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { UPGRADE_DOWNLOAD_PACKAGE_STEP, UPGRADE_INSTALLATION_STEP, UPGRADE_PREVIEW_STEP, UPGRADE_SUMMARY_STEP } from '../Constants/userConstants';
import { INITIAL_STATE } from '../interfaces/interfaces';
import { RendererProps } from '../interfaces/upgradeInterfaces';
import DownloadPackages from './upgrade/DownloadPackage';
import Preview from './upgrade/Preview';
import UpgradeInstallationSteps from './upgrade/UpgradeInstallationSteps';
import UpgradeSummary from './upgrade/UpgradeSummary';

const ComponentRenderer: React.FC<RendererProps> = (props) => {
    const { component } = props;
    function renderer() {
        switch (component) {
            case UPGRADE_DOWNLOAD_PACKAGE_STEP:
                return <DownloadPackages {...props} />;
            case UPGRADE_PREVIEW_STEP:
                return <Preview {...props} />;
            case UPGRADE_INSTALLATION_STEP:
                return <UpgradeInstallationSteps {...props} />;
            case UPGRADE_SUMMARY_STEP:
                return <UpgradeSummary {...props} />;
            default:
                return null;
        }
    }

    return <>{renderer()}</>;
};

function mapStateToProps(state: INITIAL_STATE) {
    const { user, upgrade } = state;
    return {
        user,
        upgrade,
    };
}
export default connect(mapStateToProps)(withTranslation()(ComponentRenderer));
