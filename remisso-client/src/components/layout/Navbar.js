import React, { Component, Fragment } from 'react';

import '../../App.css';
import PropTypes from 'prop-types';

//redux
import { connect } from 'react-redux';
import { logoutUser } from '../../redux/actions/userActions';

//MUI
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import { withStyles } from '@material-ui/core/styles';

import Notifications from '../Notifications';

import BottomNavigation from '@material-ui/core/BottomNavigation';
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction';

const MyBottomNavigationAction = withStyles({
	root: {
		color: '#ededed',
		fontFamily: 'Helvetica Neue',
		minWidth: 50,
		fontWeight: 100,
		background: '#191A1A',
		'&.Mui-selected': {
			color: 'white',
			fontWeight: 400
		}
	}
})(BottomNavigationAction);

class Navbar extends Component {
	state = {
		value: 'home'
	};

	handleChange = (event, value) => {
		this.setState({ value });
	};

	handleLogout = () => {
		this.props.logoutUser();
	};

	render() {
		let Link = require('react-router-dom').Link;
		const { authenticated } = this.props;
		const { value } = this.state;
		return (
			<div>
				<AppBar style={{ background: '#191A1A' }}>
					<Toolbar className='nav-container'>
						{authenticated ? (
							<Fragment>
								<BottomNavigation
									showLabels
									value={value}
									onChange={this.handleChange}>
									<MyBottomNavigationAction
										label='Home'
										component={Link}
										to='/'
										value='home'
									/>
									<MyBottomNavigationAction
										label='Posts'
										component={Link}
										to='/posts'
										size='large'
										value='posts'
									/>
									<MyBottomNavigationAction
										label='Search'
										component={Link}
										to='/search'
										value='search'
									/>
									<MyBottomNavigationAction
										label='Logout'
										onClick={this.handleLogout}
										value='logout'
									/>
									<Notifications />
								</BottomNavigation>
							</Fragment>
						) : (
							<Fragment>
								<BottomNavigation
									showLabels
									value={value}
									onChange={this.handleChange}>
									<MyBottomNavigationAction
										label='Home'
										component={Link}
										to='/'
										value='home'
									/>

									<MyBottomNavigationAction
										label='Posts'
										component={Link}
										to='/posts'
										size='large'
										value='posts'
									/>
									<MyBottomNavigationAction
										label='Search'
										component={Link}
										to='/search'
										value='search'
									/>
									<MyBottomNavigationAction
										label='Signup'
										component={Link}
										to='/Signup'
										value='signup'
									/>
								</BottomNavigation>
							</Fragment>
						)}
					</Toolbar>
				</AppBar>
			</div>
		);
	}
}

Navbar.propTypes = {
	authenticated: PropTypes.bool.isRequired,
	logoutUser: PropTypes.func.isRequired
};

const mapStateToProps = (state) => ({
	authenticated: state.user.authenticated
});

const mapActionsToProps = { logoutUser };

export default connect(mapStateToProps, mapActionsToProps)(Navbar);
