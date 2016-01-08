import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import _ from 'lodash'

import SplitPane from './split-pane'
import GroupByTree from './GroupByTree'
import GroupByControl from './GroupByControl'
import Items from './Items'

export default class DataExplorer extends Component {

  render(){
    return this.renderBoth()
  }

  renderBoth(){
    return <SplitPane split="vertical" minSize="300" defaultSize="700">
      <div>
        { this.renderTree() }
      </div>
      <div>
        <Items/>
      </div>
    </SplitPane>
  }

  renderTree(){
    return <SplitPane split="vertical" minSize="150" defaultSize="150">
          <div>
            <GroupByControl/>
          </div>
          <div>
            <GroupByTree/>
          </div>
        </SplitPane>
  }
}

import {pathSelector} from '../selectors'
import * as DataActions from '../actions/DataActions'

function mapState(state) {
  return {
    path: pathSelector(state)
  }
}

function mapDispatch(dispatch) {
  return bindActionCreators(DataActions, dispatch)
}
export default connect(mapState, mapDispatch)(DataExplorer)
