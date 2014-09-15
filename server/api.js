Meteor.methods({
    lookupUsers : function(request){
        check(request, { 
            sessionId : String,
            users : Match.Where(function (x) {
                return _.isArray(x) ? 
                    _.map(x, function(i){ 
                        return check(i,String);
                    }).indexOf(false) === -1 : false;
            })
        });

        var response =  new TwitterApi().get('users/lookup.json',{
            screen_name : request.users.join(',')
        });

        if(response.statusCode === 200){
            _.each(response.data, function(d){
                TwitterUsers.upsert({
                    twitterId : d.id,
                    sessionId : request.sessionId
                },{
                    $set : {
                        twitterId : d.id,
                        sessionId : request.sessionId,
                        userData : d
                    }
                });
            });
        }

        return response;
    },

    getLists : function(request){
        
        console.log('getting lists for', Meteor.user().services.twitter.id, request);

        check(request, {
            sessionId : String
        });

        var currentUserTwitterId = Meteor.user().services.twitter.id;
        var response = new TwitterApi().get('lists/list.json');

        if(response.statusCode === 200){
            _.each(response.data, function(d){
                if(d.user.id_str === currentUserTwitterId){
                    // only add lists owned by the current user
                    TwitterLists.upsert({
                        twitterId : d.id,
                        sessionId : request.sessionId
                    },{
                        $set : {
                            twitterId : d.id,
                            sessionId : request.sessionId,
                            listData : d
                        }
                    });
                }
            });
        }

        return response;
    },

    addToList : function(request){
        check(request, {
            listId : Number,
            sessionId : String,
            users : Match.Where(function(x){
                return _.isArray(x) ? 
                    _.map(x, function(i){ 
                        return check(i,String);
                    }).indexOf(false) === -1 : false;
            })
        });        

        console.log('adding stuff to the list', request);
        console.log('number of the items in the list', request.users.length);


        function makeBundles(list, bundleSize){
            var cnt = -1;
            return _.groupBy(list, function(num){ 
                cnt++;
                return Math.floor(cnt/bundleSize); 
            });
        } 

        var errors = [];

        _.each(makeBundles(request.users,100), function(bundle){
            function addToList(items, retries){
                try {
                    var response = new TwitterApi().post('lists/members/create_all.json',{
                        list_id : request.listId,
                        user_id : bundle
                    });
                } catch(e){
                    if(retries < 3){
                        addToList(items, retries+1);
                    } else {
                        errors.push(e);
                    }
                }
            }

            addToList(bundle, 0);
        });

        if(errors.length === 0){
            return {
                itemsAdded : request.users.length,
                statusCode : 200
            };
        } else {
            throw new Meteor.Error(500, errors);
        }
    },

    follow : function(request){
        check(request, {
            listId : Number,
            sessionId : String,
            users : Match.Where(function(x){
                return _.isArray(x) ? 
                    _.map(x, function(i){ 
                        return check(i,String);
                    }).indexOf(false) === -1 : false;
            })
        });

        console.log('following people', request);

        var twitterApi = new TwitterApi();

        return _.map(request.users, function(u){
            return twitterApi.post('friendships/create.json',{
                user_id : u
            });
        });
    },

    clearUserList : function(request){
        // get rid of all the looked up twitter accounts for the current session

        check(request, {
            sessionId : String
        });

        return TwitterUsers.remove({
            sessionId : request.sessionId
        });
    },

    createList : function(request){
        check(request, {
            sessionId : String,
            name : String,
            mode : String
        });

        var response = new TwitterApi().post('/lists/create.json',{
            name : request.name,
            mode : request.mode
        });

        console.log('created list', response);

        try {
            var d = response.data;

            TwitterLists.upsert({
                twitterId : d.id,
                sessionId : request.sessionId
            },{
                $set : {
                    twitterId : d.id,
                    sessionId : request.sessionId,
                    listData : d
                }
            });

            return response;
        } catch(e) {
            throw new Meteor.Error(500, e);
        }
    },

    lookupList : function(request){
        check(request, {
            sessionId : String,
            list : {
                userHandle : String,
                listName : String,
                listUri : String
            }
        });

        var response = new TwitterApi().get('lists/list.json', {
            screen_name : request.list.userHandle
        });

        
        function getListMembers(listId, cursor){
            var params = { list_id : listId };
            if(cursor){
                params = _.extend(params,{
                    cursor : cursor
                });
            }
            var response = new TwitterApi().get('lists/members.json',params);

            if(response.statusCode === 200){
                _.each(response.data.users, function(u){
                    TwitterUsers.upsert({
                        twitterId : u.id,
                        sessionId : request.sessionId
                    },{
                        $set : {
                            twitterId : u.id,
                            sessionId : request.sessionId,
                            userData : u
                        }
                    });
                });

                if(response.data.next_cursor !== 0){
                    getListMembers(listId, response.data.next_cursor);
                }

            } else {
                throw new Meteor.Error(404, {
                    reason : 'Cannot find members for the list: ' + listId
                });   
            }
        }


        if(response.statusCode === 200){
            // find list by uri     

            var theList = _.find(response.data, function(l){
                return l.uri === request.list.listUri;
            });

            console.log('found the list', theList);

            if(theList){
                
                getListMembers(theList.id);
                
            } else {
                throw new Meteor.Error(404, {
                    reason : 'No such list: ' + request.list.listUri
                });
            }
        }
    }
});