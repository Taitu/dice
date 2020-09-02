import { combineReducers } from 'redux';
import betsReducer from './betsReducer';

export default combineReducers({
  bets: betsReducer
})