import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import React, { Component, PropTypes } from 'react';

import _ from 'lodash'

import SelectField from 'material-ui/lib/select-field'

const Toolbar = require('material-ui/lib/toolbar/toolbar');
const ToolbarGroup = require('material-ui/lib/toolbar/toolbar-group');
const ToolbarSeparator = require('material-ui/lib/toolbar/toolbar-separator');
const ToolbarTitle = require('material-ui/lib/toolbar/toolbar-title');
const DropDownMenu = require('material-ui/lib/drop-down-menu');

let injectTapEventPlugin = require("react-tap-event-plugin")

//Needed for onTouchTap
//Can go away when react 1.0 release
//Check this repo:
//https://github.com/zilverline/react-tap-event-plugin
injectTapEventPlugin();


let menuItems = [
  { payload: 'COMPACT', text: 'Compact View'},
  { payload: 'FULL', text: 'Full View' }
]

class SelectView extends Component {

  render(){
    const {view} = this.props
    return <DropDownMenu
      value={view}
      onChange={::this.handleChange}
      menuItems={menuItems}/>
  }

  handleChange(event){
    this.props.setView(event.target.value)
  }
}

import {viewSelector} from '../selectors'
import * as DataActions from '../actions/DataActions'

function mapState(state) {
  return {view: viewSelector(state)}
}

function mapDispatch(dispatch) {
  return bindActionCreators(DataActions, dispatch)
}
export default connect(mapState, mapDispatch)(SelectView)
