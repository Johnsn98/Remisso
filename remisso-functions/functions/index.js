const functions = require('firebase-functions');
const admin = require('firebase-admin');

var serviceAccount = require('./Account/serviceAccountKey.json');

admin.initializeApp({
	credential: admin.credential.cert(serviceAccount),
	databaseURL: 'https://remisso-website.firebaseio.com/'
});

exports.helloWorld = functions.https.onRequest((request, response) => {
	response.send('Hello, this is remisso');
});

// Get all posts function
exports.getPosts = functions.https.onRequest((req, res) => {
	admin
		.firestore()
		.collection('Posts')
		.get()
		.then((data) => {
			let posts = [];
			data.forEach((doc) => {
				posts.push(doc.data());
			});
			return res.json(posts);
		})
		.catch((err) => console.error(err));
});

// Find post by name
exports.findPost = functions.https.onRequest((req, res, name) => {
	name = req.query.text;
	if (name === undefined) {
		name = 'Pinkman';
	}
	if (name === 'undefined') {
		name = 'Pinkman';
	}
	admin
		.firestore()
		.collection('Posts')
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
exports.createPost = functions.https.onRequest((req, res) => {
	if (req.method !== 'POST') {
		return res.status(400).json({ error: 'Method FAILURE' });
	}
	const newPost = {
		name: req.body.name,
		bodyAccount: req.body.bodyAccount,
		bodyResolution: req.body.bodyAccount,
		createdAt: admin.firestore.Timestamp.fromDate(new Date()),
		facebookLink: req.body.facebookLink,
		instagramLink: req.body.instagramLink,
		otherLink: req.body.otherLink,
		userHandle: req.body.userHandle
	};

	admin
		.firestore()
		.collection('Posts')
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
