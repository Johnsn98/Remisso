import React, { Fragment } from 'react';
import NoImg from '../icons/logo.png';
import PropTypes from 'prop-types';
// MUI
import Card from '@material-ui/core/Card';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import CircularProgress from '@material-ui/core/CircularProgress';

import withStyles from '@material-ui/core/styles/withStyles';
import theme from './theme';

const styles = () => ({
	...theme,
	card: {
		display: 'flex',
		marginBottom: 20
	},
	cardContent: {
		width: '100%',
		flexDirection: 'column',
		padding: 25
	},
	cover: {
		minWidth: 200,
		objectFit: 'cover'
	},
	handle: {
		width: 60,
		height: 18,
		marginBottom: 7
	},
	date: {
		height: 14,
		width: 100,
		marginBottom: 10
	},
	fullLine: {
		height: 15,
		width: '90%',
		marginBottom: 10
	},
	halfLine: {
		height: 15,
		width: '50%',
		marginBottom: 10
	},
	progress: {
		padding: 20
	}
});

const PostSkeleton = (props) => {
	const { classes } = props;

	const content = Array.from({ length: 3 }).map((item, index) => (
		<Card className={classes.card} key={index}>
			<CardMedia className={classes.cover}>
				<CircularProgress size={100} className={classes.progress} />
			</CardMedia>
			<CardContent className={classes.cardContent}>
				...
				<div className={classes.handle} />
				<div className={classes.date} />
				<div className={classes.fullLine} />
				<div className={classes.fullLine} />
				<div className={classes.halfLine} />
			</CardContent>
		</Card>
	));

	return <Fragment>{content}</Fragment>;
};

PostSkeleton.propTypes = {
	classes: PropTypes.object.isRequired
};

export default withStyles(styles)(PostSkeleton);
