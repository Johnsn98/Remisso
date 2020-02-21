let db = {
	posts: [
		(name: 'Thomas'),
		(userHandle: 'Nathan'),
		(bodyAccount: 'Account of what happened'),
		(bodyResolution: 'the user would like this to happen'),
		(createdAt: 'date'),
		(facebookLink: 'req.body.facebookLink'),
		(instagramLink: 'req.body.instagramLink'),
		(otherLink: 'req.body.otherLink'),
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
		location: 'Lonodn, UK'
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
