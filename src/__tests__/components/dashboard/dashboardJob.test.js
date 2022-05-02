import React from 'react';
import { screen } from '@testing-library/react';
import { setupServer } from 'msw/node';
import DashboardJob from '../../../components/Dashboard/DashboardJob';
import { API_REPLICATION_JOBS, API_RECOVERY_JOBS } from '../../../constants/ApiConstants';
import renderWitRedux from '../../tetsUtils/RenderWithRedux';
import { withoutErrorResponse, withErrorResponse } from '../../tetsUtils/server';

const replicationJobResp = [{ id: 165, protectionPlanID: 7, vmName: 'pr-ubuntu-18-04', diskId: 2000, previousChangeId: '52 7a ec 9c af 38 7d c5-28 fc 8a 22 ee 95 ee d8/3503', changedSize: 0, transferSize: 0, startTime: 1620207855, endTime: 1620207861, status: 'completed', failureMessage: '' }, { id: 164, protectionPlanID: 6, vmName: 'prod-win-2016-demo-207', diskId: 2000, previousChangeId: '52 3e 6a 48 26 9e 80 87-80 82 f2 81 2e 17 37 fb/3903', changedSize: 0, transferSize: 0, startTime: 1620207850, endTime: 1620207852, status: 'completed', failureMessage: '' }];
const recoveredJobResp = [{ id: 2, vmName: 'prod-ubuntu-16-04', startTime: 1625630135, endTime: 1620226610, recoveryType: 'full recovery', step: '', publicIP: '34.72.233.246', status: 'started', failureMessage: '' }, { id: 1, protectionPlanID: 7, vmName: 'prod-ubuntu-18-04', startTime: 1625630135, endTime: 1620196720, recoveryType: 'test recovery', step: '', publicIP: '35.184.228.249', status: 'failed', failureMessage: '' }, { id: 1, protectionPlanID: 7, vmName: 'prod-ubuntu-18-04', startTime: 1625630135, endTime: 1620196720, recoveryType: 'test recovery', step: '', publicIP: '35.184.228.249', status: 'completed', failureMessage: '' }];
const recoveredJobResp2 = [{ id: 2, vmName: 'prod-ubuntu-16-04', startTime: 1625630135, endTime: 1620226610, recoveryType: 'full recovery', step: '', publicIP: '34.72.233.246', status: 'completed', failureMessage: '' }, { id: 1, protectionPlanID: 7, vmName: 'prod-ubuntu-18-04', startTime: 1625630135, endTime: 1620196720, recoveryType: 'test recovery', step: '', publicIP: '35.184.228.249', status: 'running', failureMessage: '' }, { id: 1, protectionPlanID: 7, vmName: 'prod-ubuntu-18-04', startTime: 1625630135, endTime: 1620196720, recoveryType: 'test recovery', step: '', publicIP: '35.184.228.249', status: 'completed', failureMessage: '' }];
const recoveredJobResp3 = [{ id: 2, vmName: 'prod-ubuntu-16-04', startTime: 1625630135, endTime: 1620226610, recoveryType: 'full recovery', step: '', publicIP: '34.72.233.246', status: '' }];
const jobReplicationResp = withoutErrorResponse(API_REPLICATION_JOBS, replicationJobResp);
const jobRecoveryResp = withoutErrorResponse(API_RECOVERY_JOBS, recoveredJobResp);
const jobRecoveryResp2 = withoutErrorResponse(API_RECOVERY_JOBS, recoveredJobResp2);
const jobRecoveryResp3 = withoutErrorResponse(API_RECOVERY_JOBS, recoveredJobResp3);
const jobApiMockErrorResponse = withErrorResponse(API_REPLICATION_JOBS);
const handlers = [jobApiMockErrorResponse, jobRecoveryResp, jobRecoveryResp2, jobRecoveryResp3, jobReplicationResp];
const server = new setupServer(...handlers);
describe('DashboardJob : Dashboard Job tests', () => {
  beforeAll(() => server.listen());
  afterEach(() => server.resetHandlers());
  afterAll(() => server.close());
  it('should render without error', async () => {
    renderWitRedux(<DashboardJob />);
    const div = await document.getElementsByClassName('font-weight-medium color-white');
    expect(div.length).toBe(1);
  });
  it('should render data with response as started and failed', async () => {
    renderWitRedux(<DashboardJob />);
    const divWithClass = await document.getElementsByClassName('bx app_primary bxs-right-arrow-circle bx-fade-right font-size-14');
    const text = await screen.findByText('Jobs');
    const text2 = await screen.findByText('Recovery for prod-ubuntu-16-04 is started.');
    expect(divWithClass.length).toBe(1);
    expect(text).toBeInTheDocument();
    expect(text2).toBeInTheDocument();
  });
  it('should render data with response as completed and running', async () => {
    server.use(jobRecoveryResp2);
    renderWitRedux(<DashboardJob />);
    const divWithClass = await document.getElementsByClassName('bx app_success bxs-check-circle font-size-14');
    const text = await screen.findByText('Jobs');
    const text2 = await screen.findByText('Recovery for prod-ubuntu-16-04 is completed.');
    expect(divWithClass.length).toBe(1);
    expect(text).toBeInTheDocument();
    expect(text2).toBeInTheDocument();
  });
});
