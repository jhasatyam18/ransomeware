import React from 'react';
import { cleanup, screen } from '@testing-library/react';
import { setupServer } from 'msw/node';
import DashboardAlertOverview from '../../../components/Dashboard/DashboardAlertOverview';
import { API_DASHBOARD_UNACK_ALERTS } from '../../../constants/ApiConstants';
import renderWitRedux from '../../tetsUtils/RenderWithRedux';
import { withoutErrorResponse, withErrorResponse } from '../../tetsUtils/server';

const response = { criticalAlerts: 0, errorAlerts: 12, majorAlerts: 9 };
const alertApiMockSuccessResponse = withoutErrorResponse(API_DASHBOARD_UNACK_ALERTS, response);
const alertApiMockErrorResponse = withErrorResponse(API_DASHBOARD_UNACK_ALERTS);
const handlers = [alertApiMockSuccessResponse, alertApiMockErrorResponse];
const server = new setupServer(...handlers);
describe('DashboardAlertOverview : Dashboard alrts tests', () => {
  beforeAll(() => server.listen());
  afterEach(() => server.resetHandlers());
  afterAll(() => server.close());
  afterEach(cleanup);
  it('should render without error', async () => {
    renderWitRedux(<DashboardAlertOverview />);
    const div = await document.getElementsByClassName('font-weight-medium text-muted');
    expect(div.length).toBe(1);
  });
  it('should display response messages on the screen', async () => {
    renderWitRedux(<DashboardAlertOverview />);
    const text = await screen.findByText('12');
    const text2 = await screen.findByText('9');
    expect(text).toBeInTheDocument();
    expect(text2).toBeInTheDocument();
  });
});
