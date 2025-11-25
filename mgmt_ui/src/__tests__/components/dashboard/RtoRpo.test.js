import React from 'react';
import { cleanup, screen } from '@testing-library/react';
import { setupServer } from 'msw/node';
import RtoRpo from '../../../components/Dashboard/RtoRpo';
import { API_DASHBOARD_RECOVERY_STATS, API_DASHBOARD_REPLICATION_STATS } from '../../../constants/ApiConstants';
import renderWitRedux from '../../tetsUtils/RenderWithRedux';
import { withoutErrorResponse } from '../../tetsUtils/server';

const response = { changedRate: 0, completed: 0, dataReduction: 0, failed: 190, inSync: 0, notInsync: 1, rpo: 900, running: 0 };
const response1 = { fullRecovery: 0, migrations: 0, rto: 0, testExecutions: 0 };
const alertApiMockSuccessResponse = withoutErrorResponse(API_DASHBOARD_RECOVERY_STATS, response);
const alertApiMockSuccessResponse1 = withoutErrorResponse(API_DASHBOARD_REPLICATION_STATS, response1);
// const alertApiMockErrorResponse = withErrorResponse(API_DASHBOARD_REPLICATION_STATS);
const handlers = [alertApiMockSuccessResponse, alertApiMockSuccessResponse1];
const server = new setupServer(...handlers);
describe('RtoRpo : RtoRpo tests', () => {
  beforeAll(() => server.listen());
  afterEach(() => server.resetHandlers());
  afterAll(() => server.close());
  afterEach(cleanup);
  it('should display response messages on the screen', async () => {
    renderWitRedux(<RtoRpo />);
    const divWithClass = await document.getElementsByClassName('dashboard_divider_right col');
    const text = await screen.findByText('Replication Statistics');
    expect(divWithClass.length).toBe(1);
    expect(text).toBeInTheDocument();
  });
});
