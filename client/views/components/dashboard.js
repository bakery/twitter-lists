Template.dashboard.events({
	'click .lists li a' : function(e,template){
		var listId = $(e.target).data('list-id');
		var twitterUsers = TwitterUsers.find({}).fetch();

		template.$('.panel-body').addClass('loading');
		template.$('.btn-choose-list').attr('disabled','disabled');

		SessionMethod.call('addToList', {
			listId : listId,
			users : _.map(twitterUsers, function(tu){
				return tu.userData.id_str;
			})
		}, function(error,data){
			
			template.$('.panel-body').removeClass('loading');
			template.$('.btn-choose-list').removeAttr('disabled');

			if(error){
				if(error.reason.response.statusCode === 503){
					alert("Twitter is refusing to collaborate, please try again");
				} else {
					alert("Something went terrible wrong.");
				}
			} else {
				alert('items added to the list');
			}
		});
	},

	'click .btn-upload-list' : function(e,template){
		template.$('#csvFileUpload').trigger('click');
	},

	'click .btn-clear' : function(e,template){
		SessionMethod.call('clearUserList',{}, function(error,data){
			if(error){
				alert('Something went terribly wrong');
			}
		});
	},

	'click .btn-export' : function(e,template){
		var data = _.map(TwitterUsers.find({}).fetch(), function(u){ return u.userData});
		JSONFile.save(data);
	},

	'change #csvFileUpload' : function(e, template){
		var file = e.target.files[0];
		console.log(file);

		template.$('.panel-body').addClass('loading');
		template.$('.btn-upload-list').attr('disabled','disabled');

		CSVFile.process(file,function(data){
			console.log(_.flatten(data));
			var handles = _.filter(_.map(_.flatten(data), function(s){
				return Twitter.extractHandleFromString(s);
			}), function(h){ return typeof h !== 'undefined'; });

			var maxListSize = Meteor.settings.public.maxListSize; 

			if(handles.length > maxListSize){
				alert('There are more than ' + maxListSize + ' handles extracted. Processing only the first ' + maxListSize);
			}

			SessionMethod.call('lookupUsers',{
				users: _.first(handles,maxListSize)
			}, function(error, response){
				template.$('.panel-body').removeClass('loading');
				template.$('.btn-upload-list').removeAttr('disabled');
			});
		});
	}
});

Template.dashboard.helpers({
	disableListOperations : function(){
		return this.usersLoaded ? '' : 'disabled';
	}
});