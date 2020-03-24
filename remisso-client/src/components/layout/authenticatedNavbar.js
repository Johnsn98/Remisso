import React from 'react';
import Link from 'react-router-dom/Link';
import '../App.css';

//MUI
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import { withStyles } from '@material-ui/core/styles';

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

export default function authenticatedNavbar() {
	const [value, setValue] = React.useState(0);
	return (
		<div>
			<AppBar style={{ background: '#191A1A' }}>
				<Toolbar className='nav-container'>
					<BottomNavigation
						value={value}
						onChange={(event, newValue) => {
							setValue(newValue);
						}}
						showLabels>
						<MyBottomNavigationAction label='Home' component={Link} to='/' />

						<MyBottomNavigationAction
							label='Posts'
							component={Link}
							to='/posts'
							size='large'
						/>
						<MyBottomNavigationAction
							label='Search'
							component={Link}
							to='/search'
						/>
						<MyBottomNavigationAction
							label='Signup'
							component={Link}
							to='/Signup'
						/>
					</BottomNavigation>
				</Toolbar>
			</AppBar>
		</div>
	);
}
