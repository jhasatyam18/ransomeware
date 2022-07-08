import React from 'react';
import { cleanup, screen } from '@testing-library/react';
import { setupServer } from 'msw/node';
import NodeInfo from '../../../components/Dashboard/NodeInfo';
import renderWitRedux from '../../tetsUtils/RenderWithRedux';
import { withoutErrorResponse } from '../../tetsUtils/server';
import { API_DASHBOARD_NODE_STATS } from '../../../constants/ApiConstants';

const response = [{ name: 'DM-Mgmt-Node-PS', deployedOn: 'VMware', hostname: '198.244.129.75', vms: 1, status: 'online', type: 'Management', usage: 20971520 }];

const alertApiMockSuccessResponse = withoutErrorResponse(API_DASHBOARD_NODE_STATS, response);
const alertApiMockSuccessResponse1 = withoutErrorResponse(API_DASHBOARD_NODE_STATS, null);
// const alertApiMockErrorResponse = withErrorResponse(API_DASHBOARD_REPLICATION_STATS);
const handlers = [alertApiMockSuccessResponse, alertApiMockSuccessResponse1];
const server = new setupServer(...handlers);
describe('node info : nodeInfo tests', () => {
  beforeAll(() => server.listen());
  afterEach(() => server.resetHandlers());
  afterAll(() => server.close());
  afterEach(cleanup);
  it('should display response messages on the screen', async () => {
    renderWitRedux(<NodeInfo />);
    const divWithClass = await document.getElementsByClassName('font-size-12 badge-soft-success badge badge-success badge-pill');
    const text = await screen.findByText('online');
    expect(divWithClass.length).toBe(1);
    expect(text).toBeInTheDocument();
  });
});
