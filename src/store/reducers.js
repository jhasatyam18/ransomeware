import { combineReducers } from 'redux';

// Front
import layout from './reducers/Layout';
import user from './reducers/UserReducer';
import messages from './reducers/MessageReducer';
import sites from './reducers/SitesReducer';
import modal from './reducers/ModalReducer';
import global from './reducers/Global';
import wizard from './reducers/WizardReducer';
import drPlans from './reducers/DrPlanReducer';
import jobs from './reducers/JobReducer';

const rootReducer = combineReducers({
  layout, user, messages, sites, modal, global, wizard, drPlans, jobs,
});

export default rootReducer;
