import React, { Component } from 'react';
import Grid from '@material-ui/core/Grid';
import PropTypes from 'prop-types';

//components
import Post from '../components/post/Post';
import PostSkeleton from '../util/postSkeleton';
import Profile from '../components/profile/profile';
import PostPost from '../components/post/PostPost';
//redux
import { connect } from 'react-redux';
import { getPosts } from '../redux/actions/dataActions';

import { Link } from 'react-router-dom';
import AddIcon from '@material-ui/icons/Add';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import MyButton from '../util/MyButton';

class posts extends Component {
	state = {
		profile: null,
		handleParam: null,
		showitems: 5
	};

	componentDidMount() {
		if (this.props.data.posts.length < 5) {
			this.props.getPosts();
		}
	}
	handleShowMore = () => {
		this.setState({ showitems: this.state.showitems + 10 });
	};

	render() {
		const { posts, loading } = this.props.data;
		let moreButton;
		if (this.props.data.posts.length > 5) {
			moreButton = (
				<MyButton onClick={this.handleShowMore}>
					<ExpandMoreIcon />
					Show more
				</MyButton>
			);
		}
		const {
			user: { authenticated }
		} = this.props;
		let createPostMarkup;
		let recentPostsMarkup = !loading ? (
			posts.slice(0, this.state.showitems).map(
				(post) => <Post key={post.postId} post={post} />

				//	posts.map((post) => <Post key={post.postId} post={post}
			)
		) : (
			<PostSkeleton />
		);
		if (this.props.location.pathname === '/posts/createpost') {
			createPostMarkup = <PostPost openDialog />;
		} else {
			createPostMarkup = <PostPost />;
		}

		let markup = !authenticated ? (
			<p>
				{' '}
				<Link to='/login'>
					<MyButton tip='Post an account of what happened'>
						<AddIcon /> Create a new post
					</MyButton>
				</Link>
			</p>
		) : (
			<p> {createPostMarkup} </p>
		);
		return (
			<div>
				<Grid container>
					<Grid item sm={8} xs={12}>
						{recentPostsMarkup}
						{moreButton}
					</Grid>
					<Grid item sm={4} xs={12}>
						<Profile />
						{markup}
					</Grid>
				</Grid>
			</div>
		);
	}
}

posts.propTypes = {
	getPosts: PropTypes.func.isRequired,
	data: PropTypes.object.isRequired,
	user: PropTypes.object.isRequired
};

const mapStateToProps = (state) => ({
	data: state.data,
	user: state.user
});

export default connect(mapStateToProps, { getPosts })(posts);
