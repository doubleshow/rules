import * as types from '../constants/ActionTypes';
import csv from 'csv'
import _ from 'lodash'

import Fireproof from 'fireproof'
import Firebase from 'firebase'

require('es6-promise').polyfill()
require('isomorphic-fetch');

const firebase = new Firebase('https://cucsgrads.firebaseio.com/')
const fireproof = new Fireproof(firebase)

export function load() {

  return (dispatch, getState) => {

    // fireproof
    //   .child('comments')
    //   .then(snap => {
    //     console.log(snap.val())
    //     dispatch({type: types.DATA_COMMENTS_SET, comments: snap.val()})
    //   })
    //   .catch(err => {
    //     console.error(err)
    //   })

    fetch('/static/data/rules.json')
      .then(response=>{
        return response.text()
      }).then(body=>{

        // csv.parse(body, (err, data) =>{
        //   let fields = data[0]
        //   let values = _.rest(data)
        //   let jsonArray = _.map(values, v => {
        //     let o = _.zipObject(fields, v)
        //     let areas = _.map(o["INTEREST_AREAS"].split(/[;,]/),_.trim)
        //     o['AREA1'] = areas[0]
        //     o['AREA2'] = areas[1]
        //     o['AREA3'] = areas[2]
        //     o['AREAS'] = areas
        //     o['ADVISORS'] = [o['ADVISOR1'],o['ADVISOR2'],o['ADVISOR3']]
        //     o['GPA'] = Math.ceil(Number(o['UGRD1_EXT_GPA']) / 0.25) * 0.25
        //     return o
        //   })
          let data = JSON.parse(body)
          console.log(data)
          let rules = data.associationRules
          _.each(rules, (d,i) => {
            d.id = i
            d['strength'] = (Math.ceil(Number(d['ruleStrength']) / 0.01) * 0.01).toFixed(3)
          })
          dispatch({type: types.DATA_LOAD, items: rules})

      })
  }
}

export function addGroupBy(key){
  return {
    type: types.DATA_ADD_GROUPBY,
    key
  }
}

export function removeGroupBy(key){
  return {
    type: types.DATA_REMOVE_GROUPBY,
    key
  }
}

export function selectGroup(group){

  function pathToRoot(p){
    if (p.parent)
      return [...pathToRoot(p.parent), p]
    else
      return []
  }
  // const path = _.pluck(pathToRoot(group),'key')

  const path = _.map(pathToRoot(group), (g) => {
    return {key: g.key, field: g.parent.by}
  })

  return {
    type: types.DATA_SELECT_GROUP,
    path
  }
}

export function setView(view){
  return {type: types.DATA_SET_VIEW, view}
}
