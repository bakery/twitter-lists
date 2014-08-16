Template.newListForm.events({
	'click' : function(e,template){
		e.stopImmediatePropagation();
	},

	'submit form' : function(e, template){
		e.stopImmediatePropagation();
		
		var name = template.$('input[name="name"]').val(); 

		if(name){

			template.$('input[type="submit"]').attr('disabled','disabled');

			SessionMethod.call('createList',
				{
					name : template.$('input[name="name"]').val(),
					mode : template.$('input[name="mode"]').is(':checked') ? 'private' : 'public'
				},
				function(error,data){
					template.$('input[type="submit"]').removeAttr('disabled');
					if(!error){
						template.$('input[name="name"]').val('');
						template.$('input[name="mode"]').removeAttr('checked');
					}
				}
			);
		}

		return false;
	}
});