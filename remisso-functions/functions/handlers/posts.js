const { db } = require('../utilities/admin');

exports.getAllPosts = (req, res) => {
	db.collection('Posts')
		.orderBy('createdAt', 'desc')
		.limit(50)
		.get()
		.then((data) => {
			let posts = [];
			data.forEach((doc) => {
				posts.push({
					postId: doc.id,
					bodyAccount: doc.data().bodyAccount,
					userHandle: doc.data().userHandle,
					userImage: doc.data().userImage,
					createdAt: doc.data().createdAt,
					name: doc.data().name,
					bodyResolution: doc.data().bodyResolution,
					facebookLink: doc.data().facebookLink,
					instagramLink: doc.data().instagramLink,
					otherLink: doc.data().otherLink,
					imgURL: doc.data().imgURL,
					location: doc.data().location,
					lat: doc.data().lat,
					lng: doc.data().lng,
					commentCount: doc.data().commentCount,
					likeCount: doc.data().likeCount
				});
			});
			return res.json(posts);
		})
		.catch((err) => console.error(err));
};

exports.postOnePost = (req, res) => {
	let image;
	if (req.body.name === '') {
		return res.status(400).json({ body: 'Name must not be empty' });
	}
	if (req.body.bodyAccount === '') {
		return res
			.status(400)
			.json({ body: 'Account of what happened is required' });
	}
	if (req.body.bodyResolution === '') {
		return res
			.status(400)
			.json({ body: 'Resolution is required for every post' });
	}
	if (req.body.imgURL === null || req.body.imgURL === '') {
		image =
			'https://firebasestorage.googleapis.com/v0/b/remisso-website.appspot.com/o/default.png?alt=media&token=63324f4c-4891-4527-8c5b-e79b25f23184';
	} else {
		image = req.body.imgURL;
	}
	let splitName = ['', '', '', ''];
	lowerName = req.body.name.toLowerCase();
	splitName = lowerName.split(' ');

	if (!splitName[1]) {
		splitName[1] = '';
	}
	if (!splitName[2]) {
		splitName[2] = '';
	}
	let optionA = '';
	let optionB = '';
	let optionC = '';
	let optionD = '';
	let optionE = '';
	let optionF = '';
	let optionG = '';
	let optionH = '';

	optionA = splitName[0];
	optionB = splitName[1];
	optionC = `${splitName[0]} ${splitName[1]}`;
	optionD = `${splitName[1]} ${splitName[0]}`;
	optionE = `${splitName[2]}`;
	optionF = `${splitName[0]} ${splitName[1]} ${splitName[2]}`;
	optionG = `${splitName[0]} ${splitName[2]}`;
	optionH = `"${splitName[1]}"`;
	optionI = `"${splitName[2]}"`;

	let key = [
		optionA,
		optionB,
		optionC,
		optionD,
		optionE,
		optionF,
		optionG,
		optionH,
		optionI
	];
	let keywords = req.body.bodyAccount.split(' ');
	let hypotenuse = Math.hypot(req.body.lat, req.body.lng);
	newPost = {
		name: req.body.name,
		key: key,
		keywords: keywords,
		bodyAccount: req.body.bodyAccount,
		bodyResolution: req.body.bodyResolution,
		createdAt: new Date().toISOString(),
		facebookLink: req.body.facebookLink,
		instagramLink: req.body.instagramLink,
		otherLink: req.body.otherLink,
		userHandle: req.user.handle,
		imgURL: image,
		location: req.body.location,
		lat: req.body.lat,
		lng: req.body.lng,
		latlng: [req.body.lat, req.body.lng],
		hypotenuse: hypotenuse,
		commentCount: 0,
		likeCount: 0
	};

	db.collection('Posts')
		.add(newPost)
		.then((doc) => {
			const resPost = newPost;
			resPost.postId = doc.id;
			return res.json(resPost);
		})
		.catch((err) => {
			res.status(500).json({ error: 'something went wrong' });
			console.error(err);
		});
};

// search query
exports.findPost = (req, res) => {
	name = req.params.postName.toLowerCase();
	db.collection('Posts')
		.where('key', 'array-contains', name)
		.limit(25)
		.get()
		.then((data) => {
			let posts = [];
			data.forEach((doc) => {
				posts.push({
					postId: doc.id,
					bodyAccount: doc.data().bodyAccount,
					userHandle: doc.data().userHandle,
					userImage: doc.data().userImage,
					createdAt: doc.data().createdAt,
					name: doc.data().name,
					bodyResolution: doc.data().bodyResolution,
					facebookLink: doc.data().facebookLink,
					instagramLink: doc.data().instagramLink,
					otherLink: doc.data().otherLink,
					imgURL: doc.data().imgURL,
					location: doc.data().location,
					lat: doc.data().lat,
					lng: doc.data().lng,
					commentCount: doc.data().commentCount,
					likeCount: doc.data().likeCount
				});
			});
			return res.json(posts);
		})
		.catch((err) => console.error(err));
};

// search query by location
exports.findPostByLocation = (req, res) => {
	distance = req.body.distance / 69;
	hypot = Math.hypot(req.body.lat, req.body.lng);
	db.collection('Posts')
		.where('hypotenuse', '>=', hypot - distance)
		.where('hypotenuse', '<=', hypot + distance)
		.limit(50)
		.get()
		.then((data) => {
			let posts = [];
			data.forEach((doc) => {
				posts.push({
					postId: doc.id,
					bodyAccount: doc.data().bodyAccount,
					userHandle: doc.data().userHandle,
					userImage: doc.data().userImage,
					createdAt: doc.data().createdAt,
					name: doc.data().name,
					bodyResolution: doc.data().bodyResolution,
					facebookLink: doc.data().facebookLink,
					instagramLink: doc.data().instagramLink,
					otherLink: doc.data().otherLink,
					imgURL: doc.data().imgURL,
					location: doc.data().location,
					lat: doc.data().lat,
					lng: doc.data().lng,
					commentCount: doc.data().commentCount,
					likeCount: doc.data().likeCount
				});
			});
			return res.json(posts);
		})
		.catch((err) => console.error(err));
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
