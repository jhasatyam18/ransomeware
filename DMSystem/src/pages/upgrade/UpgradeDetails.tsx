import React, { useEffect } from 'react';
import { withTranslation, WithTranslationProps } from 'react-i18next';
import { CardBody, Col, Row } from 'reactstrap';
import { Dispatch } from 'redux';
import { NodeUpgradeVersionInterface, UserInterface } from '../../interfaces/interfaces';
import { STATIC_KEYS } from '../../Constants/userConstants';
import { valueChange } from '../../store/actions';
import { UpgradeHistoryInterface } from '../../interfaces/upgradeInterfaces';
import { Link } from 'react-router-dom';
import PackageInfoCards from './PackageInfoCards';
import { openModal } from '../../store/actions/ModalActions';
import { ACTIVITIES_MODAL } from '../../Constants/ModalConstant';
import Table from '../../Components/Table/Table';
import { UPGRADE_REVERT_NODES_TABLE } from '../../Constants/TableConstants';

interface Props extends WithTranslationProps {
    user: UserInterface;
    dispatch: Dispatch<any>;
    t?: any;
}

interface UpgradeDetailsProps extends Props {
    data: UpgradeHistoryInterface; // Replace with the appropriate type for `data`
    user: any;
}

const UpgradeDetails: React.FC<UpgradeDetailsProps> = ({ data, ...props }) => {
    const { t, dispatch, user } = props;
    const nodeUpgradeVersion: NodeUpgradeVersionInterface = JSON.parse(data.upgradePackageInfo) || '';
    useEffect(() => {
        return () => {
            dispatch(valueChange(STATIC_KEYS.UI_SELECTED_UPGRADE_HISTORY, ''));
        };
    }, []);

    if (Object.keys(data).length === 0) {
        return <CardBody></CardBody>;
    }

    let parsedSteps: any = [];
    if (data.steps.length > 0 || data.steps !== '') {
        parsedSteps = JSON.parse(data.steps);
    }

    const handleDivClick = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        event.stopPropagation();
    };
    const openInfoModal = () => {
        const options = { title: 'Upgrade Activities', isUpdate: true, data: { data: data, steps: parsedSteps }, floatModalRight: true };
        dispatch(openModal(ACTIVITIES_MODAL, options));
    };

    return (
        <CardBody onClick={handleDivClick} style={{ fontSize: '0.7rem' }}>
            <hr className="mt-0 pt-0 mb-4" />
            {Object.keys(data).length === 0 ? null : (
                <>
                    <Row>
                        <Col sm={5}>
                            <p className="font-weight-bold mb-0">{t('Package Information')}</p>
                        </Col>
                        <Col sm={5}>
                            <p className="font-weight-bold mb-0">{t('Node Information')}</p>
                        </Col>
                    </Row>
                    <Row className="margin-top-10">
                        <Col sm={5}>
                            <PackageInfoCards nodeUpgradeVersion={nodeUpgradeVersion} />
                            <Link to="#" className="font-weight-bold">
                                <span onClick={openInfoModal}>{t('Show Activities')}</span>
                            </Link>
                        </Col>
                        <Col sm={7}>
                            <Table dispatch={dispatch} columns={UPGRADE_REVERT_NODES_TABLE} data={JSON.parse(data.applicableNodes)} primaryKey="id" user={user} />
                        </Col>
                    </Row>
                </>
            )}
        </CardBody>
    );
};

export default withTranslation()(UpgradeDetails);
