Twitter = {
	extractHandleFromString : function(str){
		// it understands
		// http(s)://twitter.com/callmephilip
		// http(s)://twitter.com/@callmephilip
		// @callmephilip

		var exps = [
			{
				rx : /(http:\/\/|https:\/\/)*twitter\.com\/@?([A-Za-z0-9_-]+)/ig,
				targetLength : 3
			},
			{
				rx : /^\s*@([A-Za-z0-9_-]+)\s*$/ig,
				targetLength : 2
			}
		];

		for(var i=0; i<exps.length; i++){
			var match = exps[i].rx.exec(str);
			var tl = exps[i].targetLength;

			if(match && (match.length === tl) && match[tl-1]){
				return match[tl-1];
			}
		}
	},

	parseListUrl : function(str){
		// parses things like
		// 	https://twitter.com/@callmephilip/lists/list-aficionados
		//  https://twitter.com/callmephilip/lists/list-aficionados
		// returns 
		// {
		//    userHandle : 'callmephilip',
		//    listName : 'list-aficionados',
		//    listUri : '/callmephilip/list-aficionados'	
		// }
		var rx = /(http:\/\/|https:\/\/)*twitter\.com\/@?([A-Za-z0-9_-]+)\/lists\/([A-Za-z0-9_-]+)/ig;
		var match = rx.exec(str);

		if(match && (match.length === 4)){
			return {
				userHandle : match[2],
				listName : match[3],
				listUri : '/' + match[2] + '/' + match[3]
			};		
		} 
	}
};