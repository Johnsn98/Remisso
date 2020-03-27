import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import withStyles from '@material-ui/core/styles/withStyles';
import MyButton from '../../util/MyButton';
import LikeButton from './LikeButton';

import Comments from './Comments';
import CommentForm from './CommentForm';

import dayjs from 'dayjs';
import { Link } from 'react-router-dom';
// MUI Stuff
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import CircularProgress from '@material-ui/core/CircularProgress';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
// Icons
import CloseIcon from '@material-ui/icons/Close';
import UnfoldMore from '@material-ui/icons/UnfoldMore';
import ChatIcon from '@material-ui/icons/Chat';
// Redux stuff
import { connect } from 'react-redux';
import { getPost, clearErrors } from '../../redux/actions/dataActions';
import theme from '../../util/theme';

// Icons
import FacebookIcon from '@material-ui/icons/Facebook';
import InstagramIcon from '@material-ui/icons/Instagram';
import LinkIcon from '@material-ui/icons/Link';

const styles = () => ({
	...theme,
	profileImage: {
		height: 400,
		width: '100%',
		objectFit: 'cover'
	},
	dialogContent: {
		padding: 20
	},
	closeButton: {
		position: 'absolute',
		left: '90%'
	},
	expandButton: {
		position: 'absolute',
		left: '90%'
	},
	spinnerDiv: {
		textAlign: 'center',
		marginTop: 50,
		marginBottom: 50
	},
	bold: {
		fontWeight: 'bold',
		color: '#2C2C2C'
	}
});

class PostDialog extends Component {
	state = {
		open: false
	};
	componentDidMount() {
		if (this.props.openDialog) {
			this.handleOpen();
		}
	}
	handleOpen = () => {
		let oldPath = window.location.pathname;

		const { userHandle, postId } = this.props;
		const newPath = `/users/${userHandle}/post/${postId}`;

		if (oldPath === newPath) oldPath = `/users/${userHandle}`;

		window.history.pushState(null, null, newPath);

		this.setState({ open: true });
		this.props.getPost(this.props.postId);
	};
	handleClose = () => {
		window.history.pushState(null, null, this.state.oldPath);
		this.setState({ open: false });
		this.props.clearErrors();
	};

	render() {
		const {
			classes,
			post: {
				postId,
				bodyResolution,
				userHandle,
				createdAt,
				commentCount,
				bodyAccount,
				imgURL,
				name,
				comments,
				facebookLink,
				instagramLink,
				otherLink,
				location
			},
			UI: { loading },
			commentnumber,
			likenumber
		} = this.props;

		function FacebookLink() {
			if (facebookLink)
				return (
					<a className={classes.link} href={facebookLink}>
						<MyButton tip='View Facebook page'>
							<FacebookIcon />
						</MyButton>
						{facebookLink}
					</a>
				);
			else return <div></div>;
		}

		function InstagramLink() {
			if (instagramLink)
				return (
					<a className={classes.link} href={instagramLink}>
						<MyButton tip='View Instagram page'>
							<InstagramIcon color='primary' />
						</MyButton>{' '}
						{instagramLink}
					</a>
				);
			return <div></div>;
		}

		function OtherLink() {
			if (otherLink)
				return (
					<a className={classes.link} href={otherLink}>
						<MyButton tip='View Instagram page'>
							<LinkIcon color='primary' />
						</MyButton>{' '}
						{otherLink}
					</a>
				);
			return <div></div>;
		}

		const dialogMarkup = loading ? (
			<div className={classes.spinnerDiv}>
				<CircularProgress size={200} thickness={2} />
			</div>
		) : (
			<Grid container>
				<Grid item sm={12}>
					<img src={imgURL} alt='Profile' className={classes.profileImage} />
				</Grid>
				<Grid item sm={12}>
					<Typography component={Link} color='primary' variant='h2' to=''>
						{name}
					</Typography>
					<hr className={classes.invisibleSeparator} />
					<Typography variant='body2' color='textSecondary'>
						{dayjs(createdAt).format('h:mm a, MMMM DD YYYY')}
					</Typography>
					<Typography
						variant='body2'
						color='textSecondary'
						component={Link}
						to={`/users/${userHandle}`}
						className={classes.user}>
						Posted by: {userHandle},
					</Typography>{' '}
					<Typography
						variant='body2'
						color='textSecondary'
						component={Link}
						to={`/users/${userHandle}`}
						className={classes.user}>
						Location: {location}
					</Typography>
					<div>
						<FacebookLink /> <InstagramLink /> <OtherLink />
					</div>
					<hr className={classes.invisibleSeparator} />
					<Typography className={classes.bold}>
						Account of what happened:
					</Typography>
					<Typography className={classes.underline}>{bodyAccount}</Typography>{' '}
					<Typography className={classes.bold}>
						How can it be resolved:
					</Typography>
					<Typography className={classes.underline}>
						{bodyResolution}
					</Typography>
					<LikeButton postId={postId} />
					<span>{likenumber} Approvals</span>
					<MyButton tip='comments'>
						<ChatIcon color='primary' />
					</MyButton>
					<span>{commentCount} comments</span>
				</Grid>
				<hr className={classes.visibleSeparator} />
				<CommentForm postId={postId} />
				<Comments comments={comments}> </Comments>
			</Grid>
		);
		return (
			<Fragment>
				<MyButton tip='comments' onClick={this.handleOpen}>
					<ChatIcon color='primary' />
				</MyButton>
				{commentnumber} comments
				<MyButton
					onClick={this.handleOpen}
					tip='Expand post'
					tipClassName={classes.expandButton}>
					<UnfoldMore color='primary' />
				</MyButton>
				<Dialog
					open={this.state.open}
					onClose={this.handleClose}
					fullWidth
					maxWidth='sm'>
					<MyButton
						tip='Close'
						onClick={this.handleClose}
						tipClassName={classes.closeButton}>
						<CloseIcon />
					</MyButton>
					<DialogContent className={classes.dialogContent}>
						{dialogMarkup}
					</DialogContent>
				</Dialog>
			</Fragment>
		);
	}
}

PostDialog.propTypes = {
	clearErrors: PropTypes.func.isRequired,
	getPost: PropTypes.func.isRequired,
	postId: PropTypes.string.isRequired,
	userHandle: PropTypes.string.isRequired,
	post: PropTypes.object.isRequired,
	UI: PropTypes.object.isRequired
};

const mapStateToProps = (state) => ({
	post: state.data.post,
	UI: state.UI
});

const mapActionsToProps = {
	getPost,
	clearErrors
};
export default connect(
	mapStateToProps,
	mapActionsToProps
)(withStyles(styles)(PostDialog));
