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

//Create a post function
app.post('/post', (req, res) => {
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
				Message: `${req.body.userHandle} added to Remisso`
			});
		})
		.catch((err) => {
			res.status(500).json({ error: 'failure code blue' });
			console.error(err);
		});
});

//signup route
app.post('/signup', (req, res) => {
	const newUser = {
		email: req.body.email,
		password: req.body.password,
		confirmPassword: req.body.confirmPassword,
		handle: req.body.handle
	};

	//Validate data

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

exports.api = functions.https.onRequest(app);
