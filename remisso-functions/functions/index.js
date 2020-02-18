const functions = require('firebase-functions');
const admin = require('firebase-admin');
const app = require('express')();

// Service Account key
var serviceAccount = require('./Account/serviceAccountKey.json');

admin.initializeApp({
	credential: admin.credential.cert(serviceAccount),
	databaseURL: 'https://remisso-website.firebaseio.com/'
});

//Firebase configuration App
var firebaseConfig = {
	apiKey: 'AIzaSyAIGmi3SjqgFeEHkNB9J5SQx6kCok15j5I',
	authDomain: 'remisso-website.firebaseapp.com',
	databaseURL: 'https://remisso-website.firebaseio.com',
	projectId: 'remisso-website',
	storageBucket: 'remisso-website.appspot.com',
	messagingSenderId: '165797964467',
	appId: '1:165797964467:web:16c438d02e5367e5b29ec6',
	measurementId: 'G-C4TT7V9R9Y'
};

const firebase = require('firebase');
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

const db = admin.firestore();

// Get all posts function
app.get('/posts', (req, res) => {
	db.collection('Posts')
		.orderBy('createdAt', 'desc')
		.get()
		.then((data) => {
			let posts = [];
			data.forEach((doc) => {
				posts.push({
					postId: doc.id,
					body: doc.data().body,
					userHandle: doc.data().userHandle,
					createdAt: doc.data().createdAt
				});
			});
			return res.json(posts);
		})
		.catch((err) => console.error(err));
});

// Find post by name
app.get('/findpost/:postName', (req, res) => {
	name = req.params.postName;
	if (name === undefined) {
		name = 'Pinkman';
	}
	if (name === 'undefined') {
		name = 'Pinkman';
	}
	db.collection('Posts')
		.where('name', '==', name)
		.get()
		.then((data) => {
			let searchResults = [];
			data.forEach((doc) => {
				searchResults.push(doc.data());
			});
			return res.json(searchResults);
		})
		.catch((err) => console.error(err));
});

const FBAuth = (req, res, next) => {
	let idToken;
	if (
		req.headers.authorization &&
		req.headers.authorization.startsWith('Bearer ')
	) {
		idToken = req.headers.authorization.split('Bearer ')[1];
	} else {
		return res.status(403).json({ error: 'Unauthorized' });
	}

	admin
		.auth()
		.verifyIdToken(idToken)
		.then((decodedToken) => {
			req.user = decodedToken;
			console.log(decodedToken);

			return db
				.collection('users')
				.where('userId', '==', req.user.uid)
				.limit(1)
				.get();
		})
		.then((data) => {
			req.user.handle = data.docs[0].data().handle;
			return next();
		})
		.catch((err) => {
			console.error('Error verifying token', err);
			return res.status(403).json(err);
		});
};

//Create a post function
app.post('/post', FBAuth, (req, res) => {
	if (req.body.body.trim() == '') {
		return res.status(400).json({ body: 'Body must not be empty' });
	}
	const newPost = {
		name: req.body.name,
		bodyAccount: req.body.bodyAccount,
		bodyResolution: req.body.bodyAccount,
		createdAt: new Date().toISOString(),
		facebookLink: req.body.facebookLink,
		instagramLink: req.body.instagramLink,
		otherLink: req.body.otherLink,
		userHandle: req.body.userHandle
	};

	db.collection('Posts')
		.add(newPost)
		.then((doc) => {
			return res.json({
				Message: `${req.body.name} added to Remisso`
			});
		})
		.catch((err) => {
			res.status(500).json({ error: 'failure code blue' });
			console.error(err);
		});
});

//is email helper function
const isEmail = (email) => {
	const regEx = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	if (email.match(regEx)) return true;
	else return false;
};

//is empty helper function
const isEmpty = (string) => {
	if (string.trim() === '') return true;
	else return false;
};

//signup route
app.post('/signup', (req, res) => {
	const newUser = {
		email: req.body.email,
		password: req.body.password,
		confirmPassword: req.body.confirmPassword,
		handle: req.body.handle
	};

	//Validate User data
	let errors = {};

	if (isEmpty(newUser.email)) {
		errors.email = 'Email must not be empty';
	} else if (!isEmail(newUser.email)) {
		errors.email = 'Valid email address is required';
	}

	if (isEmpty(newUser.password)) errors.password = 'Cannot be empty';
	if (newUser.password !== newUser.confirmPassword)
		errors.confirmPassword = 'Passwords do not match';
	if (isEmpty(newUser.handle)) errors.password = 'Cannot be empty';

	if (Object.keys(errors).length > 0) return res.status(400).json(errors);

	let token, userId;
	db.doc(`/users/${newUser.handle}`)
		.get()
		.then((doc) => {
			if (doc.exists) {
				return res.status(400).json({ handle: 'this handle is already taken' });
			} else {
				return firebase
					.auth()
					.createUserWithEmailAndPassword(newUser.email, newUser.password);
			}
		})
		.then((data) => {
			userId = data.user.uid;
			return data.user.getIdToken();
		})
		.then((idToken) => {
			token = idToken;
			const userCredentials = {
				handle: newUser.handle,
				email: newUser.email,
				createdAt: new Date().toISOString(),
				userId: userId
			};
			return db.doc(`/users/${newUser.handle}`).set(userCredentials);
		})
		.then(() => {
			return res.status(201).json({ token });
		})
		.catch((err) => {
			console.error(err);
			if (err.code === 'auth/email-already-in-use') {
				return res.status(400).json({ email: 'email already in use' });
			} else {
				return res.status(500).json({ error: err.code });
			}
		});
});

//Login Route

app.post('/login', (req, res) => {
	const user = {
		email: req.body.email,
		password: req.body.password
	};

	let errors = {};

	if (isEmpty(user.email)) errors.email = 'Cannot be empty';
	if (isEmpty(user.password)) errors.password = 'Cannot be empty';

	if (Object.keys(errors).length > 0) return res.status(400).json(errors);

	firebase
		.auth()
		.signInWithEmailAndPassword(user.email, user.password)
		.then((data) => {
			return data.user.getIdToken();
		})
		.then((token) => {
			return res.json({ token });
		})
		.catch((err) => {
			console.error(err);
			if (err.code === 'auth/wrong-password') {
				return res.status(403).json({ general: 'Wrong password or email' });
			}

			return res.status(500).json({ error: err.code });
		});
});

exports.api = functions.https.onRequest(app);
