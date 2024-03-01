// import React from 'react';
// import { cleanup } from '@testing-library/react';
// import { setupServer } from 'msw/node';
// import ProtectedVsUnProtectedVMs from '../../../components/Dashboard/ProtectedVsUnProtectedVMs';
// import { API_DASHBOARD_VIRTUAL_MACHINE_PROTECTION_ANALYSIS_PROTECTED_VMS, API_DASHBOARD_REPLICATION_STATS } from '../../../constants/ApiConstants';
// import renderWitRedux from '../../tetsUtils/RenderWithRedux';
// import { withoutErrorResponse } from '../../tetsUtils/server';
// // API_RECOVERY_JOBS, withErrorResponse
// const vmAnalysisResp = [{ protectedVMs: 1, unprotectedVMs: 19 }];
// const replicationState = { changedRate: 3.1607142857142856, completed: 8, dataReduction: 59.31, failed: 2, inSync: 1, notInsync: 0, rpo: 600, running: 0 };
// const vmAnalysis = withoutErrorResponse(API_DASHBOARD_VIRTUAL_MACHINE_PROTECTION_ANALYSIS_PROTECTED_VMS, vmAnalysisResp);
// const replication = withoutErrorResponse(API_DASHBOARD_REPLICATION_STATS, replicationState);
// const handlers = [vmAnalysis, replication];
// const server = new setupServer(...handlers);
// describe('ProtectedVsUnProtectedVMs : Dashboard Job tests', () => {
//   beforeAll(() => server.listen());
//   afterEach(() => server.resetHandlers());
//   afterAll(() => server.close());
//   afterEach(cleanup);
//   it('should render without error', async () => {
//     renderWitRedux(<ProtectedVsUnProtectedVMs />);
//     const div = await document.getElementsByClassName('font-weight-medium color-white');
//     expect(div.length).toBe(1);
//   });
// });
