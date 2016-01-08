import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import _ from 'lodash'

let ChartistGraph = require('react-chartist')

export class GroupByTree extends Component {
  static propTypes = {
    tree: PropTypes.object.isRequired
  }

  addGroupBy(key){
    this.props.actions.addGroupBy(key)
  }

  removeGroupBy(key){
    this.props.actions.removeGroupBy(key)
  }

  selectGroup(group){
    this.props.actions.selectGroup(group)
  }

  render(){
    const {root, levels} = this.props.tree
    return <div style={{paddingLeft:10}}>
        {this.renderGroup(root, 'all', levels)}
      </div>
  }

  renderBarchart(groups){
    // const sortedGroups = _.sortBy(groups, 'key')
    const labels = _.pluck(groups, 'key')
    const series = [_.pluck(groups, 'count')]
    const chartData = {
      labels,
      series
    }
    const options = {
      horizontalBars: true,
      seriesBarDistance: 2,
      reverseData: true
      // axisY: {
      //   offset: 1
      // }
    }
    const height = 40*labels.length
    return <div style={{height}}>
      <ChartistGraph data={chartData} type={'Bar'} options={options}/>
    </div>
  }

  renderGroup(group, key, levels){

    const {children, count, by} = group

    //const groupByKeys = data.get('groupBys').toArray().length

    function pathToRoot(p){
      if (p.parent)
        return [...pathToRoot(p.parent), p]
      else
        return []
    }
    const path = group.parent

    const width = (levels + 1) * 210

    let sortFunc = group.by === 'strength' ? c => -c.key : c => -c.count

    const sortedChildren = _(children)
      .values()
      .sortBy(sortFunc)
      .value()

    const groupBy = by ? <div> group by
            <span className="chip" style={{margin:2}}> {by}
              <a href="#" onClick={() => this.removeGroupBy(by)}>
                {' [X]'}
              </a>
            </span>
    </div> : ''

    // const max = _.max(_.pluck(children,'count'))
    // {false && sortedChildren.length > 0 ? this.renderBarchart(sortedChildren) : ''}

    const isRoot = !group.parent
    const isLeaf = sortedChildren.length === 0

    const bar =  () => {
      if (isLeaf && !isRoot){
          const w = 150 * count / group.parent.max
          return <div style={{width: w, height: 5, top:0, backgroundColor: 'red', opacity: 0.2, position: 'absolute', left:0}}>
              </div>
      } else {
          return ''
      }
    }

    let label = <div style={{width: isRoot ? 40 : 190,
          display: 'inline-block',
          verticalAlign: 'top'}}>
        <a href='#' onClick={() => this.selectGroup(group)}>{key}</a>
        {isRoot ? '' : <span> ({count}) </span>}
      </div>

    return <div
      key={key}
      style={{width: width, padding:5, border: isRoot ? '' : '1px solid grey', display: 'inline-block', position: 'relative'}}>

        {bar()}
        {label}

        <div style={{width: width - 210, display: 'inline-block', position: 'relative'}}>
          {groupBy}
          {_.map(sortedChildren, (c) => {return this.renderGroup(c, c.key, levels - 1)})}
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
  return {
    actions: bindActionCreators(DataActions, dispatch)
  }
}
export default connect(mapState, mapDispatch)(GroupByTree)
