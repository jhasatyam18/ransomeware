import React from 'react';
import * as reactRedux from 'react-redux';
import { cleanup, screen } from '@testing-library/react';
import { setupServer } from 'msw/node';
import DashboardEvents from '../../../components/Dashboard/DashboardEvents';
import { API_FETCH_EVENTS } from '../../../constants/ApiConstants';
import renderWitRedux from '../../tetsUtils/RenderWithRedux';
import { withoutErrorResponse, withErrorResponse } from '../../tetsUtils/server';
// server setups
const respWithoutError = { records: [{ affectedObject: 'ProtectionPlan', description: 'Protection Plan stopped successfully', generator: 'Administrator', id: 36, severity: 'INFO', topic: 'ProtectionPlan' }], totalPages: 1, totalRecords: 36 };
const respWithError = { recor: [{ affectedObject: 'ProtectionPlan', description: 'Protection Plan stopped successfully', generator: 'Administrator', id: 36, severity: 'INFO', topic: 'ProtectionPlan' }], totalPages: 1, totalRecords: 36 };
const eventResponsewithLevelWarning = withoutErrorResponse(API_FETCH_EVENTS, respWithoutError);
const eventResponsewitherror = withoutErrorResponse(API_FETCH_EVENTS, respWithError);
const eventAPIErrorResponse = withErrorResponse(API_FETCH_EVENTS);
const handlers = [eventResponsewithLevelWarning, eventAPIErrorResponse, eventResponsewitherror];
const server = new setupServer(...handlers);

describe('dashboardEvents.test.js : Dashboard Events Tests', () => {
  beforeAll(() => server.listen());
  afterEach(() => server.resetHandlers());
  afterAll(() => server.close());
  afterEach(cleanup);
  it('DashboardEvent: there must be a div with different classname when response.level is their', async () => {
    renderWitRedux(<DashboardEvents />);
    const divs = await document.getElementsByClassName('bx app_success bxs-check-circle font-size-14');
    const text = await screen.findByText('Protection Plan stopped successfully');
    expect(text).toBeInTheDocument();
    expect(divs.length).toBe(1);
  });
  it('Should show renderNoDataToShow component when their is error from the server', async () => {
    server.use(eventResponsewitherror);
    renderWitRedux(<DashboardEvents />);
    const div = await document.getElementsByClassName('font-weight-medium color-white');
    const text = await screen.findByText('No Data To Display');
    expect(div.length).toBe(1);
    expect(text).toBeInTheDocument();
  });
});
