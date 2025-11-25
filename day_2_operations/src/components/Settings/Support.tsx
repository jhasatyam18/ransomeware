import { faPlus } from '@fortawesome/free-solid-svg-icons';
import React, { useEffect } from 'react';
import { withTranslation, WithTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { Card, CardBody, Col, Container, Row } from 'reactstrap';
import { ActionButton } from '@dm/common-comp';
import DMBreadCrumb from '../shared/DMBreadCrumb';
import DMPaginatorTableWrapper from '../shared/DMPaginatorTableWrapper';
import { INITIAL_STATE_INTERFACE } from '../../interfaces/interface';
import { API_SUPPORT_BUNDLE } from '../../constants/ApiUrlConstant';
import { SUPPORT_BUNDLES } from '../../constant/tableConstant';
import { openModal } from '../../store/reducers/ModalReducer';
import { MODAL_GENERATE_SUPPORT_BUNDLE } from '../../constants/userConstant';
import { STATUS_CONSTANTS } from '../../constants/StatusConstant';
import { hasPriviledges } from '../../utils/apiUtils';

interface SupportProps extends WithTranslation {}

const Support: React.FC<SupportProps> = ({ t }) => {
    const dispatch = useDispatch();
    const settings = useSelector((state: INITIAL_STATE_INTERFACE) => state.settings) || { bundles: [] };
    const user = useSelector((state: INITIAL_STATE_INTERFACE) => state.user);
    const { bundles = [] } = settings;
    const refreshdata = useSelector((state: INITIAL_STATE_INTERFACE) => state.global.context.refresh);
    const disable = (bundles.length > 0 && bundles[0].status === STATUS_CONSTANTS.RUNNING) || false;
    let priviledges = hasPriviledges();
    useEffect(() => {}, [refreshdata]);

    const onGenerate = (): void => {
        const options = { title: 'Generate Support Bundle' };
        dispatch(openModal({ content: MODAL_GENERATE_SUPPORT_BUNDLE, options }));
    };

    return (
        <Container fluid>
            <Card>
                <CardBody>
                    <DMBreadCrumb links={[{ label: 'tech.support', link: '#' }]} />
                    <Row>
                        <Col sm={12} style={{ paddingLeft: '5px' }}>
                            <ActionButton cssName="btn btn-secondary btn-sm ms-4" label="Generate" onClick={onGenerate} icon={faPlus} isDisabled={disable || !priviledges} key="newsupportbundle" />
                        </Col>
                        <Col sm={12}>
                            <DMPaginatorTableWrapper user={user} dispatch={dispatch} isSelectable={false} showFilter="true" name="Support_Bundles" apiUrl={`${API_SUPPORT_BUNDLE}?`} columns={SUPPORT_BUNDLES} />
                        </Col>
                    </Row>
                </CardBody>
            </Card>
        </Container>
    );
};

export default withTranslation()(Support);
