import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import withStyles from '@material-ui/core/styles/withStyles';
import MyButton from '../../util/MyButton';
import { withRouter } from 'react-router-dom';
import PublishIcon from '@material-ui/icons/Publish';

// MUI Stuff
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import CircularProgress from '@material-ui/core/CircularProgress';
import AddIcon from '@material-ui/icons/Add';
import CloseIcon from '@material-ui/icons/Close';

//google maps

// Redux stuff
import { connect } from 'react-redux';
import { postPost, clearErrors } from '../../redux/actions/dataActions';
import { uploadPostImage } from '../../redux/actions/userActions';
import theme from '../../util/theme';
import Autocomplete from './autocomplete';

const styles = () => ({
	...theme,
	submitButton: {
		position: 'relative',
		float: 'right',
		marginTop: 10
	},
	progressSpinner: {
		position: 'absolute'
	},
	closeButton: {
		position: 'absolute',
		left: '91%',
		top: 0
	},
	image: {
		minHeight: 75,
		maxHeight: 200,
		objectFit: 'contain'
	},
	textField: {
		marginTop: 20
	},
	centered: {
		margin: 20,
		textAlign: 'center'
	}
});

class PostPost extends Component {
	state = {
		open: false,
		name: '',
		bodyAccount: '',
		bodyResolution: '',
		facebookLink: '',
		instagramLink: '',
		otherLink: '',
		userImage: '',
		imgURL: '',
		location: '',
		lat: '',
		lng: '',
		errors: 'no error',
		picture: false
	};

	//image upload
	handleImageChange = (event) => {
		this.setState({ URL: '' });
		const image = event.target.files[0];
		const formData = new FormData();
		formData.append('image', image, image.name);
		this.props.uploadPostImage(formData);
		this.setState({
			errors: 'image uploaded',
			picture: true
		});
	};
	handlePicture = (event) => {
		const fileInput = document.getElementById('imageInputPost');
		fileInput.click();
	};

	componentDidMount() {
		if (this.props.openDialog) {
			this.handleOpen();
		}
	}

	UNSAFE_componentWillReceiveProps(nextProps) {
		if (nextProps.UI.errors) {
			this.setState({
				errors: nextProps.UI.errors
			});
		}
		if (nextProps.submit) {
			this.setState({
				submit: nextProps.submit
			});
		}
		if (nextProps.user.URL && this.state.picture) {
			this.setState({
				imgURL: nextProps.user.URL
			});
		}
		if (!nextProps.UI.errors && !nextProps.UI.loading && this.state.submit) {
			this.setState({ body: '', errors: {}, open: false });
			this.handleClose();
		}
	}
	handleOpen = () => {
		this.setState({
			open: true,
			bodyAccount: '',
			bodyResolution: '',
			facebookLink: '',
			instagramLink: '',
			otherLink: '',
			userImage: '',
			imgURL: '',
			location: '',
			lat: '',
			lng: '',
			errors: {},
			submit: false,
			picture: false
		});
		let oldPath = window.location.pathname;
		const newPath = `/posts/createpost`;

		if (oldPath === newPath) oldPath = `/posts`;

		window.history.pushState(null, null, newPath);
	};
	handleClose = () => {
		this.props.clearErrors();
		this.setState({
			open: false,
			bodyAccount: '',
			bodyResolution: '',
			facebookLink: '',
			instagramLink: '',
			otherLink: '',
			userImage: '',
			imgURL: '',
			location: '',
			lat: '',
			lng: '',
			errors: {},
			submit: false
		});
		window.history.pushState(null, null, `/posts`);
	};
	handleChange = (event) => {
		this.setState({
			[event.target.name]: event.target.value
		});
	};
	myCallback = (data) => {
		this.setState({
			location: data.location,
			lat: data.lat,
			lng: data.lng
		});
	};

	handleSubmit = (event) => {
		event.preventDefault();
		this.props.postPost({
			name: this.state.name,
			bodyAccount: this.state.bodyAccount,
			bodyResolution: this.state.bodyResolution,
			facebookLink: this.state.facebookLink,
			instagramLink: this.state.instagramLink,
			otherLink: this.state.otherLink,
			userImage: this.state.userImage,
			imgURL: this.state.imgURL,
			location: this.state.location,
			lat: this.state.lat,
			lng: this.state.lng
		});
		this.setState({
			submit: true
		});
	};
	render() {
		const { errors } = this.state;
		const {
			classes,
			UI: { loading }
		} = this.props;
		return (
			<Fragment>
				<MyButton
					onClick={this.handleOpen}
					tip='Post an account of what happened'>
					<AddIcon /> Create a new post
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

					<DialogTitle>Post an Account </DialogTitle>
					<input
						type='file'
						id='imageInputPost'
						hidden='hidden'
						onChange={this.handleImageChange}
					/>

					{!loading ? (
						<img src={this.state.imgURL} className={classes.image}></img>
					) : (
						<div className={classes.image}></div>
					)}
					<Button
						tip='Picture'
						onClick={this.handlePicture}
						className={classes.Button}>
						<PublishIcon color='secondary' />
						<p></p>
						Upload picture
						{loading && (
							<CircularProgress size={30} className={classes.progressSpinner} />
						)}
						<p></p>
					</Button>
					<DialogContent>
						{errors.code}
						<form onSubmit={this.handleSubmit}>
							<TextField
								name='name'
								type='text'
								label="Person's name"
								multiline
								rows='2'
								placeholder='Post first and last name'
								error={errors.body ? true : false}
								helperText={errors.body}
								className={classes.textField}
								onChange={this.handleChange}
								fullWidth
							/>
							<TextField
								name='bodyAccount'
								type='text'
								label='Account of what happened'
								multiline
								rows='2'
								placeholder='Describe the event/scam'
								error={errors.body ? true : false}
								helperText={errors.body}
								className={classes.textField}
								onChange={this.handleChange}
								fullWidth
							/>
							<TextField
								name='bodyResolution'
								type='text'
								label='Resolution'
								multiline
								rows='2'
								placeholder='How can this be resolved?'
								error={errors.body ? true : false}
								helperText={errors.body}
								className={classes.textField}
								onChange={this.handleChange}
								fullWidth
							/>
							<div className={classes.textField}>
								<Autocomplete callbackFromParent={this.myCallback.bind(this)} />
							</div>
							<TextField
								name='facebookLink'
								type='text'
								label='Facebook Page Link'
								multiline
								rows='2'
								placeholder='Paste the url here'
								className={classes.textField}
								onChange={this.handleChange}
								fullWidth
							/>
							<TextField
								name='instagramLink'
								type='text'
								label='Instagram Page Link'
								multiline
								rows='2'
								placeholder='Paste the url here'
								className={classes.textField}
								onChange={this.handleChange}
								fullWidth
							/>
							<TextField
								name='otherLink'
								type='text'
								label='Other Link'
								multiline
								rows='2'
								placeholder='Link to any website or page related to the event'
								className={classes.textField}
								onChange={this.handleChange}
								fullWidth
							/>
							<div className={classes.centered}>
								<Button
									type='submit'
									variant='contained'
									color='primary'
									className={classes.Button}
									disabled={loading}>
									Submit
									{loading && (
										<CircularProgress
											size={30}
											className={classes.progressSpinner}
										/>
									)}
								</Button>
							</div>
						</form>
					</DialogContent>
				</Dialog>
			</Fragment>
		);
	}
}

PostPost.propTypes = {
	postPost: PropTypes.func.isRequired,
	clearErrors: PropTypes.func.isRequired,
	uploadPostImage: PropTypes.func.isRequired,
	UI: PropTypes.object.isRequired,
	user: PropTypes.object.isRequired
};

const mapStateToProps = (state) => ({
	UI: state.UI,
	user: state.user
});

export default connect(mapStateToProps, {
	postPost,
	clearErrors,
	uploadPostImage
})(withStyles(styles)(withRouter(PostPost)));
