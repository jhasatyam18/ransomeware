import React, { Component } from 'react';
import { Route, Routes } from 'react-router-dom';
import ReportScheduleCreate from './ReportScheduleCreate';

const Report = React.lazy(() => import('./Report'));

class ReportIndex extends Component {
  render() {
    return (
      <Routes>
        <Route path="reportSchedule/:id?" element={<ReportScheduleCreate />} />
        <Route path="" element={<Report />} />
        <Route path="*" element={<Report />} />
      </Routes>
    );
  }
}

export default ReportIndex;
