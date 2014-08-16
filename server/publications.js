Meteor.publish('twitter-users', function(params){
    check(params, {
        sessionId : String
    });

    return TwitterUsers.find({ sessionId : params.sessionId });
});

Meteor.publish('twitter-lists', function(params){
    check(params, {
        sessionId : String
    });

    return TwitterLists.find({ sessionId : params.sessionId });
});