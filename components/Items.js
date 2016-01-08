import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import React, { Component, PropTypes } from 'react';

import _ from 'lodash'

// import SplitPane from 'react-split-pane'
import SplitPane from './split-pane'
import ItemComments from './ItemComments'
import SelectView from './SelectView'

const Toolbar = require('material-ui/lib/toolbar/toolbar');
const ToolbarGroup = require('material-ui/lib/toolbar/toolbar-group');
const ToolbarSeparator = require('material-ui/lib/toolbar/toolbar-separator');
const ToolbarTitle = require('material-ui/lib/toolbar/toolbar-title');
const DropDownMenu = require('material-ui/lib/drop-down-menu');


const Colors = require('material-ui/lib/styles/colors');

const ChartistGraph = require('react-chartist')

class Items extends Component {
  static propTypes = {
    items: PropTypes.array.isRequired,
    projection: PropTypes.array.isRequired
  }

  renderItem(item,i){
    const {projection, items} = this.props
    const n = items.length
    const {id, comments} = item

    function renderValue(v){
      if (_.isArray(v))
        return _.map(v, (vi,i) => <div key={i} className="chip" style={{margin:2}}>{vi}</div>)
      else {
        return v
      }
    }

    return <div className="collection-item item" key={i}>
      <div className='no'>{i+1} of {n}</div>
      <div>
        {_.map(projection, (k,i) => {
          return <div className="row" key={i}>
            <div className="col s4">
              <a href="#" onClick={()=>this.addGroupBy(k)}>{k}</a>
            </div>
            <div className="col s8">
              {renderValue(item.data[k])}
            </div>
          </div>
        })}
      </div>
    </div>
  }

  renderDownload(item){
    const ROOT = 'http://secret-cdcnjvankjsdjqwe.grad.review.s3-website-us-east-1.amazonaws.com/2016/cs/pdfs'
    return <div><a href={`${ROOT}/${item.id}-all.pdf`} target='_blank'>PDF</a></div>
  }

  renderItemCompact(item,i){
    const {projection, items} = this.props
    const n = items.length
    const {id, comments} = item

    const {consequent, antecedents, ruleStrength, matchingRepoIDs, violatingRepoIDs} = item.data

    const ant = (x,i) => x ? <span className="chip indigo lighten-4" style={{margin:2}}>{x}</span> : ''
    const cons = (x,k) => x ? <span key={k} className="chip green lighten-4" style={{margin:2}}>{x}</span> : ''
    const v = (x,c) => <span style={{color:c, fontWeight:'bold'}}>{x}</span>

    // console.log(item.data)

    return <div className="card item" key={i}>
      <div className="card-content">
        <div className='no'>{i+1} of {n}</div>
          <div className="col s7">
            Strength: {v(ruleStrength.toFixed(6))} <br/>
            Matches/Violating: {v(matchingRepoIDs.length, 'green')} / {v(violatingRepoIDs.length, 'red')}
            <div className="row card-panel">
              <div className="col s8">
                Antecedents<br/>
                {_.map(antecedents, (a) => {return ant(a)})}
              </div>
              <div className="col s4">
                Consequent<br/>
                {cons(consequent)}
              </div>
            </div>
            {this.renderChart(item.data)}
          </div>
        </div>
      </div>
  }

  renderChart(data){
    const labels = data.dateLabels
    const series = [data.matchesOverTime]
    const chartData = {
      labels,
      series
    }
    const options = {
      // horizontalBars: falsetrue,
      // seriesBarDistance: 2,
      // reverseData: true
      axisX: {
        offset: 0
      }
    }
    const height = 100//40*labels.length
    return <div style={{height}}>
      <ChartistGraph data={chartData} type={'Line'} options={options}/>
    </div>
  }

  render(){

    return <div style={{padding:10}}>
        <SplitPane
        split="horizontal"
        minSize="50"
        defaultSize="80"
        resizable={false}>
        <div>
        </div>
        <div>
          {this.renderCollection()}
        </div>
      </SplitPane>
      <div style={{zIndex:5000, position: 'absolute', width: '100%', height:100}}>
        {this.renderHeader()}
      </div>
    </div>
  }

  renderCollection(){
    const {items,view} = this.props
    return <div style={{width: '90%', padding: 5}}>
        {
          _.map(items, (item,i) => {
            return view === 'COMPACT'
              ? this.renderItemCompact(item,i)
              : this.renderItem(item,i)
          })
        }
    </div>
  }

  renderHeader(){
    const {items, path} = this.props

    return <div className="row">

      <div className="col s8">
        {`${items.length} association rules `}

        {_.map(path, (p,i) => {
          return <div href="#" key={i} className="chip" style={{margin:2}}>
            {p.field} = {p.key}
          </div>
        })}
      </div>

    </div>
  }
}

import {itemsSelector, viewSelector, pathSelector} from '../selectors'
import * as DataActions from '../actions/DataActions'

function mapState(state) {
  return {
    items: itemsSelector(state),
    projection: state.data.get('projection').toArray(),
    view: viewSelector(state),
    path: pathSelector(state)
  }
}

function mapDispatch(dispatch) {
  return bindActionCreators(DataActions, dispatch)
}
export default connect(mapState, mapDispatch)(Items)
