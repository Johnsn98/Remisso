import React, { Component } from 'react';

import Grid from '@material-ui/core/Grid';
import Profile from '../components/profile/profile';
import withStyles from '@material-ui/core/styles/withStyles';
import theme from '../util/theme';
import '../App.css';
import PropTypes from 'prop-types';

import image1 from '../images/image1.jpg';
import image2 from '../images/image2.jpg';
import image3 from '../images/image3.jpg';

import { connect } from 'react-redux';
import { getPosts } from '../redux/actions/dataActions';

//Mui
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import Typography from '@material-ui/core/Typography';

import Icon from '../icons/pin.svg';
import loadingIcon from '../icons/loading.png';
//maps
import { Map, Marker, GoogleApiWrapper } from 'google-maps-react';

const styles = () => ({
	...theme,

	pictures: {
		zIndex: 3,
		marginBottom: 10,
		padding: '2%',
		fontSize: 30,
		'@media (max-width:700px)': {
			margin: 10
		}
	},
	left: {
		background: 'white',
		position: 'relative',
		zIndex: 3,
		marginBottom: 10,
		padding: '6% 8%',
		fontSize: 30,
		fontFamily: 'Helvetica Neue',
		color: '#5C5C5C',

		'@media (max-width:700px)': {
			fontSize: 25,
			background: 'none'
		}
	},
	card: {
		width: '100%',
		height: '98%',
		'&:hover': {
			opacity: '.99',
			curson: 'pointer',
			position: 'relative',
			top: '-5px'
		}
	},
	imageTitle: {
		position: 'absolute',
		fontSize: '1.2rem',
		bottom: 10,
		zIndex: 9,
		color: 'white',
		textAlign: 'center',
		width: '100%',
		fontFamily: 'Helvetica Neue',
		fontWeight: '200',
		textShadow: '2px 2px #000000'
	},
	cardMedia: {
		width: '100%'
	},
	mapContainer: {
		zIndex: 10,
		width: '100vw',
		position: 'relative',
		left: '50%',
		right: '..',
		marginLeft: '-50vw',
		marginRight: '-50vw',
		marginTop: 20
	},
	marker: {
		background: 'white'
	},
	locatorText: {
		zIndex: 11,
		color: 'white',
		textAlign: 'center',
		position: 'absolute',
		top: 0,
		left: 0,
		width: '100vw',
		fontFamily: 'Hikou',
		fontSize: '4vw',
		marginTop: 28
	},
	locatorOrange: {
		color: '#C94C18',
		height: 1200
	},
	info: {
		width: '100%',
		textAlign: 'center',
		fontFamily: 'Helvetica Neue',
		fontSize: 20,
		paddingLeft: '10px',
		paddingRight: '10px',
		color: '#7E7E7E'
	},
	container: {
		heigth: 750
	}
});

export class home extends Component {
	state = {
		showingInfoWindow: true,
		activeMarker: {},
		selectedPlace: {},
		isOpen: true
	};
	componentDidMount() {
		this.props.getPosts();
	}

	onMarkerClick = (post) => {
		this.props.history.push(`/users/${post.userHandle}/post/${post.postId}`);
	};

	render() {
		const { posts, loading } = this.props.data;
		let Link = require('react-router-dom').Link;
		const { classes } = this.props;
		const style = {
			width: '100%',
			height: 900
		};
		let Markers;
		if (posts) {
			Markers = !loading ? (
				posts.map((post) => (
					<Marker
						name={'Current location'}
						className={classes.marker}
						label={{
							text: post.name,
							fontSize: '1rem',
							color: 'white'
						}}
						labelOrigin={[0, 0]}
						position={{ lat: post.lat, lng: post.lng }}
						onClick={() => this.onMarkerClick(post)}
						icon={Icon}
						key={post.postId}></Marker>
				))
			) : (
				<Marker
					icon={loadingIcon}
					label={{
						text: 'LOADING',
						fontSize: '1rem',
						color: 'white'
					}}
					position={{ lat: 19, lng: -99 }}
				/>
			);
		}

		return (
			<div>
				<div>
					{' '}
					<div className='white'></div>
					<Grid container>
						<Grid item className={classes.left} sm={6} xs={12}>
							Remisso is a public record of petty offenses and misdoings between
							citizens in aim to resolve conflicts and improve C2C business
							conduct as a whole and for everyone.
						</Grid>

						<Grid item sm={1} xs={false}></Grid>
						<Grid item sm={4} xs={12}>
							<Profile />
						</Grid>
					</Grid>
					<Grid container>
						<Grid item sm={4} xs={12} className={classes.pictures}>
							<Link to={'/search'}>
								<Card className={classes.card}>
									<CardActionArea>
										<Typography
											component='span'
											variant='subtitle1'
											color='inherit'
											className={classes.imageTitle}>
											Search For Someone
										</Typography>
										<img
											component='img'
											alt='Contemplative Reptile'
											src={image1}
											title='Contemplative Reptile'
											className={classes.cardMedia}
										/>{' '}
									</CardActionArea>
								</Card>
							</Link>
						</Grid>
						<Grid item sm={4} xs={12} className={classes.pictures}>
							<Link to={'/createpost'}>
								<Card className={classes.card}>
									<CardActionArea>
										<Typography
											component='span'
											variant='subtitle1'
											color='inherit'
											className={classes.imageTitle}>
											Post An Account
										</Typography>

										<img
											component='img'
											alt='Contemplative Reptile'
											src={image2}
											title='Contemplative Reptile'
											className={classes.cardMedia}
										/>
									</CardActionArea>
								</Card>
							</Link>
						</Grid>
						<Grid item sm={4} xs={12} className={classes.pictures}>
							<Link to={'/posts'}>
								<Card className={classes.card}>
									<CardActionArea>
										<Typography
											component='span'
											variant='subtitle1'
											color='inherit'
											className={classes.imageTitle}>
											View Recent Posts
										</Typography>
										<img
											component='img'
											alt='Contemplative Reptile'
											src={image3}
											title='Contemplative Reptile'
											className={classes.cardMedia}
										/>
									</CardActionArea>
								</Card>
							</Link>
						</Grid>
						<Grid item sm={12} xs={12} className={classes.pictures}>
							<div className={classes.info}>
								Today’s modern gig-economy requires self-regulation below the
								level of law enforcement. Here we can track when scams and
								swindles occur, thus discouraging future offenses and creating a
								pathway for resolution between the two parties.
							</div>
						</Grid>
					</Grid>
					<Map
						className={classes.mapContainer}
						google={this.props.google}
						style={style}
						styles={[
							{
								featureType: 'all',
								elementType: 'labels.text.fill',
								stylers: [{ color: '#08304b' }, { lightness: 15 }]
							},
							{
								featureType: 'all',
								elementType: 'labels.text.stroke',
								stylers: [{ color: '#08304b' }]
							},
							{
								featureType: 'administrative',
								elementType: 'geometry.fill',
								stylers: [{ color: '#08304b' }]
							},
							{
								featureType: 'administrative',
								elementType: 'geometry.stroke',
								stylers: [
									{ color: '#08304b' },
									{ lightness: 14 },
									{ weight: 1.4 }
								]
							},
							{
								featureType: 'landscape',
								elementType: 'all',
								stylers: [{ color: '#08304b' }]
							},
							{
								featureType: 'poi',
								elementType: 'all',
								stylers: [{ visibility: 'off' }, { lightness: 5 }]
							},
							{
								featureType: 'road.highway',
								elementType: 'geometry.fill',
								stylers: [{ visibility: 'off' }]
							},
							{
								featureType: 'road.highway',
								elementType: 'geometry.stroke',
								stylers: [{ visibility: 'off' }, { lightness: 25 }]
							},
							{
								featureType: 'road.arterial',
								elementType: 'geometry.fill',
								stylers: [{ visibility: 'off' }]
							},
							{
								featureType: 'road',
								elementType: 'all',
								stylers: [{ visibility: 'off' }]
							},
							{
								featureType: 'road.arterial',
								elementType: 'geometry.stroke',
								stylers: [{ visibility: 'off' }, { lightness: 16 }]
							},
							{
								featureType: 'road.local',
								elementType: 'geometry',
								stylers: [{ visibility: 'off' }]
							},
							{
								featureType: 'transit',
								elementType: 'all',
								stylers: [{ visibility: 'off' }]
							},
							{
								featureType: 'water',
								elementType: 'all',
								stylers: [{ color: '#191A1A' }]
							}
						]}
						initialCenter={{
							lat: 42.854885,
							lng: -88.081807
						}}
						onClick={this.onMapClicked}
						zoom={3}>
						{Markers}
						<div className={classes.locatorText}>
							<span className={classes.locatorOrange}>Remisso </span>
							Locator
						</div>
					</Map>
				</div>
			</div>
		);
	}
}

home.propTypes = {
	getPosts: PropTypes.func.isRequired,
	data: PropTypes.object.isRequired
};

const mapStateToProps = (state) => ({
	data: state.data
});

const WrappedContainer = GoogleApiWrapper({
	apiKey: 'AIzaSyDj_9odVBkDDQJwwvudv1Buf6s-KCLomME'
})(home);

export default connect(mapStateToProps, { getPosts })(
	withStyles(styles)(WrappedContainer)
);
