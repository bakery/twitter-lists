UserSession = {
	set : function(value){
		Session.set('session-id', value);
	},

	get : function(){
		return Session.get('session-id');
	}
};