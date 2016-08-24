function setup_utils() {
	return {
		clone: function(val) { //// replace
			return (val) ? JSON.parse(JSON.stringify(val)) : null;
		},
		
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
			return node.textContent || node.innerText;
		},
		escapeHtml: function(str) {
			str = str.replace(/&/g,"&amp;");
			str = str.replace(/</g,"&lt;");
			str = str.replace(/>/g,"&gt;");
			str = str.replace(/"/g,"&quot;");
			str = str.replace(/'/g,"&#39;");
			str = str.replace(/\\/g,"&#92;");
			return str;
		},
		fromCharCodeArray: function(arr) {
			var str = [];
			utils.forList(arr,function(val) {
				str.push(String.fromCharCode(val));
			});
			return str.join("");
		},
		toCharCodeArray: function(str) {
			var arr = [];
			for(var i = 0; i < str.length; ++i) {
				arr.push(str.charCodeAt(i));
			}
			return arr;
		},
		makeIdentifier: function(str) {
			str = str.replace(/^[^\u0041-\u005A\u005F-\u005F\u0061-\u007A]*/,"");
			str = str.replace(/[^\u0030-\u0039\u0041-\u005A\u005F-\u005F\u0061-\u007A]/g,"");
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
		t3: 0,
		runInterruptable: function(queue) {
			setTimeout(function() {
				//var t1 = new Date().getTime() * 0.001;
				
				if(queue.queue && queue.queue.length && queue.cond(queue.ctx1)) {
					queue.insert = 0;
					var task = queue.queue.shift();
					try {
						(task[0])(queue,task[1]);
					}
					catch(ex) {
						console.error(ex);
						throw ex;////
					}
					if(queue.queue.length)
						utils.runInterruptable(queue);
				}
				
				/*var t2 = new Date().getTime() * 0.001;
				if(utils.t3) {
					console.log("PROF overhead time ",t1 - utils.t3);
				}
				console.log("PROF  payload time ",t2 - t1,(task) ? task[0] : null);
				utils.t3 = t2;*/
			},0);
		},
	};
}