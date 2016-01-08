import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

const TextField = require('material-ui/lib/text-field')
const RaisedButton = require('material-ui/lib/raised-button')

const List = require('material-ui/lib/lists/list')
const ListDivider = require('material-ui/lib/lists/list-divider')
const ListItem = require('material-ui/lib/lists/list-item')

export default class ItemComments extends Component {

  static propTypes = {
    comments: PropTypes.object.isRequired,
    itemId: PropTypes.string.isRequired, // id of the item associated with the comments
    addComment: PropTypes.func.isRequired
  }

  render(){
    const {comments} = this.props
    const n = _.keys(comments).length
    return <List subheader={`Comments (${n})`}>
      {this.renderComments()}
      <ListDivider />
      {this.renderAdd()}
    </List>
  }

  renderComment(comment, i){
      return <ListItem key={i}
        primaryText={comment.owner.displayName}
        secondaryText={comment.text}>
      </ListItem>
  }

  renderComments(){
    const {comments} = this.props
    return _.map(comments, (c,i) => this.renderComment(c,i))
  }

  handleAddComment(){
    const {itemId, addComment} = this.props
    const text = this.refs.textField.getValue()
    if (text){
      addComment(itemId, text)
      // clear the text field
      this.refs.textField.setValue('')
    }
  }

  renderAdd(){
    const {itemId, addComment} = this.props
    return <ListItem>
      <TextField style={{width:'80%',marginRight:20}} hintText="Type a Comment" multiLine={true} ref="textField"/>
      <RaisedButton label="Save" onClick={() => this.handleAddComment()}/>
    </ListItem>
  }
}


import * as CommentActions from '../actions/CommentActions'
function mapDispatch(dispatch) {
  return bindActionCreators(CommentActions, dispatch)
}
export default connect(null, mapDispatch)(ItemComments)
