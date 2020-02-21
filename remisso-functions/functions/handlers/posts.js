const { db, admin } = require('../utilities/admin');

exports.getAllPosts = (req, res) => {
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
};

exports.postOnePost = (req, res) => {
	if (req.body.body.trim() === '') {
		return res.status(400).json({ body: 'Body must not be empty' });
	}

	newPost = {
		name: req.body.name,
		bodyAccount: req.body.bodyAccount,
		bodyResolution: req.body.bodyAccount,
		createdAt: new Date().toISOString(),
		facebookLink: req.body.facebookLink,
		instagramLink: req.body.instagramLink,
		otherLink: req.body.otherLink,
		userHandle: req.user.handle,
		imgURL: 'default'
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
};

exports.findPost = (req, res) => {
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
};

//post image upload
exports.postImage = (req, res) => {
	const BusBoy = require('busboy');
	const path = require('path');
	const os = require('os');
	const fs = require('fs');

	const busboy = new BusBoy({ headers: req.headers });

	let imageToBeUploaded = {};
	let imageFileName;

	busboy.on('file', (fieldname, file, filename, encoding, mimetype) => {
		console.log(fieldname, file, filename, encoding, mimetype);

		const fileSize = req.headers['content-length'] / 1024;
		console.log('File size: ' + `${fileSize}` + 'KB');
		if (mimetype !== 'image/jpeg' && mimetype !== 'image/png') {
			return res.status(400).json({ error: 'Wrong file type submitted' });
		}
		if (fileSize > 600) {
			return res.status(400).json({ error: 'Max file size is 500KB' });
		}

		// my.image.png => ['my', 'image', 'png']
		const imageExtension = filename.split('.')[filename.split('.').length - 1];
		// 32756238461724837.png
		imageFileName = `${Math.round(
			Math.random() * 1000000000000
		).toString()}.${imageExtension}`;
		const filepath = path.join(os.tmpdir(), imageFileName);
		imageToBeUploaded = { filepath, mimetype };
		file.pipe(fs.createWriteStream(filepath));
	});
	busboy.on('finish', () => {
		admin
			.storage()
			.bucket()
			.upload(imageToBeUploaded.filepath, {
				resumable: false,
				metadata: {
					metadata: {
						contentType: imageToBeUploaded.mimetype
					}
				}
			})
			.then(() => {
				return res.json({
					message: 'image uploaded successfully'
				});
			})
			.catch((err) => {
				console.error(err);
				return res.status(500).json({ error: 'something went wrong,' });
			});
	});
	busboy.end(req.rawBody);
};

//fetch post
exports.getPost = (req, res) => {
	let postData = {};
	db.doc(`/Posts/${req.params.postId}`)
		.get()
		.then((doc) => {
			if (!doc.exists) {
				return res.status(404).json({ error: 'post not found' });
			}
			postData = doc.data();
			postData.postId = doc.id;
			return db
				.collection('comments')
				.orderBy('createdAt', 'desc')
				.where('postId', '==', req.params.postId)
				.get();
		})
		.then((data) => {
			postData.comments = [];
			data.forEach((doc) => {
				postData.comments.push(doc.data());
			});
			return res.json(postData);
		})
		.catch((err) => {
			console.error(err);
			res.status(500).json({ error: err.code });
		});
};

// Comment on a post
exports.commentOnPost = (req, res) => {
	if (req.body.body.trim() === '')
		return res.status(400).json({ error: 'No comment' });
	var ImageUrl =
		'https://firebasestorage.googleapis.com/v0/b/social-media-app-f4e13.appspot.com/o/defaultProfile.jpg?alt=media&token=095ea752-bfdd-4f20-a3b4-24921a42af57';
	if (req.user.imageUrl) {
		ImageUrl = req.user.imageUrl;
	}

	const newComment = {
		body: req.body.body,
		createdAt: new Date().toISOString(),
		postId: req.params.postId,
		userHandle: req.user.handle,
		userImage: ImageUrl
	};

	db.doc(`/Posts/${req.params.postId}`)
		.get()
		.then((doc) => {
			if (!doc.exists) {
				return res.status(404).json({ error: 'Post not found' });
			}
			return doc.ref.update({ commentCount: doc.data().commentCount + 1 });
		})
		.then(() => {
			return db.collection('comments').add(newComment);
		})
		.then(() => {
			return res.json(newComment);
		})
		.catch((err) => {
			console.log(err);
			res.status(500).json({ error: 'Danger to the manifold' });
		});
};

// Like a post
exports.likePost = (req, res) => {
	const likeDocument = db
		.collection('likes')
		.where('userHandle', '==', req.user.handle)
		.where('postId', '==', req.params.postId)
		.limit(1);

	const postDocument = db.doc(`/Posts/${req.params.postId}`);

	let postData = {};

	postDocument
		.get()
		.then((doc) => {
			if (doc.exists) {
				postData = doc.data();
				postData.postId = doc.id;
				return likeDocument.get();
			} else {
				return res.status(404).json({ error: 'Post not found' });
			}
		})
		.then((data) => {
			if (data.empty) {
				return db
					.collection('likes')
					.add({
						postId: req.params.postId,
						userHandle: req.user.handle
					})
					.then(() => {
						postData.likeCount++;
						return postDocument.update({ likeCount: postData.likeCount });
					})
					.then(() => {
						return res.json(postData);
					});
			} else {
				return res.status(400).json({ error: 'Already liked' });
			}
		})
		.catch((err) => {
			console.error(err);
			res.status(500).json({ error: err.code });
		});
};

// Unlike Post
exports.unLikePost = (req, res) => {
	const likeDocument = db
		.collection('likes')
		.where('userHandle', '==', req.user.handle)
		.where('postId', '==', req.params.postId)
		.limit(1);

	const postDocument = db.doc(`/Posts/${req.params.postId}`);

	let postData = {};

	postDocument
		.get()
		.then((doc) => {
			if (doc.exists) {
				postData = doc.data();
				postData.postId = doc.id;
				return likeDocument.get();
			} else {
				return res.status(404).json({ error: 'Post not found' });
			}
		})
		.then((data) => {
			if (data.empty) {
				return res.status(400).json({ error: 'Not liked' });
			} else {
				return db
					.doc(`/likes/${data.docs[0].id}`)
					.delete()
					.then(() => {
						postData.likeCount--;
						return postDocument.update({ likeCount: postData.likeCount });
					})
					.then(() => {
						return res.json(postData);
					});
			}
		})
		.catch((err) => {
			console.error(err);
			res.status(500).json({ error: err.code });
		});
};

// Delete Post
exports.deletePost = (req, res) => {
	const document = db.doc(`/Posts/${req.params.postId}`);
	document
		.get()
		.then((doc) => {
			if (!doc.exists) {
				return res.status(404).json({ error: 'Post not found' });
			}
			if (doc.data().userHandle !== req.user.handle) {
				return res.status(403).json({ error: 'Unauthorized' });
			} else {
				return document.delete();
			}
		})
		.then(() => {
			return res.json({ message: 'Your post is gone forever' });
		})
		.catch((err) => {
			console.error(err);
			return res.status(500).json({ error: err.code });
		});
};
