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


    var f1 = fetch('/static/data/allData.json')
      .then(res=>{
        return res.text()
      })
      .then(body=>{
          let data = JSON.parse(body)
          let rules = data.associationRules
          _.each(rules, (d,i) => {
            d.id = i
            d['strength'] = (Math.ceil(Number(d['ruleStrength']) / 0.01) * 0.01).toFixed(3)
            d['trend'] = d['isTrending']
            d['isTrending'] = _.any(d['isTrending'])
          })
          return rules
      })

    var f2 = fetch('/static/data/clusters.json')
           .then(res=>{
             return res.text()
           })
           .then(body=>{
              let data = JSON.parse(body)
              return data
           })

    Promise.all([f1,f2]).then(([items, clusters]) => {
      dispatch({type: types.DATA_LOAD, data: {items, clusters}})
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
