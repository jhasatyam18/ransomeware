import { faCheckCircle, faCircleXmark, faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';

const NodeHealthHoverInfo = () => {
    return (
        <>
            <div className="dr-summary-container">
                <p className="font-weight-medium" style={{ fontSize: '12px' }}>
                    DR Health & Readiness Summary
                </p>
                <table className="dr-summary-table">
                    <tbody>
                        <tr>
                            <td>Status</td>
                            <td>RPO</td>
                            <td>Test Drill</td>
                            <td>DR Ready</td>
                        </tr>
                        <tr>
                            <td className="status text-success d-flex">
                                {' '}
                                <FontAwesomeIcon icon={faCheckCircle} className="me-1 " />
                                Achieved
                            </td>
                            <td>All plans meet RPO.</td>
                            <td>All test recoveries done within window.</td>
                            <td>Both RPO & Test Drill met for all plans.</td>
                        </tr>
                        <tr>
                            <td className="status text-warning d-flex">
                                {' '}
                                <FontAwesomeIcon icon={faExclamationTriangle} className="me-1 " />
                                Partial
                            </td>
                            <td>Some plans meet RPO.</td>
                            <td>Few test recoveries within window.</td>
                            <td>RPO & Test Drill met for some plans.</td>
                        </tr>
                        <tr>
                            <td className="status text-danger d-flex">
                                {' '}
                                <FontAwesomeIcon icon={faCircleXmark} className="me-1 " />
                                Breached
                            </td>
                            <td>No plans meet RPO.</td>
                            <td>No successful test recoveries within window.</td>
                            <td>RPO & Test Drill not met for any plans.</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </>
    );
};

export default NodeHealthHoverInfo;
