import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import withStyles from '@material-ui/core/styles/withStyles';
import MyButton from '../../util/MyButton';
// MUI Stuff
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import CircularProgress from '@material-ui/core/CircularProgress';
import AddIcon from '@material-ui/icons/Add';
import CloseIcon from '@material-ui/icons/Close';
// Redux stuff
import { connect } from 'react-redux';
import { postPost, clearErrors } from '../../redux/actions/dataActions';
import theme from '../../util/theme';

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
		top: '6%'
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
		lat: '55',
		lng: '55',
		errors: {}
	};
	componentWillReceiveProps(nextProps) {
		if (nextProps.UI.errors) {
			this.setState({
				errors: nextProps.UI.errors
			});
		}
		if (!nextProps.UI.errors && !nextProps.UI.loading) {
			this.setState({ body: '', open: false, errors: {} });
		}
	}
	handleOpen = () => {
		this.setState({ open: true });
	};
	handleClose = () => {
		this.props.clearErrors();
		this.setState({ open: false, errors: {} });
	};
	handleChange = (event) => {
		this.setState({ [event.target.name]: event.target.value });
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
					<DialogContent>
						<form onSubmit={this.handleSubmit}>
							<TextField
								name='name'
								type='text'
								label="Person's name"
								multiline
								rows='3'
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
								rows='3'
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
								rows='3'
								placeholder='How can this be resolved?'
								error={errors.body ? true : false}
								helperText={errors.body}
								className={classes.textField}
								onChange={this.handleChange}
								fullWidth
							/>
							<TextField
								name='facebookLink'
								type='text'
								label='Facebook Page Link'
								multiline
								rows='3'
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
								rows='3'
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
								rows='3'
								placeholder='Link to any website or page related to the event'
								className={classes.textField}
								onChange={this.handleChange}
								fullWidth
							/>
							<Button
								type='submit'
								variant='contained'
								color='primary'
								className={classes.submitButton}
								disabled={loading}>
								Submit
								{loading && (
									<CircularProgress
										size={30}
										className={classes.progressSpinner}
									/>
								)}
							</Button>
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
	UI: PropTypes.object.isRequired
};

const mapStateToProps = (state) => ({
	UI: state.UI
});

export default connect(mapStateToProps, { postPost, clearErrors })(
	withStyles(styles)(PostPost)
);
