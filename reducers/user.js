import {
  USER_LOGIN,
  USER_LOGOUT
} from '../constants/ActionTypes';
import Immutable from 'immutable'
import _ from 'lodash'

const initialState = Immutable.fromJS({
  isAuthenticated: false
})

export default function user(state = initialState, action) {
  switch (action.type) {
  case USER_LOGIN:
    let newstate = state
    newstate = newstate.set('uid', action.uid)
    newstate = newstate.set('displayName', action.displayName)
    newstate = newstate.set('isAuthenticated', true)
    return newstate

  case USER_LOGOUT:
    return initialState

  default:
    return state;
  }
}
