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

class Item extends Component {

  constructor(props) {
    super(props);
    this.state = {
      open: false,
    }
  }

  renderChart(data){
    const labels = _.map(data.dateLabels, (label, i) => {
        if (i % 4 == 0 || i === data.dateLabels.length - 1){
          let m = label.match(/(\d*?)\//)[1]
          let y = label.match(/\/(\d*?)\"$/)[1]
          return m + '<br/>' + y
        } else {
          return ' '
        }
    })
    const series = [data.matchesOverTime]
    const chartData = {
      labels,
      series
    }
    const options = {
      // horizontalBars: falsetrue,
      // seriesBarDistance: 2,
      // reverseData: true
      labels,
      axisX: {
        offset: 20
      }
    }
    const height = 300//40*labels.length
    return <div style={{height}}>
      <ChartistGraph data={chartData} type={'Line'} options={options}/>
    </div>
  }

  onMethodClick(method){
    this.setState({open:'true', method: method})
  }

  renderMethod(){
    if (this.state.open){
      const {C} = this.props
      let methodName = this.state.method
      let members, cluster_id = -1, cluster_size
      if (C.methods[this.state.method]){

        cluster_id = C.methods[this.state.method].cluster_id
        members = C.clusters[cluster_id]
        cluster_size = members.length

        let weight = C.methods[this.state.method].weight
        // members = _.filter(members, (m) => {return m.method.length > 0 && m.weight >= weight * 0.5})
         members = _.filter(members, (m) => {return m.method.length > 0})
         members = _.sortBy(members, 'weight').reverse()

      } else {
        members = []
      }

      return <div className="card" style={{marginTop: 80}}>
        <div className="card-content">
          <b>{methodName}</b>
          { cluster_id >= 0 ? ` is in cluster (id=${cluster_id}, size=${cluster_size})` : ' is not in any cluster' }
          <br/>
          { members.length > 0 ?
              <div>
                  {_.map(_.take(members,20), (m,i) => {
                      if (m.method === methodName)
                        return <div className="chip red" key={i}>{m.method}</div>
                      else
                        return <div className="chip" key={i}>{m.method}</div>
                  })}
                <span></span>
              </div>
            : ''
          }
        </div>
      </div>
    } else {
      return ''
    }
  }

  render(){
    const {item,i,n,C} = this.props
    const {id, comments} = item
    const {consequent, antecedents, ruleStrength, matchingRepoIDs, violatingRepoIDs, isTrending} = item.data

    const ant = (x,i) => x ? <span className="chip indigo lighten-4"
          style={{margin:2, cursor:'pointer'}}
          onClick={()=>this.onMethodClick(x)}>
          {x}
        </span> : ''

    const cons = (x,k) => x ? <span key={k} className="chip green lighten-4"
          onClick={()=>this.onMethodClick(x)}
          style={{margin:2, cursor:'pointer'}}>{x}
        </span> : ''
    const v = (x,c) => <span style={{color:c, fontWeight:'bold'}}>{x}</span>
    return <div className="card item" key={i}>
      <div className="card-content">
        <div className='no'>{i+1} of {n}</div>
          <div className="col s7">
            { isTrending ? <div className="chip yellow">Trending<br/></div> : ''}
            <div>
            Strength: {v(ruleStrength.toFixed(6))} <br/>
            Matches/Violating: {v(matchingRepoIDs.length, 'green')} / {v(violatingRepoIDs.length, 'red')}
            </div>
            <div className="row card-panel">
              <div className="col s8">
                Antecedents<br/>
                {_.map(antecedents, (a) => {return ant(a)})}
              </div>
              <div className="col s4">
                Consequent<br/>
                {cons(consequent)}
              </div>
              { this.renderMethod()}
            </div>
            {this.renderChart(item.data)}
          </div>
        </div>
      </div>
  }
}

class Items extends Component {
  static propTypes = {
    items: PropTypes.array.isRequired,
    projection: PropTypes.array.isRequired
  }

  renderItem(item,i){
    const {projection, items, C} = this.props
    const n = items.length
    return <Item item={item} i={i} n={items.length} C={C} key={i}/>
  }

  renderDownload(item){
    const ROOT = 'http://secret-cdcnjvankjsdjqwe.grad.review.s3-website-us-east-1.amazonaws.com/2016/cs/pdfs'
    return <div><a href={`${ROOT}/${item.id}-all.pdf`} target='_blank'>PDF</a></div>
  }

  renderItemCompact(item,i){
    const {projection, items, C} = this.props
    const n = items.length
    return <Item item={item} i={i} n={items.length} C={C}/>
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
          _.map(_.take(items,50), (item,i) => {
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

import {itemsSelector, viewSelector, pathSelector, clustersSelector} from '../selectors'
import * as DataActions from '../actions/DataActions'

function mapState(state) {
  return {
    items: itemsSelector(state),
    projection: state.data.get('projection').toArray(),
    view: viewSelector(state),
    path: pathSelector(state),
    C: clustersSelector(state)
  }
}

function mapDispatch(dispatch) {
  return bindActionCreators(DataActions, dispatch)
}
export default connect(mapState, mapDispatch)(Items)
