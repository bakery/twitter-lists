TwitterLists = new Meteor.Collection('twitter-lists', {
	schema: new SimpleSchema({
		twitterId : {
			type : Number
		},
		sessionId : {
			type : String
		},
		listData : {
			type : Object,
			blackbox : true
		}
	})
});