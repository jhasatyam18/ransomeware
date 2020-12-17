import { combineReducers } from 'redux';

// Front
import layout from './reducers/Layout';
import user from './reducers/UserReducer';
import messages from './reducers/MessageReducer';
import sites from './reducers/SitesReducer';
import modal from './reducers/ModalReducer';
import global from './reducers/Global';

const rootReducer = combineReducers({
  layout, user, messages, sites, modal, global,
});

export default rootReducer;
