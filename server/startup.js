Meteor.startup(function(){
    Accounts.loginServiceConfiguration.remove({
        service : 'twitter'
    });

    Accounts.loginServiceConfiguration.insert({
        service     : 'twitter',
        consumerKey : Meteor.settings.private.twitter.consumerKey,
        secret      : Meteor.settings.private.twitter.secret
    });
});