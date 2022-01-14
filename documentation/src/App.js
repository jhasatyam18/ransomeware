import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import Alerts from './pages/alerts';
import Architecture from './pages/architecture';
import Authentication from './pages/authentication';
import Capabilities from './pages/capabilities';
import CreateAwsSite from './pages/createawssite';
import CreateGcpSite from './pages/creategcpsite';
import Createvmwaresite from './pages/createvmwaresite';
import Dashboard from './pages/dashboard';
import Email from './pages/email';
import Events from './pages/events';
import FullRecovery from './pages/fullrecovery';
import Introduction from './pages/introduction';
import License from './pages/license';
import Migration from './pages/migration';
import Nodeactions from './pages/nodeactions';
import Nodes from './pages/nodes';
import ProtectionActions from './pages/protectionactions';
import ProtectionPlan from './pages/protectionplan';
import RecoveryJobs from './pages/recoveryJobs';
import ReplicationJobs from './pages/replicationJobs';
import Reports from './pages/reports';
import Roles from './pages/roles';
import SupportBundle from './pages/sb';
import SideBar from './pages/SideBar';
import SiteActions from './pages/siteactions';
import SupportMatrix from './pages/supportmatrix';
import TestRecovery from './pages/testrecovery';
import Throttling from './pages/throttling';
import Troubleshooting from './pages/troubleshooting';
import Users from './pages/users';


function App() {
  return (
    <div className="App">
      <BrowserRouter basename="/docs">
        <div className="wrapper">
          <div className="sidebar">
            <SideBar />
          </div>
          <div className="content">
            <Routes>
              <Route path="/" element={<Introduction />} />
              <Route path="/introduction" element={<Introduction />} />
              <Route path="/architecture" element={<Architecture />} />
              <Route path="/capabilities" element={<Capabilities />} />
              <Route path="/supportmatrix" element={<SupportMatrix />} />
              <Route path="/authentication" element={<Authentication />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/nodes" element={<Nodes />} />
              <Route path="/nodeactions" element={<Nodeactions />} />
              <Route path="/createvmwaresite" element={<Createvmwaresite />} />
              <Route path="/createawssite" element={<CreateAwsSite />} />
              <Route path="/creategcpsite" element={<CreateGcpSite />} />
              <Route path="/siteactions" element={<SiteActions />} />
              <Route path="/protectionplan" element={<ProtectionPlan />} />
              <Route path="/protectionactions" element={<ProtectionActions />} />
              <Route path="/testrecovery" element={<TestRecovery />} />
              <Route path="/fullrecovery" element={<FullRecovery />} />
              <Route path="/migration" element={<Migration />} />
              <Route path="/replicationJobs" element={<ReplicationJobs />} />
              <Route path="/recoveryJobs" element={<RecoveryJobs />} />
              <Route path="/events" element={<Events />} />
              <Route path="/alerts" element={<Alerts />} />
              <Route path="/reports" element={<Reports />} />
              <Route path="/license" element={<License />} />
              <Route path="/email" element={<Email />} />
              <Route path="/throttling" element={<Throttling />} />
              <Route path="/sb" element={<SupportBundle />} />
              <Route path="/troubleshooting" element={<Troubleshooting />} />
              <Route path="/users" element={<Users />} />
              <Route path="/users" element={<Users />} />
              <Route path="/roles" element={<Roles />} />
            </Routes>
          </div>
        </div>
      </BrowserRouter>
    </div>


  );
}

export default App;
