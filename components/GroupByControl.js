import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import _ from 'lodash'

export class GroupByControl extends Component {
  static propTypes = {
    addGroupBy: PropTypes.func.isRequired
  }

  renderFields(){
    const fields = ['consequent', 'antecedents', 'strength', 'isTrending']
    const {addGroupBy} = this.props
    return _.map(fields, f => {
      return <div key={f} className="chip" style={{margin:2}}><a href="#" onClick={()=>addGroupBy(f)}>{f}</a></div>
    })
  }

  render(){
    return <div>
      <div style={{width:'95%', padding: 5}}>
        group by<br></br>
        {this.renderFields()}
      </div>
    </div>
  }
}

import {groupByTreeSelector} from '../selectors'
import * as DataActions from '../actions/DataActions'

function mapState(state) {
  return {
    tree: groupByTreeSelector(state)
  }
}

function mapDispatch(dispatch) {
  return bindActionCreators(DataActions, dispatch)
}
export default connect(mapState, mapDispatch)(GroupByControl)
