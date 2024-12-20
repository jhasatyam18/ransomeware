import { combineReducers } from 'redux';
import global from './reducers/Global';
// Front
import layout from './reducers/Layout';
import messages from './reducers/MessageReducer';
import upgrade from './reducers/UpgradeReducer';
import user from './reducers/UserReducer';
import modal from './reducers/ModalReducer';

const rootReducer = combineReducers({
    layout,
    user,
    messages,
    global,
    upgrade,
    modal,
});

export default rootReducer;
