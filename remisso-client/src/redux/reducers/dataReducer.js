import {
	SET_POSTS,
	LIKE_POST,
	UNLIKE_POST,
	LOADING_DATA,
	DELETE_POST,
	POST_POST,
	SET_POST,
	SUBMIT_COMMENT
} from '../types';

const initialState = {
	posts: [],
	post: {},
	loading: false
};

export default function(state = initialState, action, index) {
	switch (action.type) {
		case LOADING_DATA:
			return {
				...state,
				loading: true
			};
		case SET_POSTS:
			return {
				...state,
				posts: action.payload,
				loading: false
			};
		case SET_POST:
			return {
				...state,
				post: action.payload
			};
		case LIKE_POST:
			index = state.posts.findIndex(
				(post) => post.postId === action.payload.postId
			);
			state.posts[index].likeCount = action.payload.likeCount;
			if (state.post.postId === action.payload.postId) {
				state.post.likeCount = action.payload.likeCount;
			}
			return {
				...state
			};
		case UNLIKE_POST:
			index = state.posts.findIndex(
				(post) => post.postId === action.payload.postId
			);
			state.posts[index] = action.payload;
			if (state.post.postId === action.payload.postId) {
				state.post.likeCount = action.payload.likeCount;
			}
			return {
				...state
			};
		case DELETE_POST:
			index = state.posts.findIndex((post) => post.postId === action.payload);
			state.posts.splice(index, 1);
			return {
				...state
			};
		case POST_POST:
			return {
				...state,
				posts: [action.payload, ...state.posts]
			};
		case SUBMIT_COMMENT:
			index = state.posts.findIndex(
				(post) => post.postId === action.payload.postId
			);
			let x = state.post.commentCount + 1;
			state.post.commentCount = x;
			state.posts[index].commentCount++;
			return {
				...state,
				post: {
					...state.post,
					comments: [action.payload, ...state.post.comments]
				}
			};
		default:
			return state;
	}
}
