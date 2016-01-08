import React, { Component, PropTypes } from 'react';
import _ from 'lodash'

import SplitPane from './split-pane'
import User from './User'
import DataExplorer from './DataExplorer'

export default class MainSection extends Component {
 static propTypes = {
    isAuthenticated: PropTypes.bool.isRequired
  }

  renderHeader(){
    return <nav>
    <div className="nav-wrapper  blue darken-4">
      <span className="brand-logo" style={{paddingLeft: 10}}> DARPA MUSE - Fixr Association Rule Mining - University of Colorado Boulder</span>
      <ul className="right">
        <li><User/></li>
      </ul>
    </div>
  </nav>
  }

  render() {
    const {isAuthenticated } = this.props
    return <SplitPane split="horizontal" minSize="64" defaultSize="64">
       <div>
         {this.renderHeader()}
       </div>
       <div>
         {isAuthenticated ? this.renderProtected() : ''}
       </div>
    </SplitPane>
  }

  renderProtected(){
    return <DataExplorer/>
  }
}
