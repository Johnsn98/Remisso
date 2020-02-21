const functions = require('firebase-functions');

const app = require('express')();

const FBAuth = require('./utilities/fbAuth');
const { db } = require('./utilities/admin');
const {
	getAllPosts,
	findPost,
	postOnePost,
	postImage,
	getPost,
	commentOnPost,
	likePost,
	unLikePost,
	deletePost
} = require('./handlers/posts');

const {
	signup,
	login,
	uploadImage,
	addUserDetails,
	getAuthenticatedUser,
	getUserDetails,
	markNotificationsRead
} = require('./handlers/users');

// Post Routes
app.get('/posts', getAllPosts);
app.post('/post', FBAuth, postOnePost);
app.get('/post/:postId', getPost);

app.delete('/post/:postId', FBAuth, deletePost);
app.get('/post/:postId/like', FBAuth, likePost);
app.get('/post/:postId/unlike', FBAuth, unLikePost);
app.post('/post/:postId/comment', FBAuth, commentOnPost);

app.get('/findpost/:postName', findPost);
app.post('/post/image', FBAuth, postImage);

// users routes
app.post('/signup', signup);
app.post('/login', login);
app.post('/user/image', FBAuth, uploadImage);
app.post('/user', FBAuth, addUserDetails);
app.get('/user', FBAuth, getAuthenticatedUser);
app.get('/user/:handle', getUserDetails);
app.post('/notifications', FBAuth, markNotificationsRead);

exports.api = functions.https.onRequest(app);

//NOTIFICATIONS
exports.createNotificationOnLike = functions
	.region('us-central1')
	.firestore.document(`likes/{id}`)
	.onCreate((snapshot) => {
		return db
			.doc(`/Posts/${snapshot.data().postId}`)
			.get()
			.then((doc) => {
				if (doc.exists) {
					return db.doc(`/notifications/${snapshot.id}`).set({
						createdAt: new Date().toISOString(),
						recipient: doc.data().userHandle,
						sender: snapshot.data().userHandle,
						type: 'like',
						read: false,
						postId: doc.id
					});
				}
				return;
			})
			.catch((err) => console.error({ err }));
	});

exports.createNotificationOnComment = functions
	.region('us-central1')
	.firestore.document('comments/{id}')
	.onCreate((snapshot) => {
		return db
			.doc(`/Posts/${snapshot.data().postId}`)
			.get()
			.then((doc) => {
				if (doc.exists) {
					return db.doc(`/notifications/${snapshot.id}`).set({
						createdAt: new Date().toISOString(),
						recipient: doc.data().userHandle,
						sender: snapshot.data().userHandle,
						type: 'comment',
						read: false,
						postId: doc.id
					});
				}
				return;
			})
			.catch((err) => {
				console.error({ err });
				return;
			});
	});

exports.onUserImageChange = functions
	.region('us-central1')
	.firestore.document('/users/{userId}')
	.onUpdate((change) => {
		console.log(change.before.data());
		console.log(change.after.data());
		if (change.before.data().imageUrl !== change.after.data().imageUrl) {
			console.log('image changed');
			const batch = db.batch();
			return db
				.collection('Posts')
				.where('userHandle', '==', change.before.data().handle)
				.get()
				.then((data) => {
					data.forEach((doc) => {
						const post = db.doc(`/Posts/${doc.id}`);
						batch.update(post, { userImage: change.after.data().imageUrl });
					});
					return batch.commit();
				});
		} else return true;
	});

exports.onPostDeleted = functions
	.region('us-central1')
	.firestore.document(`/Posts/{postId}`)
	.onDelete((snapshot, context) => {
		const postId = context.params.postId;
		const batch = db.batch();
		return db
			.collection('comments')
			.where('postId', '==', postId)
			.get()
			.then((data) => {
				data.forEach((doc) => {
					batch.delete(db.doc(`/comments/${doc.id}`));
				});
				return db
					.collection('likes')
					.where('postId', '==', postId)
					.get();
			})
			.then((data) => {
				data.forEach((doc) => {
					batch.delete(db.doc(`/likes/${doc.id}`));
				});
				return db
					.collection('notifications')
					.where('postId', '==', postId)
					.get();
			})
			.then((data) => {
				data.forEach((doc) => {
					batch.delete(db.doc(`/notifications/${doc.id}`));
				});
				return batch.commit();
			})
			.catch((err) => console.error(err));
	});
