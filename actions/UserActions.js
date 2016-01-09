import * as types from '../constants/ActionTypes';
import _ from 'lodash'

import Fireproof from 'fireproof'
import Firebase from 'firebase'
const firebase = new Firebase('https://cucsgrads.firebaseio.com/')
const fireproof = new Fireproof(firebase)


function processAuth(auth, dispatch){
  fireproof
    .child('users')
    .child(auth.uid)
    .set(auth.google)
    .then(()=>{
      dispatch({type: types.USER_LOGIN, uid: auth.uid, displayName: auth.google.displayName})
    })
}

export function restore(){

  return (dispatch, getState) => {
    let auth = fireproof.getAuth()
    if (auth)
      processAuth(auth, dispatch)
  }
}

export function login(){

  return (dispatch, getState) => {

    fireproof
      .authWithOAuthPopup('google', null, {scope: "email"})
      .then((auth) => processAuth(auth, dispatch))
  }
}

export function logout(){
  return (dispatch, getState) => {
    fireproof.unauth()
    dispatch({type: types.USER_LOGOUT})
  }
}
