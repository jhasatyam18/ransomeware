import React from 'react';
import { screen, cleanup } from '@testing-library/react';
import { setupServer } from 'msw/node';
import DashboardJob from '../../../components/Dashboard/DashboardJob';
import { API_REPLICATION_JOBS, API_RECOVERY_JOBS } from '../../../constants/ApiConstants';
import renderWitRedux from '../../tetsUtils/RenderWithRedux';
import { withoutErrorResponse } from '../../tetsUtils/server';
// API_RECOVERY_JOBS, withErrorResponse
const replicationJobResp = { records: [{ id: 165, protectionPlanID: 7, vmName: 'pr-ubuntu-18-04', diskId: 2000, previousChangeId: '52 7a ec 9c af 38 7d c5-28 fc 8a 22 ee 95 ee d8/3503', changedSize: 0, transferSize: 0, startTime: 1620207855, endTime: 1620207861, status: 'completed', failureMessage: '' }] };
const recoveredJobResp = { currentOffset: 0, currentPage: 1, hasNext: false, hasPrev: false, limit: 100, nextOffset: 0, pageRecords: 0, records: [], totalPages: 1, totalRecords: 0 };
const jobReplicationResp = withoutErrorResponse(API_REPLICATION_JOBS, replicationJobResp);
const jobRecoveryResp = withoutErrorResponse(API_RECOVERY_JOBS, recoveredJobResp);
const jobRecoveryResp1 = withoutErrorResponse(API_REPLICATION_JOBS, recoveredJobResp);
const handlers = [jobRecoveryResp, jobReplicationResp, jobRecoveryResp1];
const server = new setupServer(...handlers);
describe('DashboardJob : Dashboard Job tests', () => {
  beforeAll(() => server.listen());
  afterEach(() => server.resetHandlers());
  afterAll(() => server.close());
  afterEach(cleanup);
  it('should render without error', async () => {
    renderWitRedux(<DashboardJob />);
    const div = await document.getElementsByClassName('font-weight-medium color-white');
    expect(div.length).toBe(1);
  });

  it('should render with responsed data', async () => {
    renderWitRedux(<DashboardJob />);
    const divWithClass = await document.getElementsByClassName('font-weight-medium color-white');
    const text = await screen.findByText('Replication for pr-ubuntu-18-04 is completed.');
    expect(divWithClass.length).toBe(1);
    expect(text).toBeInTheDocument();
  });

  it('should render with responsed data', async () => {
    server.use(jobRecoveryResp);
    server.use(jobRecoveryResp1);
    renderWitRedux(<DashboardJob />);
    const divWithClass = await document.getElementsByClassName('font-weight-medium color-white');
    const text = await screen.findByText('No Data To Display');
    expect(divWithClass.length).toBe(1);
    expect(text).toBeInTheDocument();
  });
});
