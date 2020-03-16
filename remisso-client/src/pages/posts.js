import React, { Component } from 'react';
import Grid from '@material-ui/core/Grid';
import axios from 'axios';

import Post from '../components/post/Post';
import PostSkeleton from '../util/postSkeleton';

class posts extends Component {
	state = {
		posts: null
	};

	componentDidMount() {
		axios
			.get('/posts')
			.then((res) => {
				this.setState({
					posts: res.data
				});
			})
			.catch((err) => console.log(err));
	}

	render() {
		let recentPostsMarkup = this.state.posts ? (
			this.state.posts.map((post) => (
				<Post key={post.postId} post={post}></Post>
			))
		) : (
			<p>Loading</p>
		);

		return (
			<div>
				<Grid container spacing={16}>
					<Grid item sm={8} xs={12}>
						{recentPostsMarkup}
					</Grid>
					<Grid item sm={4} xs={12}>
						profile
					</Grid>
				</Grid>
			</div>
		);
	}
}

export default posts;
