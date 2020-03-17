import React, { Component } from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import { Link } from 'react-router-dom';

//components
import MyButton from '../../util/MyButton';
import DeletePost from './DeletePost';
import PostDialog from './PostDialog';
import LikeButton from './LikeButton';
import Grid from '@material-ui/core/Grid';

import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

// MUI Stuff
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';

// Icons
import ChatIcon from '@material-ui/icons/Chat';
import FacebookIcon from '@material-ui/icons/Facebook';
import InstagramIcon from '@material-ui/icons/Instagram';
import LinkIcon from '@material-ui/icons/Link';

// Redux
//import { connect } from 'react-redux';

const styles = {
	card: {
		position: 'relative',
		display: 'flex',
		marginBottom: 20
	},
	media: {
		width: '100%',
		minHeight: 300
	},
	content: {
		minWidth: 200,
		padding: 20
	},
	user: {
		color: '#546E79',
		fontWeight: 400
	},
	name: {
		color: '#546E79',
		fontSize: '2rem',
		fontWeight: 400
	},
	bold: {
		fontWeight: 'bold',
		color: '#2C2C2C'
	},
	link: {
		fontSize: '.8rem',

		display: 'inline-block'
	},
	root: {
		flexGrow: 1
	},
	date: {
		fontSize: '.5rem',
		color: 'gray',
		paddingLeft: 10
	},
	underline: {
		borderBottom: '1px solid lightgray',
		width: '100%'
	}
};

class Post extends Component {
	render() {
		dayjs.extend(relativeTime);
		const {
			classes,
			post: {
				bodyAccount,
				bodyResolution,
				createdAt,
				userHandle,
				postId,
				likeCount,
				commentCount,
				imgURL,
				name,
				facebookLink,
				instagramLink,
				otherLink
			}
		} = this.props;

		function FacebookLink() {
			if (facebookLink)
				return (
					<a className={classes.link} href={facebookLink}>
						<MyButton tip='View Facebook page'>
							<FacebookIcon color='primary' />
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
							<LinkIcon color='theme.palette.primary.light' />
						</MyButton>{' '}
						{otherLink}
					</a>
				);
			return <div></div>;
		}

		const deleteButton = <DeletePost postId={postId} />;

		return (
			<Card className={classes.card}>
				<div className={classes.root}>
					<Grid container spacing={3}>
						<Grid item xs={12} sm={4}>
							<CardMedia
								className={classes.media}
								image={imgURL}
								title={name}
							/>
						</Grid>
						<Grid item xs={12} sm={8}>
							<CardContent className={classes.content}>
								<Typography
									variant='h1'
									component={Link}
									to={`/users/${userHandle}`}
									color='primary'
									className={classes.name}>
									{name}
								</Typography>
								<div className={classes.date}>{createdAt}</div>
								<FacebookLink /> <InstagramLink /> <OtherLink />
								{deleteButton}
								<div></div>
								<Typography
									variant='body2'
									color='textSecondary'
									component={Link}
									to={`/users/${userHandle}`}
									color='primary'
									className={classes.user}>
									Posted by: {userHandle}
								</Typography>
								<Typography variant='body1'>
									{' '}
									<div className={classes.bold}>Account of what happened:</div>
									<div className={classes.underline}>{bodyAccount}</div>
								</Typography>
								<Typography variant='body1'>
									{' '}
									<div className={classes.bold}>How can it be resolved:</div>
									<div className={classes.underline}>{bodyResolution}</div>
								</Typography>
								<LikeButton postId={postId} />
								<span>{likeCount} Approval</span>
								<MyButton tip='comments'>
									<ChatIcon color='secondary' />
								</MyButton>
								<span>{commentCount} comments</span>
							</CardContent>
						</Grid>
					</Grid>
				</div>
			</Card>
		);
	}
}

export default withStyles(styles)(Post);
