import {DATA_LOAD,
  DATA_ADD_GROUPBY,
  DATA_REMOVE_GROUPBY,
  DATA_SELECT_GROUP,
  DATA_COMMENTS_SET,
  DATA_SET_VIEW,
  COMMENT_ADD
} from '../constants/ActionTypes';
import Immutable from 'immutable'
import _ from 'lodash'

const FULL = [
  'EMPID',
  'LAST_NAME',
  'FIRST_NAME',
  'ADVISORS',
  // 'ADVISOR1',
  // 'ADVISOR2',
  // 'ADVISOR3',
  'AREAS',
  // 'AREA1',
  // 'AREA2',
  // 'AREA3',
  'MAJOR1',
  'GENDER',
  'COUNTRY',
  'CITY',
  'MAJOR1',
  'MAJOR1_SUB1_LD',
  'MAJOR_Q2',
  'PREF_EMAIL',
  // 'UGRD1_EXT_GPA',
  'UGRD1_EXT_ORG_DESCR',
  'GRE_1_SRC',
  'GRE_AW_1',
  'GRE_AW_1_PCT',
  'GRE_AW_1_SCORE',
  'GRE_QUAN_1',
  'GRE_QUAN_1_PCT',
  'GRE_QUAN_1_SCORE',
  'GRE_QUAN2_1',
  'GRE_QUAN2_1_PCT',
  'GRE_QUAN2_1_SCORE',
  'GRE_VERB2_1',
  'GRE_VERB2_1_PCT',
  'GRE_VERB2_1_SCORE',
  'GRE_VERB_1',
  'GRE_VERB_1_PCT',
  'GRE_VERB_1_SCORE',
  'CITIZENSHIP_COUNTRY'
]

const initialState = Immutable.fromJS({
  isLoading: false,
  items: [],
  clusters: {},
  groupBys: ['consequent'],
  projection: FULL,
  selected: {
    path: []
  },
  comments: {
  },
  view: 'COMPACT'
})

export default function data_reducer(state = initialState, action) {
  switch (action.type) {
  case DATA_LOAD:
    return state.set('items', action.data.items).set('clusters', action.data.clusters)

  case DATA_ADD_GROUPBY:
    if (!state.get('groupBys').includes(action.key)){
      return state.updateIn(['groupBys'], list => list.push(action.key))
    }
    return state

  case DATA_REMOVE_GROUPBY:
    let index = state.get('groupBys').findIndex(v => action.key == v)
    let newstate = state
    if (index >= 0){
      newstate = state.updateIn(['groupBys'], list => list.delete(index))
    }
    return newstate.set('selected', {path: []})
    // return state

  case DATA_SELECT_GROUP:
    return state.set('selected', {path: action.path})

  case DATA_SET_VIEW:
    return state.set('view', action.view)

  case DATA_COMMENTS_SET:
    return state.set('comments', Immutable.fromJS(action.comments))

  case COMMENT_ADD:
    let commentId = action.commentId
    return state.setIn(['comments', action.dataId, commentId], action.comment)

  default:
    return state;
  }
}
