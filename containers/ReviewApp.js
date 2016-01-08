import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import MainSection from '../components/MainSection'
import _ from 'lodash'

class ReviewApp extends Component {

  render() {
    const {isAuthenticated } = this.props
    return (
      <div>
        <MainSection isAuthenticated={isAuthenticated}/>
      </div>
    );
  }
}

import {groupSelector, itemsSelector} from '../selectors'

function mapState(state) {
  return {
    isAuthenticated: true//state.user.get('isAuthenticated')
  }
}

function mapDispatch(dispatch) {
  return {
  }
}

export default connect(mapState, null)(ReviewApp)
