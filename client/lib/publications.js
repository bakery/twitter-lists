SessionPublication = {
    subscribe : function(name, params){
        var params = params || {};

        if(typeof params !== 'object'){
            throw 'subscribe expects a dictionary';
        }

        params = _.extend(params, {
            sessionId : UserSession.get()
        });

        return Meteor.subscribe(name, params);
    }
};