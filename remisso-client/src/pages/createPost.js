import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import MyButton from '../util/MyButton';
import AddIcon from '@material-ui/icons/Add';

export class createpost extends Component {
	render() {
		const { authenticated } = this.props;
		return (
			<div>
				<h3 style={{ margin: '15%' }}>
					Please create a posting in a calm and professional manor. Flamming and
					vulgar posts will be removed. Remember, this data will be showing up
					on search results.
				</h3>
				<div style={{ textAlign: 'center' }}>
					{authenticated ? (
						<Link to='/posts/createpost'>
							<MyButton tip='Post an account of what happened'>
								<AddIcon /> Create a new post
							</MyButton>
						</Link>
					) : (
						<Link to='/login'>
							<MyButton tip='Post an account of what happened'>
								<AddIcon /> Create a new post
							</MyButton>
						</Link>
					)}
				</div>
			</div>
		);
	}
}

const mapStateToProps = (state) => ({
	authenticated: state.user.authenticated
});

export default connect(mapStateToProps)(createpost);
