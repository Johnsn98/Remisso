let db = {
	posts: [
			"name": "Nathan",
			"bodyAccount": "He sold me",
			"bodyResolution": "Money back please",
			"facebookLink": "facebook.com/pinkman",
			"instagramLink": "instagram.com/pinkman",
			"otherLink": "pinkman.com",
			"imgURL": "",
			"location": "",
			"lat": 50,
			"lng": 50
		(createdAt: 'date'),
		(likeCount: 4),
		(commentCount: 2)
	],
	users: [
		(userId: 'dh23ggj5h32g543j5gf43'),
		(email: 'user@email.com'),
		(handle: 'user'),
		(createdAt: '2019-03-15T10:59:52.798Z'),
		(imageUrl: 'image/dsfsdkfghskdfgs/dgfdhfgdh'),
		(bio: 'Hello, my name is user, nice to meet you'),
		(whatsapp: '67457456756856'),
		(publicEmail: 'user@email.com'),
		(location: 'Lonodn, UK')
	],
	comments: [
		{
			userHandle: 'user',
			postId: 'kdjsfgdksuufhgkdsufky',
			body: 'nice one mate!',
			createdAt: '2019-03-15T10:59:52.798Z'
		}
	]
};

const userDetails = {
	// Redux data
	credentials: {
		userId: 'N43KJ5H43KJHREW4J5H3JWMERHB',
		email: 'user@email.com',
		handle: 'user',
		createdAt: '2019-03-15T10:59:52.798Z',
		imageUrl: 'image/dsfsdkfghskdfgs/dgfdhfgdh',
		bio: 'Hello, my name is user, nice to meet you',
		location: 'Lonodn, UK',
		publicEmail: 'guihgr@rmail.com',
		whatsapp: '35839675432890677534'
	},
	likes: [
		{
			userHandle: 'user',
			screamId: 'hh7O5oWfWucVzGbHH2pa'
		},
		{
			userHandle: 'user',
			screamId: '3IOnFoQexRcofs5OhBXO'
		}
	]
};
