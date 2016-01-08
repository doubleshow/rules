import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

const TextField = require('material-ui/lib/text-field')
const RaisedButton = require('material-ui/lib/raised-button')

const List = require('material-ui/lib/lists/list')
const ListDivider = require('material-ui/lib/lists/list-divider')
const ListItem = require('material-ui/lib/lists/list-item')

export default class User extends Component {

  static propTypes = {
    login: PropTypes.func.isRequired,
    logout: PropTypes.func.isRequired,
    isAuthenticated: PropTypes.bool.isRequired
  }

  render(){
    const {isAuthenticated} = this.props
    if (isAuthenticated){
      return <div>
          <a href="#" onClick={()=>this.handleLogout()}>Logout</a>
        </div>
    } else {
      return <div>
        <a href="#" onClick={()=>this.handleLogin()}>Login via Google</a>
      </div>
    }
  }

  handleLogin(){
    this.props.login()
  }

  handleLogout(){
    this.props.logout()
  }

}


import * as UserActions from '../actions/UserActions'
function mapState(state) {
  return {
    isAuthenticated: state.user.get('isAuthenticated')
  }
}
function mapDispatch(dispatch) {
  return bindActionCreators(UserActions, dispatch)
}
export default connect(mapState, mapDispatch)(User)
