import React from 'react';
import { withTranslation } from 'react-i18next';
import { Card, CardBody, Col, Row } from 'reactstrap';
import { ProgressBar } from '@dm/common-comp';
import styled from 'styled-components';
import SelectionAction from './RecoveryStateTabs';

const RightAlignedCol = styled(Col)`
    display: flex;
    width: 100%;
    justify-content: flex-end;
`;

function RecoveryStat() {
    const options = [
        { label: 'Day', value: 'day' },
        { label: 'Week', value: 'week' },
        { label: 'Month', value: 'month' },
    ];
    const data = {};
    return (
        <StyledCard>
            <CardBody>
                <Row>
                    <Col sm={6}>
                        <p className="font-weight-medium color-white text-muted mb-0">Recovery Stats</p>
                    </Col>
                    <Col sm={6}>
                        <RightAlignedCol>
                            <SelectionAction buttons={options} />
                        </RightAlignedCol>
                    </Col>
                </Row>

                <Row className="mb-3 mt-3 text-mute">
                    <Col sm={2} />
                    <Col sm={4}>Recovery RTO : 6 min 10 Sec</Col>
                    <Col sm={2} />
                    <Col sm={4}>Test Recovery RTO: 9M</Col>
                </Row>
                <Row className="mb-3 ">
                    <Col sm={6}>
                        <ProgressBar completed={50} staticBar color="#34c38f" text="Protection Plan 20/42" data={data} />
                    </Col>
                    <Col sm={6}>
                        <ProgressBar completed={32} staticBar color="#34c38f" text="Protection Plan 40/42" data={data} />
                    </Col>
                </Row>
                <Row className="mb-3">
                    <Col sm={6}>
                        <Row>
                            <Col sm={8}>Passed 35</Col>
                            <Col>Failed 5</Col>
                        </Row>
                    </Col>
                    <Col sm={6}>
                        <Row>
                            <Col sm={8}>Passed 40</Col>
                            <Col>Failed 2</Col>
                        </Row>
                    </Col>
                </Row>
                <Row className="mb-3">
                    <Col sm={6}>
                        <ProgressBar completed={95} staticBar color="#34c38f" text="175 / 350" data={data} />
                    </Col>
                    <Col sm={6}>
                        <ProgressBar completed={90} staticBar color="#34c38f" text="315 / 350" data={data} />
                    </Col>
                </Row>
                <Row className="mb-3">
                    <Col sm={6}>
                        <Row>
                            <Col sm={8}>Passed 100</Col>
                            <Col>Failed 4</Col>
                        </Row>
                    </Col>
                    <Col sm={6}>
                        <Row>
                            <Col sm={8}>Passed </Col>
                            <Col>Failed 4</Col>
                        </Row>
                    </Col>
                </Row>
                <Row>
                    <Col> Total Recoveries Done Till Date: 200</Col>
                    <Col> Total Recoveries Done Till Date: 500</Col>
                </Row>
            </CardBody>
        </StyledCard>
    );
}

const StyledCard = styled(Card)`
    background-color: #2a3042;
    border: none;
    border-radius: 4px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
    color: #bfc8e2;
`;

export default withTranslation()(RecoveryStat);
