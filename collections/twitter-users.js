TwitterUsers = new Meteor.Collection('twitter-users', {
	schema: new SimpleSchema({
		twitterId : {
			type : Number
		},
		sessionId : {
			type: String
		},
		userData : {
			type: Object,
			blackbox: true
		}
	})
});