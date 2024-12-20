import React from 'react';
import { Col, Row } from 'reactstrap';
import { getStorageWithUnit } from '../../utils/appUtils';
import { NodeUpgradeVersionInterface } from '../../interfaces/interfaces';
import { withTranslation, WithTranslation } from 'react-i18next';

interface PackageInfoCardsInterface extends WithTranslation {
    nodeUpgradeVersion: NodeUpgradeVersionInterface;
}
function PackageInfoCards(props: PackageInfoCardsInterface) {
    const { nodeUpgradeVersion, t } = props;
    if (Object.keys(nodeUpgradeVersion).length === 0) {
        return null;
    }
    const packagedToBeUpgraded: { component: string; version: string }[] = [];
    const packagedToBeUpgradedDescription: { id: string; summary: string }[] = [];
    nodeUpgradeVersion?.packages?.forEach((pack: any) => {
        pack?.component.map((cmp: any) => {
            packagedToBeUpgraded.push({ component: cmp.componentType, version: cmp.version });
        });
        packagedToBeUpgradedDescription.push(...pack.packageSummary);
    });
    const { name, size } = nodeUpgradeVersion;
    return (
        <>
            <Row>
                <Col sm={4}>
                    <p>{t('name')}</p>
                </Col>
                <Col sm={8}>
                    <p>{name}</p>
                </Col>
            </Row>
            <Row>
                <Col sm={4}>
                    <p>{t('size')}</p>
                </Col>
                <Col sm={8}>
                    <p>{getStorageWithUnit(size)}</p>
                </Col>
            </Row>
            <Row>
                <Col sm={4}>Package Description</Col>
                <Col sm={8}>
                    {nodeUpgradeVersion?.packages?.map((el) => {
                        return (
                            <>
                                <Row key={el.package} className="mb-">
                                    <Col sm={4}>{el.package}</Col>
                                    <Col sm={12} className="margin-left-20">
                                        {el.component.map((comp) => {
                                            return (
                                                <li key={comp.componentType}>
                                                    {comp.componentType}
                                                    {comp.componentType === 'SYSTEM-PACKAGES-UPGRADE' ? '' : ` - ${comp.version}`}
                                                </li>
                                            );
                                        })}
                                    </Col>
                                </Row>
                            </>
                        );
                    })}
                </Col>
            </Row>
            <Row className="mt-3">
                <Col sm={4}>Package Summary</Col>
                <Col sm={8}>
                    {nodeUpgradeVersion.packages.map((pckg) => {
                        return pckg.packageSummary.map((sum) => {
                            return <li key={sum.trim()}>{sum}</li>;
                        });
                    })}
                </Col>
            </Row>
        </>
    );
}

export default withTranslation()(PackageInfoCards);
