import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import './App.css';
import './fonts/Hikou.otf';

//Mui
import { ThemeProvider as MuiThemeProvider } from '@material-ui/core/styles';
import createMuiTheme from '@material-ui/core/styles/createMuiTheme';

// Pages
import home from './pages/home';
import posts from './pages/posts';
import search from './pages/search';
import login from './pages/login';
import signup from './pages/signup';
import createpost from './pages/createPost';
import user from './pages/user';

// Components
import Navbar from './components/layout/Navbar';
import themeObject from './util/theme';
import jwtDecode from 'jwt-decode';
import AuthRoute from './util/AuthRoute';

// Redux
import { Provider } from 'react-redux';
import store from './redux/store';
import { SET_AUTHENTICATED } from './redux/types';
import { logoutUser, getUserData } from './redux/actions/userActions';

//axios
import axios from 'axios';

const theme = createMuiTheme(themeObject);

const token = localStorage.FBIdToken;

if (token) {
	const decodedToken = jwtDecode(token);
	if (decodedToken.exp * 1000 < Date.now()) {
		store.dispatch(logoutUser());
		window.location.href = '/login';
	} else {
		store.dispatch({ type: SET_AUTHENTICATED });
		axios.defaults.headers.common['Authorization'] = token;
		store.dispatch(getUserData());
	}
}

class App extends Component {
	render() {
		return (
			<MuiThemeProvider theme={theme}>
				<Provider store={store}>
					<div className='App'>
						<Router>
							<Navbar />

							<div className='container'>
								<Switch>
									<Route exact path='/' component={home} />
									<Route exact path='/posts' component={posts} />
									<Route exact path='/posts/createpost' component={posts} />
									<Route exact path='/users/:handle' component={user} />
									<AuthRoute exact path='/login' component={login} />
									<AuthRoute exact path='/signup' component={signup} />
									<Route exact path='/createpost' component={createpost} />
									<Route exact path='/search' component={search} />
									<Route
										exact
										path='/users/:handle/post/:postId'
										component={user}
									/>
								</Switch>
							</div>
						</Router>
					</div>
				</Provider>
			</MuiThemeProvider>
		);
	}
}
export default App;
