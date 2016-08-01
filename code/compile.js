function setup_compile() {
	return {
		passCtr: 0,
		regexp: null,
		
		load: function() {
			utils.forList(grammar.sequence,function(val1,i) {
				grammar.pattern[i] = [["|","production",{}]];
				utils.forMap(val1.production,function(val2,key2) {
					grammar.pattern[i][0][2][key2] = val2.pattern;
					grammar.production[key2] = [val2,i];
				});
			});
			
			var pattern = [""];
			utils.forMap(grammar.token,function(val,key,i) {
				val.reference = i + 1;
				if(i)
					pattern[0] += "|";
				pattern[0] += "(";
				compile.buildRegexp(pattern,val.pattern);
				pattern[0] += ")";
			});
			compile.regexp = new RegExp(pattern[0],"g");
		},
		buildRegexp: function(pattern,list) {
			pattern[0] += "(?:";
			utils.forList(list,function(val1) {
				if(typeof(val1) == "object") {
					switch(val1[0]) {
					case "c":
						pattern[0] += "[";
						utils.forList(val1[1],function(val2) {
							var unicode1 = "0000" + val2[0].toString(16);
							var unicode2 = "0000" + val2[1].toString(16);
							pattern[0] += "\\u" + unicode1.substr(unicode1.length - 4);
							pattern[0] += "-\\u" + unicode2.substr(unicode2.length - 4);
						});
						pattern[0] += "]";
						break;
					case "*":
						compile.buildRegexp(pattern,val1[1]);
						pattern[0] += "*";
						break;
					case "+":
						compile.buildRegexp(pattern,val1[1]);
						pattern[0] += "+";
						break;
					case "|":
						utils.forList(val1[1],function(val2,i) {
							if(i)
								pattern[0] += "|";
							compile.buildRegexp(pattern,val2);
						});
						break;
					}
				}
				else {
					pattern[0] += val1.replace(/[.*+?^${}()|[\]\\]/g,"\\$&");
				}
			});
			pattern[0] += ")";
		},
		incNextId: function() {
			var nextId = worker.session.current.nextId;
			for(var q = 0; q < nextId.length; ++q) {
				++nextId[q];
				if(nextId[q] == Number.MAX_SAFE_INTEGER)
					nextId[q] = 0;
				else
					break;
			}
			if(q == nextId.length) {
				nextId.push(1);
			}
		},
		run: function() {
			compile.passCtr++;
			console.log("compiler pass " + compile.passCtr + " started at " + new Date());
			
			try {
				
				// detect changed nodes
				//var print3 = print2;
				
				/*
				compare edited string with previous compiler output
				look up containing node of range in previous compiler output
				recursively search all unchanged descendant nodes (with id) in containing node
				
				*/
				
				
				var print3 = worker.session.compile.inputText.replace(/<br>/g," ");
				//console.log(" :) "+print3);
				
				// parse here ...
				var token1 = [];
				var token2 = [];
				var groupnode = [];
				compile.tokenize(print3,token1,token2);
				compile.prepareParse(token1,token2,groupnode);
				compile.performParse(groupnode);
				
				// update tree
				var parse4 = token2[0];
				//worker.session.compile.visibleRoot = ;
				
				// format html
				var print4 = compile.print(parse4);
				worker.session.compile.outputText = print4;
				
				
				//console.log(JSON.stringify(token1));
				
				/*var log = compile.printTokenTree(token1,1).split("\n");
				for(var p = 0; p < log.length; ) {
					var log2 = "";
					for(var q = 0; p < log.length && q < 100; ++p,++q) {
						log2 += log[p] + "\n";
					}
					console.log(log2);
				}*/
				
			
				console.log("compiler pass " + compile.passCtr + " finished at " + new Date());
			}
			catch(ex) {
				//console.log(compile.printTokenTree(token1,1));
				console.log("compiler pass " + compile.passCtr + " aborted at " + new Date()); //// leave path up compiled
				console.log(ex); ////
				throw ex;
			}
			
			//// restore selection
			
			//// do not update editor if edited (compile again)
		},
		print: function() {
			/*
			             grammar.production[match1.type][0]
			var print1 = grammar.production[parse.type][0].print(parse);*/
			
			// format html
			
			
			
			
			//// browser-specific newline
		},
		tokenize: function(src,token1,token2) {  // use regex api
			compile.regexp.lastIndex = 0;
			
			var select = [null,null];
			for(var p = 0, q = 0; p < src.length && compile.regexp.lastIndex < src.length; ++p) {
				var start = compile.regexp.lastIndex;
				var match = compile.regexp.exec(src);
				
				if(!match || match.index > start) {
					console.log("tokenizer: unexpected sequence (" + src.substring(start,(match) ? match.index : src.length) + ")");
					
					throw new Error();
				}
				
				var type = null;
				utils.forMap(grammar.token,function(val,key) {
					if(match[val.reference])
						type = key;
				});
				
				if(worker.session.compile.inputSelect) {
					if(match.index < worker.session.compile.inputSelect[0] && match.index + match[0].length <= worker.session.compile.inputSelect[0]) {
						select[0] = [worker.session.compile.inputSelect[0] - match.index];
					}
					if(match.index < worker.session.compile.inputSelect[1] && match.index + match[0].length <= worker.session.compile.inputSelect[1]) {
						select[1] = [worker.session.compile.inputSelect[1] - match.index];
					}
				}
				if(type != "whitespace") {
					var val = {
						parsed: true,
						type: type,
						value: match[0],
					};
					if(select[0] || select[1])
						val.select = select;
					token1.push(val);
					token2.push(match[0]);
					select = [null,null];
				}
				else {
					if(select[0])
						select[0][0] -= match[0].length;
					if(select[1])
						select[1][0] -= match[0].length;
				}
				
				q += match[0].length;
			}
		},
		tokenToString: function(token) {
			var string = "";
			utils.forList(token,function(val) {
				if(val.type == "group") {
					string += val.delimiter;
					string += compile.tokenToString(val.token);
					string += grammar.group[val.delimiter][1];
				}
				else {
					string += val.value;
				}
				string += " ";
			});
			return string;
		},
		printTokenTree: function(token,indent) { ////
			var string = "";
			var keys = [];
			utils.forList(["parsed","type","delimiter","production","token","value","parenthese","skip","variant","config"],function(key) {
				if(token[key])
					keys.push(key);
			});
			for(key in token) {
				if(keys.indexOf(key) == -1)
					keys.push(key);
			}
			utils.forList(keys,function(key) {
				string += new Array(indent).join(".   ");
				if(token[key] && typeof(token[key]) == "object") {
					string += key + ":\n" + compile.printTokenTree(token[key],indent + 1);
				}
				else {
					string += key + ": " + token[key] + "\n";
				}
			});
			return string;
		},
		prepareParse: function(token1,token2,groupnode) {
			
			//// select
			
			//console.log(token2.join(";"));
			//console.log(JSON.stringify(token1));
			
			// find all occurrences of opening and closing group delimiters
			var delimiter = [[],[],[]];
			utils.forUpto(2,function(i) {
				utils.forMap(grammar.group,function(val) {
					for(var p = 0; p < token2.length; ++p) {
						var next = token2.indexOf(val[i],
							(delimiter[i].length && token2[delimiter[i][delimiter[i].length - 1]] == val[i])
							? (delimiter[i][delimiter[i].length - 1] + 1) : 0
						);
						if(next == -1)
							break;
						delimiter[2].push([next,i,delimiter[i].length]);
						delimiter[i].push(next);
					}
				});
				delimiter[i].sort(function(a,b) {
					return a - b;
				});
			});
			delimiter[2].sort(function(a,b) {
				return a[0] - b[0];
			});
			if(delimiter[0].length != delimiter[1].length) {
				console.log("parser: too " + ((delimiter[0].length < delimiter[1].length) ? "much" : "few") + " group closing delimiters");
				
				throw new Error();
			}
			
			
			//console.log(delimiter);
			
			// parse @config annotations
			for(var p = delimiter[2].length - 1; p >= 0; --p) {
				if(delimiter[2][p][1] == 0 && delimiter[2][p][0] > 0 && token1[delimiter[2][p][0] - 1].value == "@") {
					var level = 1;
					for(var q = p + 1; q < delimiter[2].length; ++q) {
						level += (delimiter[2][q][1]) ? -1 : +1;
						if(!level) {
							var dist = (q - p + 1) >> 1;
							var length = delimiter[2][q][0] - delimiter[2][p][0] + 1;
							var json = token1.splice(delimiter[2][p][0] - 1,length + 1,null);
							json = compile.tokenToString(json);
							json = json.substr(1);
							
							try {
								json = JSON.parse(json);
							}
							catch(ex) {
								console.log("parser: failed to parse @config annotation");
	
								throw new Error();
							}
							
							token1[delimiter[2][p][0] - 1] = {
								parsed: true,
								type: "config",
								value: json,
							};
							
							delimiter[0].splice(delimiter[2][p][2],dist);
							delimiter[1].splice(delimiter[2][q][2] - dist + 1,dist);
							for(var r = delimiter[2][p][2]; r < delimiter[0].length; ++r) {
								delimiter[0][r] -= length;
							}
							for(var r = delimiter[2][q][2] - dist + 1; r < delimiter[1].length; ++r) {
								delimiter[1][r] -= length;
							}
							delimiter[2].splice(p);
							
							break;
						}
					}
					if(level) {
						console.log("parser: failed to parse @config annotation");

						throw new Error();
					}
				}
			}
			
			// form a tree of token lists, where groups are subtrees
			groupnode.push([{
				type: "group",
				token: token1,
			},0]);
			var p = delimiter[0].length - 1;
			for(var q = delimiter[0].length - 1; q >= 0; --q) {
				if(!q || delimiter[0][p] > delimiter[1][q - 1]) {
					if(token1[delimiter[1][q]].value != grammar.group[token1[delimiter[0][p]].value][1]) {
						console.log("parser: group delimiters do not match \"" + token1[delimiter[0][p]].value + "\", \"" + token1[delimiter[1][q]].value + "\"");
				
						throw new Error();
					}
					
					if(delimiter[1][q] < delimiter[0][p]) {
						console.log("parser: group closing delimiter before opening delimiter");
		
						throw new Error();
					}
					
					var length = delimiter[1][q] - delimiter[0][p];
					var match = {
						type: "group",
						delimiter: token1[delimiter[0][p]].value,
					};
					
					match.token = token1.splice(delimiter[0][p],length + 1,match).slice(1,length);
					groupnode.push([match,p - q + 1]);
					
					delimiter[1].splice(q,1);
					for(var r = q; r < delimiter[1].length; ++r) {
						delimiter[1][r] -= length;
					}
					
					--p;
					if(q < delimiter[1].length)
						++q;
				}
			}
			groupnode.sort(function(a,b) {
				return b[1] - a[1];
			});
			
			
			//console.log(JSON.stringify(token1));
			//console.log(JSON.stringify(groupnode));
			//console.log(groupnode);
			
		},
		performParse: function(groupnode) {  // simple bottom-up ll-parser with operator precedence
			// warning: variant xor iterate
			
			// apply production rules
			utils.forList(groupnode,function(val1) {  // iterate all groups bottom up
				utils.forListRev(grammar.sequence,function(val2,i) {  // iterate production rule sequence
					var pattern = grammar.pattern[i];
					for(var p = (val2.iterate) ? 3 * val1[0].token.length : 1; p; --p) {  // limit sequence step iterations
						// sufficient for max. one 1->1 production per n->1 production
						
						var complete = true;
						for(var q = 0; q < val1[0].token.length; ++q) {  // iterate group tokens
							
							// test pattern, contains all production rules of this sequence step
							var match1 = compile.matchProduction(val1[0].token,q,pattern);
							
							if(match1) {//console.log("a",q,match1);
								var skip = match1.skip;
								var match2 = match1.production;
								match2.parsed = true;
								match2.type = match2.production;
								match2.skip = skip;
								if(grammar.production[match2.type][0].variant)
									match2.variant = true;
								delete match2.production;
								
								// apply attribute parse rules
								match2 = grammar.production[match2.type][0].parse(match2);
								
								if(match2.parsed) {
									complete = false;
									
									val1[0].token.splice(q,(match2.variant) ? 0 : match2.skip,match2); ////
										
									q += (match2.variant) ? match2.skip : 0;
								}
								
								if(val2.iterate)
									break;
							}
						}
						if(complete) {  // iterate sequence step complete
							break;
						}
					}
				});
			});
			/*if(groupnode.length > 1 || !groupnode[0].parsed) { //// indicator ? wrong
				console.log("parser: unparsed groups left");
			}*/
			
			console.log(compile.logCount1,compile.logCount2);
			
			
			//// leave path up compiled
			//// error detection
			
			
		},
		// 68 production rules
		logCount1: 0,
		logCount2: 0,
		matchProduction: function(token3,q,pattern) { compile.logCount1++;
			var match1 = null;
			
			//// select
			
			//console.log(compile.logCount1,token3,q,pattern);
			//console.log(compile.logCount1,q,JSON.stringify(pattern));
			
			var r = 0;
			var s = 0;
			for(; r < pattern.length && q + s < token3.length; ++r) { compile.logCount2++;
				
				var val3 = token3[q + s];
				var val4 = pattern[r];
				if(val4 == " ") {
					continue;
				}
				
				match1 = match1 || {};  // init on first test
				
				if(typeof(val4) == "object") {
					switch(val4[0]) {
					case "p":
						if(val3.parsed && (val3.type == val4[1]
						|| (grammar.categorize[val4[1]] && grammar.categorize[val4[1]][val3.type]))) {
							match1[val4[2]] = val3;
							s += (val3.variant) ? (val3.skip + 1) : 1;
						}
						else if(val3.parsed && val3.variant) {
							--r;
							++s;
							continue;
						}
						else {
							return null;
						}
						
						break;
					case "g":
						if(!val3.parsed && val3.type == "group" && val3.delimiter == val4[1]) {
							var match2 = compile.matchProduction(val3.token,0,val4[3]);
							
							if(match2 && match2.skip == val3.token.length) {
								match1[val4[2]] = match2;
								++s;
							}
							else {
								return null;
							}
						}
						else if(val3.parsed && val3.variant) {
							--r;
							++s;
							continue;
						}
						else {
							return null;
						}
						
						break;
					case "?":
						match1[val4[1]] = null;
						var match2 = compile.matchProduction(token3,q + s,val4[2]);
						
						if(match2) {
							match1[val4[1]] = match2;
							s += match2.skip;
						}
						
						break;
					case "*":
					case "+":
						match1[val4[1]] = [];
						for(var t = token3.length; t; --t) {
							var match2 = compile.matchProduction(token3,q + s,val4[2]);
							
							if(match2) {
								/*if(r + 1 < pattern.length) {
									var match3 = compile.matchProduction(token3,q + s,pattern.slice(r + 1)); //// "n", "i"
									if(match3.skip) { //// " "
										console.log("parser: ambiguous production rule found",token3,q + s,pattern.slice(r + 1)); ////
							
										//throw new Error();
									}
								}*/
								
								match1[val4[1]].push(match2);
								s += match2.skip;
							}
							else {
								break;
							}
						}
						
						if(val4[0] == "+" && !match1[val4[1]].length) {
							return null;
						}
						
						break;
					case "|":
						utils.forMap(val4[2],function(val5,key5) {
							var match2 = compile.matchProduction(token3,q + s,val5);
						
							if(match2) {
								if(match1[val4[1]]) {
									console.log("parser: ambiguous production rule found",token3,q + s,val5,match2,match1[val4[1]]); ////
						
									//throw new Error();
								}
								else {
									match2.production = key5;
									match1[val4[1]] = match2;
								}
							}
						});
						
						if(match1[val4[1]]) {
							s += match1[val4[1]].skip;
						}
						else {
							return null;
						}
						
						break;
					}
				}
				else {
					if(val3.parsed && (val3.type == "punctuator" || val3.type == "identifier") && val3.value == val4) {
						s += (val3.variant) ? (val3.skip + 1) : 1;  // actually terminals have no variant
					}
					else if(val3.parsed && val3.variant) {
						--r;
						++s;
						continue;
					}
					else {
						return null;
					}
				}
			}
			
			for(; r < pattern.length; ++r) {
				
				var val4 = pattern[r];
				if(val4 == " ") {
					continue;
				}
				
				if(typeof(val4) == "object") {
					if({"p": true,"g": true,"+": true,"|": true}[val4[0]]) {
						return null;
					}
				}
				else {
					return null;
				}
			}
			
			if(match1) {
				match1.skip = s;
			}
			
			return match1;
		},
	};
	
	//// variable names
	//// documentation, german, information loss
}