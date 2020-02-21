const admin = require('firebase-admin');

// Service Account key
var serviceAccount = require('../Account/serviceAccountKey.json');

admin.initializeApp({
	credential: admin.credential.cert(serviceAccount),
	databaseURL: 'https://remisso-website.firebaseio.com/',
	storageBucket: 'remisso-website.appspot.com'
});

const db = admin.firestore();

module.exports = { admin, db };
