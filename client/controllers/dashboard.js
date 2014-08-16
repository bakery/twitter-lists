DashboardController = RouteController.extend({
    template: 'dashboard',

    waitOn: function () {

        SessionMethod.call('getLists', {}, function(){});

        return [
            SessionPublication.subscribe('twitter-users'),
            SessionPublication.subscribe('twitter-lists')
        ];
    },

    onBeforeAction : function(){
        UserSession.set(this.params._sessionId);
    },

    data: function () {
        var users = TwitterUsers.find({ sessionId : UserSession.get() });

        return {
            sessionId : this.params._sessionId,
            twitterUsers : users,
            twitterLists : TwitterLists.find({ sessionId : UserSession.get() }),
            usersLoaded : users && (users.count() > 0),
            currentUser : Meteor.user()
        };
    }
});