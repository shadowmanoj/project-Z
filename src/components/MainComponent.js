import React, { Component } from 'react';
import {actions} from "react-redux-form";
import {connect } from 'react-redux';
import {postComment,fetchComments} from '../redux/ActionCreators';
import CommentComponent from './CommentsComponent';

const mapStateToProps=(state)=>{
    return {
      comments:state.comments
    }
  }


const mapDispatchToProps=(dispatch)=>({
  postComment:(comment)=>dispatch(postComment(comment)),
  fetchComments:()=>{dispatch(fetchComments())},
  resetFeedbackForm:()=>{dispatch(actions.reset('feedback'))}
})



class Main extends Component {
  constructor(props) {
    super(props);
    
}

componentDidMount(){
  this.props.fetchComments();
}

render(){
	
	return (
		<div>
			<CommentComponent
			commentsLoading={this.props.comments.isLoading}
			commentsErrMess={this.props.comments.errMess}
			comments={this.props.comments.comments}
			postComment={this.props.postComment}
			resetFeedbackForm={this.props.resetFeedbackForm}
			 />
		</div>
		);

}
}



export default connect(mapStateToProps,mapDispatchToProps)(Main);