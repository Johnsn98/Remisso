import React, { Component } from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import PropTypes from 'prop-types';
import theme from '../util/theme';

// MUI Stuff
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
//slider
import Slider from '@material-ui/core/Slider';
import Input from '@material-ui/core/Input';
import Icon from '../icons/pin.svg';
import loadingIcon from '../icons/loading.png';

//components
import Post from '../components/post/Post';
import PostSkeleton from '../util/postSkeleton';
import Grid from '@material-ui/core/Grid';
import Autocomplete from '../components/post/autocomplete';

// Redux
import { connect } from 'react-redux';
import { findPosts, findPostByLocation } from '../redux/actions/dataActions';

//map
import { Map, Marker, GoogleApiWrapper } from 'google-maps-react';

const styles = () => ({
	...theme,
	root: {
		width: 250
	},
	input: {
		width: 42
	},
	button: {
		margin: '10 auto',
		marginBotton: 50
	},
	textField: {
		width: '70%',
		margin: '10 auto'
	},
	form1: {
		textAlign: 'center',
		marginBotton: 50
	},
	radioGroup: {
		textAlign: 'center',
		width: '100%',
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center'
	},
	radio: {
		padding: 10,
		width: '100%',
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center'
	},
	mapContainer: {
		width: '100%',
		height: 750
	},
	autocomplete: {
		width: '70%',
		margin: '0 auto'
	}
});

export class search extends Component {
	constructor() {
		super();
		this.state = {
			searchName: '',
			handleParam: null,
			searchType: 'name',
			distance: 50,
			lat: 41,
			lng: -87,
			zoom: 3,
			location: ''
		};
	}

	handleSliderChange = (event, newValue) => {
		this.setState({
			distance: newValue
		});
	};

	handleInputChange = (event) => {
		this.setValue(event.target.value === '' ? '' : Number(event.target.value));
	};

	handleSubmit = (event) => {
		event.preventDefault();
		let search = this.state.searchName;
		this.props.findPosts(search);
		this.setState({
			searchName: '',
			zoom: 6
		});
	};

	handleSearch = (event) => {
		event.preventDefault();
		let searchData = {
			lat: this.state.lat,
			lng: this.state.lng,
			distance: this.state.distance
		};
		this.props.findPostByLocation(searchData);
		this.setState({
			searchName: '',
			zoom: 6
		});
	};

	myCallback = (data) => {
		this.setState({
			location: data.location,
			lat: data.lat,
			lng: data.lng
		});
		this.setState({
			zoom: 6
		});
	};

	onMarkerClick = (post) => {
		this.props.history.push(`/users/${post.userHandle}/post/${post.postId}`);
	};

	handleChange = (event) => {
		this.setState({
			[event.target.name]: event.target.value
		});
	};
	render() {
		const { posts, loading } = this.props.data;
		const { classes } = this.props;
		const style = {
			maxWidth: 1200,
			height: 700
		};

		let Markers = !loading ? (
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
					icon={Icon}></Marker>
			))
		) : (
			<Marker
				icon={loadingIcon}
				label={{
					text: 'LOADING',
					fontSize: '1rem',
					color: 'white'
				}}
				position={{ lat: this.state.lat, lng: this.state.lng }}
			/>
		);

		let recentPostsMarkup = !loading ? (
			posts
				.slice(0, this.state.showitems)
				.map((post) => <Post key={post.postId} post={post} />)
		) : (
			<PostSkeleton />
		);
		let searchBar;
		if (this.state.searchType === 'name') {
			searchBar = (
				<form noValidate onSubmit={this.handleSubmit} className={classes.form}>
					<TextField
						id='name'
						name='searchName'
						type='name'
						label='Search by name'
						className={classes.textField}
						value={this.state.searchName}
						onChange={this.handleChange}
						placeholder='Enter a name'
						fullWidth
						rows='2'
						onSubmit={this.handleSubmit}
					/>

					<p></p>
					<div className={classes.form1}>
						<Button
							type='submit'
							variant='contained'
							color='primary'
							className={classes.button}
							disabled={loading}>
							Search
							{loading && (
								<CircularProgress size={30} className={classes.progress} />
							)}
						</Button>
						<div></div>
					</div>
					<p></p>
				</form>
			);
		}
		if (this.state.searchType === 'location') {
			searchBar = (
				<div>
					<div className={classes.autocomplete}>
						<Autocomplete callbackFromParent={this.myCallback.bind(this)} />
					</div>
					<form
						noValidate
						onSubmit={this.handleSearch}
						className={classes.form}>
						<div className={classes.radio}>
							<div className={classes.root}>
								<Grid container spacing={2} alignItems='center'>
									<Grid item xs>
										{this.state.location}
										<Slider
											value={this.state.distance}
											onChange={this.handleSliderChange}
											aria-labelledby='input-slider'
											min={0}
											max={999}
										/>{' '}
									</Grid>
								</Grid>
								<Input
									className={classes.input}
									value={this.state.distance}
									margin='dense'
									onChange={this.handleInputChange}
									onBlur={this.handleBlur}
									inputProps={{
										step: 1,
										min: 0,
										max: 999,
										type: 'number',
										'aria-labelledby': 'input-slider'
									}}
								/>{' '}
								Miles
							</div>
						</div>
						<div className={classes.form1}>
							<Button
								type='submit'
								variant='contained'
								color='primary'
								className={classes.button}
								disabled={loading}>
								Search
								{loading && (
									<CircularProgress size={30} className={classes.progress} />
								)}
							</Button>
							<div></div>
						</div>
						<p></p>
					</form>
					<div className={classes.mapContainer}>
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
								lat: this.state.lat,
								lng: this.state.lng
							}}
							center={{
								lat: this.state.lat,
								lng: this.state.lng
							}}
							onClick={this.onMapClicked}
							zoom={this.state.zoom}>
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

		return (
			<div>
				<FormControl component='fieldset' className={classes.radioGroup}>
					<FormLabel component='legend'>Search by</FormLabel>
					<RadioGroup
						className={classes.radio}
						row
						aria-label='position'
						name='position'
						defaultValue='top'
						onClick={this.handleChange}>
						<FormControlLabel
							value='name'
							control={<Radio color='primary' />}
							label='Name'
							name='searchType'
							labelPlacement='top'
						/>
						<FormControlLabel
							value='location'
							control={<Radio color='primary' />}
							label='Location'
							labelPlacement='top'
							name='searchType'
						/>
					</RadioGroup>
				</FormControl>
				{searchBar}
				<Grid container>
					<Grid item sm={12} xs={12}>
						{recentPostsMarkup}
					</Grid>
				</Grid>
			</div>
		);
	}
}

search.propTypes = {
	findPostByLocation: PropTypes.func.isRequired,
	findPosts: PropTypes.func.isRequired,
	classes: PropTypes.object.isRequired,
	data: PropTypes.object.isRequired
};

const mapStateToProps = (state) => ({
	user: state.user,
	data: state.data
});

const WrappedContainer = GoogleApiWrapper({
	apiKey: 'AIzaSyDj_9odVBkDDQJwwvudv1Buf6s-KCLomME'
})(search);

export default connect(mapStateToProps, { findPosts, findPostByLocation })(
	withStyles(styles)(WrappedContainer)
);
