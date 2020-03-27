import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import withStyles from '@material-ui/core/styles/withStyles';
import dayjs from 'dayjs';
import { Link } from 'react-router-dom';

// MUI
import MuiLink from '@material-ui/core/Link';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
// Icons
import LocationOn from '@material-ui/icons/LocationOn';
import CalendarToday from '@material-ui/icons/CalendarToday';
import AlternateEmailIcon from '@material-ui/icons/AlternateEmail';
import WhatsAppIcon from '@material-ui/icons/WhatsApp';
import theme from '../../util/theme';

const styles = () => ({
	...theme
});

const StaticProfile = (props) => {
	const {
		classes,
		profile: {
			handle,
			createdAt,
			imageUrl,
			bio,
			publicEmail,
			location,
			whatsapp
		}
	} = props;

	return (
		<Paper className={classes.paper}>
			<div className={classes.profile}>
				<div className='image-wrapper'>
					<img src={imageUrl} alt='profile' className='profile-image' />
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
			</div>
		</Paper>
	);
};

StaticProfile.propTypes = {
	profile: PropTypes.object.isRequired,
	classes: PropTypes.object.isRequired
};

export default withStyles(styles)(StaticProfile);
