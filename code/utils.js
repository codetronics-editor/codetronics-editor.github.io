function setup_utils() {
	return {
		forUpto: function(count,func) {
			for(var i = 0; i < count; ++i)
				func(i);
		},
		forDownfrom: function(count,func) {
			for(var i = count - 1; i >= 0; --i)
				func(i);
		},
		forList: function(arr,func) {
			if(arr)
				utils.forUpto(arr.length,function(i) {
					func(arr[i],i);
				});
		},
		forListRev: function(arr,func) {
			if(arr)
				utils.forDownfrom(arr.length,function(i) {
					func(arr[i],i);
				});
		},
		forMap: function(map,func) {
			var i = 0;
			if(map)
				for(key in map)
					func(map[key],key,i++);
		},
		forMapRev: function(map,func) {
			if(map) {
				var keys = [];
				for(key in map)
					keys.push(key);
				utils.forListRev(keys,function(key,i) {
					func(map[key],key,i);
				});
			}
		},
		
		reverseMap: function(map1,func) {
			var map2 = {};
			utils.forMapRev(map1,function(val,key) {
				map2[key] = val;
			});
			return map2;
		},
		
		unescapeQuote: function(str) {
			return str.replace(/\\(.)/g,"$1"); //// test
		},
		escapeQuote: function(str) {
			return str.replace(/["'\\]/g,"\\$&"); //// test
		},
		unescapeHtml: function(str) {
			var node = document.createElement("div");
			node.innerHTML = str;
			return (node.textContent || node.innerText);
		},
		escapeHtml: function(str) {
			var node = document.createElement("div");
			node.appendChild(document.createTextNode(str));
			return node.innerHTML.replace(/"/g,"&quot;");
		},
		makeIdentifier: function(str) {
			str = str.replace(/^[^\u0041-\u005A\u005F-\u005F\u0061-\u007A\u0080-\uFFFF]*/,"");
			str = str.replace(/^\u0030-\u0039\u0041-\u005A\u005F-\u005F\u0061-\u007A\u0080-\uFFFF]/g,"");
			return str;
		},
		
		initInterruptable: function(cond,ctx1) {
			return {
				queue: [],
				insert: 0,
				cond: cond,
				ctx1: ctx1,
			};
		},
		queueInterruptable: function(queue,func,ctx2) {
			queue.queue.splice(queue.insert,0,[func,ctx2]);
			++queue.insert;
		},
		runInterruptable: function(queue) {
			setTimeout(function() {
				if(queue.queue && queue.queue.length && queue.cond(queue.ctx1)) {
					queue.insert = 0;
					var task = queue.queue.shift();
					(task[0])(queue,task[1]);
					if(queue.queue.length)
						utils.runInterruptable(queue);
				}
			},0);
		},
	};
}