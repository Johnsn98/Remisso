import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import './App.css';

//Mui
import { ThemeProvider as MuiThemeProvider } from '@material-ui/core/styles';
import createMuiTheme from '@material-ui/core/styles/createMuiTheme';

// Pages
import home from './pages/home';
import posts from './pages/posts';
import login from './pages/login';
import signup from './pages/signup';

// Components
import Navbar from './components/Navbar';
import themeObject from './util/theme';

const theme = createMuiTheme(themeObject);

class App extends Component {
	render() {
		return (
			<MuiThemeProvider theme={theme}>
				<div className='App'>
					<Router>
						<Navbar />
						<div className='container'>
							<Switch>
								<Route exact path='/' component={home} />
								<Route exact path='/posts' component={posts} />
								<Route exact path='/login' component={login} />
								<Route exact path='/signup' component={signup} />
							</Switch>
						</div>
					</Router>
				</div>
			</MuiThemeProvider>
		);
	}
}
export default App;