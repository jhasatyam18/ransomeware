import React from 'react';
import { screen } from '@testing-library/react';
import { setupServer } from 'msw/node';
import { API_DASHBOARD_TITLE, API_NODES } from '../../../constants/ApiConstants';
import renderWitRedux from '../../tetsUtils/RenderWithRedux';
import DashbooardsTitles from '../../../components/Dashboard/DashboardTitles';
import { withoutErrorResponse, withErrorResponse } from '../../tetsUtils/server';

const titleResp = [{ id: 165, protectionPlanID: 7, vmName: 'pr-ubuntu-18-04', diskId: 2000, previousChangeId: '52 7a ec 9c af 38 7d c5-28 fc 8a 22 ee 95 ee d8/3503', changedSize: 0, transferSize: 0, startTime: 1620207855, endTime: 1620207861, status: 'completed', failureMessage: '' }, { id: 164, protectionPlanID: 6, vmName: 'prod-win-2016-demo-207', diskId: 2000, previousChangeId: '52 3e 6a 48 26 9e 80 87-80 82 f2 81 2e 17 37 fb/3903', changedSize: 0, transferSize: 0, startTime: 1620207850, endTime: 1620207852, status: 'completed', failureMessage: '' }];
const node = [{ id: 165, protectionPlanID: 7, vmName: 'pr-ubuntu-18-04', diskId: 2000, previousChangeId: '52 7a ec 9c af 38 7d c5-28 fc 8a 22 ee 95 ee d8/3503', changedSize: 0, transferSize: 0, startTime: 1620207855, endTime: 1620207861, status: 'completed', failureMessage: '' }, { id: 164, protectionPlanID: 6, vmName: 'prod-win-2016-demo-207', diskId: 2000, previousChangeId: '52 3e 6a 48 26 9e 80 87-80 82 f2 81 2e 17 37 fb/3903', changedSize: 0, transferSize: 0, startTime: 1620207850, endTime: 1620207852, status: 'completed', failureMessage: '' }];
const titleRespHandler = withoutErrorResponse(API_DASHBOARD_TITLE, titleResp);
const nodeRespHandler = withoutErrorResponse(API_NODES, node);
const nodeRespHandler1 = withErrorResponse(API_DASHBOARD_TITLE);

const handlers = [titleRespHandler, nodeRespHandler, nodeRespHandler1];
// ;message__notification__container
const server = new setupServer(...handlers);

describe('DashboardJob : Dashboard Job tests', () => {
  beforeAll(() => server.listen());
  afterEach(() => server.resetHandlers());
  afterAll(() => server.close());

  it('should render without error', async () => {
    renderWitRedux(<DashbooardsTitles />);
    const div = await document.getElementsByClassName('mini-stats-wid');
    expect(div.length).toBe(4);
  });

  it('should render without', async () => {
    server.use(nodeRespHandler1);
    renderWitRedux(<DashbooardsTitles />);
    const div = await document.getElementsByClassName('mini-stats-wid');
    expect(div.length).toBe(4);
  });
});
