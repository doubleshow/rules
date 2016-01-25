import _ from 'lodash'

function groupByRecursively(data, keys, parent = null){
  let node = {}
  node.parent = parent

  if (keys.length > 0){
    let key = keys[0]
    // console.log(data)

    if (data[0] && _.isArray(data[0][key])){

      let key1 = '_' + key
      let expanded = _(data)
        .map(d => {
          return _.map(d[key], v => {
              return Object.assign({}, d, {[key1]: v})
          })
        })
        .flatten()
        .value()

      node.children = _(expanded)
        .groupBy(key1)
        .mapValues((v,k)=>{
            let c = groupByRecursively(v, _.rest(keys), node)
            c.key = k
            return c
          })
        .value()


    } else {

      node.children = _(data)
        .groupBy(key)
        .mapValues((v,k)=>{
            let c = groupByRecursively(v, _.rest(keys), node)
            c.key = k
            return c
          })
        .value()
    }

    let children_counts = _.pluck(node.children, 'count')
    node.count = _.sum(children_counts)
    node.max = _.max(children_counts)
    node.by = key

  } else {
    node.data = data
    node.count = data.length
  }
  return node
}

import { createSelector } from 'reselect'

export function groupSelector(state){
  return groupByRecursively(state.data.get('items'), state.data.get('groupBys').toJS())
}

export const groupByTreeSelector = createSelector(
  state => state.data.get('items'),
  state => state.data.get('groupBys').toJS(),
  (items, groupBys) => {
    return {
      root: groupByRecursively(items, groupBys),
      levels: groupBys.length
    }
  }
)

function collectDataFromAllDescendents(node){
  if (node.children){
    return _.flatten(_.map(node.children, v => {
      return collectDataFromAllDescendents(v)
    }))
  } else {
    return node.data
  }
}

function getGroupAt(group, path = []){
  if (path.length > 0){
    let p = path[0]
    return getGroupAt(group.children[p.key], _.rest(path))
  } else {
    return group
  }
}

export const clustersSelector = state => state.data.get('clusters')

export const pathSelector = state => state.data.get('selected').path

const commentsSelector = state => state.data.get('comments').toJS()

export const itemsSelector = createSelector(
  groupSelector,
  pathSelector,
  commentsSelector,
  (root, path, comments) => {
    console.time('select')

    let g = getGroupAt(root, path)
    let items = collectDataFromAllDescendents(g)

    items = _.uniq(items, item => {
      return item.id
    })

    items = _.map(items, d =>{
      return {
        id: d['id'],
        data: d
      }
    })

    // items = _.take(items,50)  // test perf

    // attach comments
    _.forEach(items, item => {
      item.comments = comments[item.id] || {}
    })

    console.timeEnd('select')
    return items
  }
)

export const viewSelector = state => state.data.get('view')
