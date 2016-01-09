import * as types from '../constants/ActionTypes';
import _ from 'lodash'

import Fireproof from 'fireproof'
import Firebase from 'firebase'
const firebase = new Firebase('https://cucsgrads.firebaseio.com/')
const fireproof = new Fireproof(firebase)

export function addComment(dataId, text) {

  return (dispatch, getState) => {

    const {user} = getState()
    if (user.get('isAuthenticated')){

      let uid = user.get('uid')
      let displayName = user.get('displayName')

      let comment = {
        owner: {
          uid,
          displayName
        },
        createdAt: Firebase.ServerValue.TIMESTAMP,
        text
      }

      let ref = fireproof.child('comments').child(dataId).push()
      // console.log(ref.key())

      ref.set(comment)
        .then(() => ref.once('value'))
        .then(snap => {
          dispatch({
            type: types.COMMENT_ADD,
            dataId,
            commentId: ref.key(),
            comment: snap.val()
          })
        })

    }
  }
}
