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

class posts extends Component {
	componentDidMount() {
		this.props.getPosts();
	}
	render() {
		const { posts, loading } = this.props.data;
		let recentPostsMarkup = !loading ? (
			posts.map((post) => <Post key={post.postId} post={post} />)
		) : (
			<PostSkeleton />
		);
		return (
			<div>
				<Grid container spacing={16}>
					<Grid item sm={8} xs={12}>
						{recentPostsMarkup}
					</Grid>
					<Grid item sm={4} xs={12}>
						<Profile />
					</Grid>
				</Grid>
			</div>
		);
	}
}

posts.propTypes = {
	getPosts: PropTypes.func.isRequired,
	data: PropTypes.object.isRequired
};

const mapStateToProps = (state) => ({
	data: state.data
});

export default connect(mapStateToProps, { getPosts })(posts);
