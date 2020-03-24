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
		opacity: '.8',
		'&:hover': {
			opacity: '.99',
			curson: 'pointer'
		}
	},
	imageTitle: {
		position: 'absolute',
		bottom: 10,
		zIndex: 9,
		color: 'white',
		textAlign: 'center',
		width: '100%',
		fontFamily: 'Helvetica Neue',
		fontWeight: '200'
	},
	cardMedia: {
		width: '100%'
	}
});

export class home extends Component {
	componentDidMount() {
		this.props.getPosts();
	}

	render() {
		let Link = require('react-router-dom').Link;
		const { classes } = this.props;

		return (
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
				</Grid>
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

export default connect(mapStateToProps, { getPosts })(withStyles(styles)(home));
