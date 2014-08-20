JSONFile = {
	save : function(data,fileName){
		fileName = fileName || (Meteor.uuid() + '.json');
		saveAs(new Blob([JSON.stringify(data)], {type: 'text/plain;charset=utf-8'}), fileName);
	}
};