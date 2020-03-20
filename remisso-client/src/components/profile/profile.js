import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import withStyles from '@material-ui/core/styles/withStyles';
import { Link } from 'react-router-dom';
import dayjs from 'dayjs';
import EditDetails from './EditDetails';
import MyButton from '../../util/MyButton';
import ProfileSkeleton from '../../util/ProfileSkeleton';
import PostPost from '../post/PostPost';

// MUI stuff
import Button from '@material-ui/core/Button';
import MuiLink from '@material-ui/core/Link';
import Paper from '@material-ui/core/Paper';
import AddIcon from '@material-ui/icons/Add';

// Icons
import LocationOn from '@material-ui/icons/LocationOn';
import CalendarToday from '@material-ui/icons/CalendarToday';
import EditIcon from '@material-ui/icons/Edit';
import KeyboardReturn from '@material-ui/icons/KeyboardReturn';
import Typography from '@material-ui/core/Typography';
import AlternateEmailIcon from '@material-ui/icons/AlternateEmail';
import AppIcon from '../../icons/logo.png';
import WhatsAppIcon from '@material-ui/icons/WhatsApp';

import theme from '../../util/theme';
//Redux
import { connect } from 'react-redux';
import { logoutUser, uploadImage } from '../../redux/actions/userActions';

const styles = () => ({
	...theme,
	remisso: {
		fontFamily: 'Hikou',
		textAlign: 'center',
		lineHeight: 0.7,
		'@media (min-width:999px)': {
			fontSize: 80
		},
		zIndex: 99
	},
	tagline: {
		textAlign: 'center',
		fontFamily: 'Arial',
		color: '#696464',
		zIndex: 99,
		marginBottom: 15,
		'@media (min-width:999px)': {
			fontSize: 20
		}
	},
	padding: {
		textAlign: 'center'
	}
});

class Profile extends Component {
	handleImageChange = (event) => {
		const image = event.target.files[0];
		const formData = new FormData();
		formData.append('image', image, image.name);
		this.props.uploadImage(formData);
	};
	handleEditPicture = () => {
		const fileInput = document.getElementById('imageInput');
		fileInput.click();
	};
	handleLogout = () => {
		this.props.logoutUser();
	};

	render() {
		const {
			classes,
			user: {
				credentials: {
					handle,
					createdAt,
					imageUrl,
					bio,
					publicEmail,
					location,
					whatsapp
				},
				loading,
				authenticated
			}
		} = this.props;

		let profileMarkup = !loading ? (
			authenticated ? (
				<Fragment>
					<Paper className={classes.paper}>
						<div className={classes.profile}>
							<div className='image-wrapper'>
								<img src={imageUrl} alt='profile' className='profile-image' />
								<input
									type='file'
									id='imageInput'
									hidden='hidden'
									onChange={this.handleImageChange}
								/>
								<MyButton
									tip='Edit profile picture'
									onClick={this.handleEditPicture}
									btnClassName='button'>
									<EditIcon color='secondary' />
								</MyButton>
							</div>
							<hr />
							<div className='profile-details'>
								<MuiLink
									component={Link}
									to={`/users/${handle}`}
									color='secondary'
									variant='h5'>
									{handle}
								</MuiLink>
								<hr />
								{bio && <Typography variant='body2'>{bio}</Typography>}
								<hr />
								{location && (
									<Fragment>
										<LocationOn color='primary' /> <span>{location}</span>
										<hr />
									</Fragment>
								)}
								{publicEmail && (
									<Fragment>
										<AlternateEmailIcon color='primary' />
										<a
											href={`mailto:${publicEmail}`}
											target='_blank'
											rel='noopener noreferrer'>
											{' '}
											{publicEmail}
										</a>
										<hr />
									</Fragment>
								)}
								{whatsapp && (
									<Fragment>
										<WhatsAppIcon color='primary' />
										<a
											href={`mailto:${whatsapp}`}
											target='_blank'
											rel='noopener noreferrer'>
											{' '}
											{whatsapp}
										</a>
										<hr />
									</Fragment>
								)}
								<CalendarToday color='primary' />{' '}
								<span>Joined {dayjs(createdAt).format('MMM YYYY')}</span>
							</div>
							<MyButton tip='Logout' onClick={this.handleLogout}>
								<KeyboardReturn color='secondary' />
							</MyButton>
							<EditDetails />
						</div>
					</Paper>
					<div className={classes.padding}>
						<PostPost />
					</div>
				</Fragment>
			) : (
				<Fragment>
					<Paper className={classes.paper}>
						<div className={classes.profile}>
							<Typography variant='h2' className={classes.remisso}>
								Remisso
							</Typography>
							<Typography className={classes.tagline}>
								No bad deed goes unnoticed
							</Typography>
							<div className='image-wrapper'>
								<img className='profile-image2' src={AppIcon} alt='profile' />
							</div>
							<Typography variant='body2' align='center'></Typography>
							<div className={classes.buttons}>
								<Button
									variant='contained'
									color='secondary'
									component={Link}
									to='/login'>
									Login
								</Button>
								<Button
									variant='contained'
									color='primary'
									component={Link}
									to='/signup'>
									Signup
								</Button>
							</div>
						</div>
					</Paper>
					<div className={classes.padding}>
						<Link to='/login'>
							<MyButton tip='Post an account of what happened'>
								<AddIcon /> Create a new post
							</MyButton>
						</Link>
					</div>
				</Fragment>
			)
		) : (
			<ProfileSkeleton />
		);

		return profileMarkup;
	}
}

const mapStateToProps = (state) => ({
	user: state.user
});

const mapActionsToProps = { logoutUser, uploadImage };

Profile.propTypes = {
	logoutUser: PropTypes.func.isRequired,
	uploadImage: PropTypes.func.isRequired,
	user: PropTypes.object.isRequired,
	classes: PropTypes.object.isRequired
};

export default connect(
	mapStateToProps,
	mapActionsToProps
)(withStyles(styles)(Profile));
