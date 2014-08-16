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
	}
};