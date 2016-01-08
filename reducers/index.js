import { combineReducers } from 'redux';
import todos from './todos';
import data from './data';
import user from './user';

const rootReducer = combineReducers({
  // todos,
  user,
  data
})

export default rootReducer
