SessionMethod = {
    call : function(method, params, callback){
        var params = params || {};

        if(typeof params !== 'object'){
            throw 'call needs a dictionary';
        }

        params = _.extend(params, {
            sessionId : UserSession.get()
        });

        console.log('calling ' + method, params);

        Meteor.call(method, params, function(error,data){
            console.log('got response', error, data);
            if(typeof callback !== 'undefined'){
                callback(error,data);
            }
        });
    }
};