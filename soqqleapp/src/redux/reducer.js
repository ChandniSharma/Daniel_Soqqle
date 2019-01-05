import {Map, fromJS} from 'immutable';
import {loop, combineReducers} from 'redux-loop-symbol-ponyfill';
import NavigatorStateReducer from '../navigator/NavigatorState';
import UserReducer from '../reducers/UserReducer';
import CompanyReducer from '../reducers/CompanyReducer';
import AppReducer from '../reducers/AppReducer';
import SessionStateReducer, {RESET_STATE} from '../session/SessionState';

const reducers = {
  user: UserReducer,
  company: CompanyReducer,
  app: AppReducer,
  navigatorState: NavigatorStateReducer,
  session: SessionStateReducer
};
const immutableStateContainer = Map();
const getImmutable = (child, key) => child ? child.get(key) : void 0;
const setImmutable = (child, key, value) => child.set(key, value);

const namespacedReducer = combineReducers(
  reducers,
  immutableStateContainer,
  getImmutable,
  setImmutable
);

export default function mainReducer(state, action) {
  const [nextState, effects] = action.type === RESET_STATE
    ? namespacedReducer(action.payload, action)
    : namespacedReducer(state || void 0, action);
  return loop(fromJS(nextState), effects);
}
