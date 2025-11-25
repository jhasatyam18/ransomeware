import React, { useEffect, useState } from 'react';
import { withTranslation, WithTranslation } from 'react-i18next';
import { connect, useSelector } from 'react-redux';
import { Card, CardBody, Col, Row } from 'reactstrap';
import { Dispatch } from 'redux';
import SimpleBar from 'simplebar-react';
import { GET_SERVICE_INFO, GET_SYSTEM_INFO } from '../../../Constants/apiConstants';
import { RUNNING, SYSTEM_INFO } from '../../../Constants/InputConstants';
import { MESSAGE_TYPES } from '../../../Constants/MessageConstants';
import { INITIAL_STATE, UserInterface } from '../../../interfaces/interfaces';
import { hideApplicationLoader, showApplicationLoader } from '../../../store/actions';
import { addMessage } from '../../../store/actions/MessageActions';
import { callAPI } from '../../../utils/apiUtils';
import { calculateDifferenceInPercentage, convertBytes, findDifferenceInTimeFromNow } from '../../../utils/appUtils';
import ProgressBar from '../../Shared/ProgressBar';
import StatusItemRenderer from '../../Table/ItemRenderer/StatusItemRenderer';
interface Info {
    totalCpuFrequency: number;
    utilizedCpuFrequency: number;
    memoryTotal: number;
    memoryUsed: number;
    memory_free: number;
    diskTotal: number;
    diskUsed: number;
    disk_free: number;
}

type serviceInfo = {
    serviceName: string;
    serviceStatus: string;
    serviceStartTime: number;
};

type byteConversion = {
    used: string;
    total: string;
};

interface SystemInfoProps extends WithTranslation {
    user: UserInterface;
    dispatch: Dispatch<any>;
    t: any;
}

const SystemInfo: React.FC<SystemInfoProps> = ({ t, dispatch }) => {
    const [systemData, setSystemData] = useState<Info | null>(null);
    const [serviceData, setServiceData] = useState<serviceInfo[]>([]);
    const refresh: number = useSelector((state: INITIAL_STATE) => state.user.context.refresh);

    useEffect(() => {
        dispatch(showApplicationLoader(t('system.data'), t('feching.system.data')));
        callAPI(GET_SYSTEM_INFO).then(
            (data) => {
                dispatch(hideApplicationLoader(t('system.data')));
                setSystemData(data);
            },
            (err) => {
                dispatch(hideApplicationLoader(t('system.data')));
                dispatch(addMessage(err.message, MESSAGE_TYPES.ERROR));
            },
        );
        dispatch(showApplicationLoader(t('service.data'), t('feching.service.data')));
        callAPI(GET_SERVICE_INFO).then(
            (data) => {
                dispatch(hideApplicationLoader(t('service.data')));
                data.forEach((element: serviceInfo) => {
                    const obj = element;
                    if (element.serviceStatus === SYSTEM_INFO.ACTIVE) {
                        obj.serviceStatus = RUNNING;
                    }
                });
                setServiceData(data);
            },
            (err) => {
                dispatch(hideApplicationLoader(t('service.data')));
                dispatch(addMessage(err.message, MESSAGE_TYPES.ERROR));
            },
        );
    }, [refresh]);

    const renderSystemInfo = () => {
        if (!systemData) {
            return (
                <Col sm={5}>
                    <Card>
                        <CardBody>{t('no.data.show')}</CardBody>
                    </Card>
                </Col>
            );
        }

        const cpuUsage: number = (systemData.utilizedCpuFrequency / systemData.totalCpuFrequency) * 100;
        const memoryUsage: byteConversion = convertBytes(systemData.memoryTotal, systemData.memoryUsed);
        const diskUsage: byteConversion = convertBytes(systemData.diskTotal, systemData.diskUsed);

        return (
            <Col sm={5}>
                <Card className=" box-shadow">
                    <CardBody className="text-right">
                        <p className="font-weight-medium text-left margin-bottom-0">{t('system.information')}</p>
                        <hr />
                        <small>{`${systemData.utilizedCpuFrequency.toFixed(2)} GHz/${systemData.totalCpuFrequency.toFixed(2)} GHz`}</small>
                        <Row className="mb-2">
                            <Col sm={3} className="text-left">
                                {t('CPU')}
                            </Col>
                            <Col>
                                <ProgressBar completed={cpuUsage} staticBar />
                            </Col>
                        </Row>
                        <small>{`${memoryUsage.used}/${memoryUsage.total}`}</small>
                        <Row className="mb-2">
                            <Col sm={3} className="text-left">
                                {t('Memory')}
                            </Col>
                            <Col>
                                <ProgressBar completed={calculateDifferenceInPercentage(systemData.memoryUsed / 1024 ** 3, systemData.memoryTotal / 1024 ** 3)} staticBar />
                            </Col>
                        </Row>
                        <small>{`${diskUsage.used}/${diskUsage.total}`}</small>
                        <Row>
                            <Col sm={3} className="text-left">
                                {t('Storage')}
                            </Col>
                            <Col>
                                <ProgressBar completed={calculateDifferenceInPercentage(systemData.diskUsed / 1024 ** 3, systemData.diskTotal / 1024 ** 3)} staticBar />
                            </Col>
                        </Row>
                    </CardBody>
                </Card>
            </Col>
        );
    };

    const renderServiceInfo = () => {
        return (
            <Col sm={7}>
                <Card className="padding-bottom-4 box-shadow">
                    <CardBody>
                        <span className="font-weight-medium  font-weight-bold">{t('service.information')}</span>
                        <hr></hr>
                        <Row className="pb-1 margin-top-5">
                            <Col sm={5} className="font-weight-bold">
                                Service Name
                            </Col>
                            <Col sm={3} className="d-flex justify-content-center font-weight-bold">
                                Up Time
                            </Col>
                            <Col sm={4} className="d-flex justify-content-center font-weight-bold">
                                Status
                            </Col>
                        </Row>
                        <SimpleBar style={{ minHeight: '105px', maxHeight: '105px' }}>
                            {serviceData.length > 0 &&
                                serviceData.map((el, i) => (
                                    <Row key={i} className="margin-top-7">
                                        <Col sm={5}>{el.serviceName}</Col>
                                        <Col sm={3} className="d-flex justify-content-center">
                                            {findDifferenceInTimeFromNow(el.serviceStartTime)}
                                        </Col>
                                        <Col sm={4} className="d-flex justify-content-center h-25">
                                            <StatusItemRenderer data={el} field={'serviceStatus'} />
                                        </Col>
                                    </Row>
                                ))}
                        </SimpleBar>
                    </CardBody>
                </Card>
            </Col>
        );
    };

    return (
        <Row>
            {renderSystemInfo()}
            {renderServiceInfo()}
        </Row>
    );
};

const mapStateToProps = (state: INITIAL_STATE) => {
    const { user } = state;
    return { user };
};

export default connect(mapStateToProps)(withTranslation()(SystemInfo));
