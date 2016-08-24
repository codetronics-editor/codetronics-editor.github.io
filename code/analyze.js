function setup_analyze() {
	return {
		passCtr: 0,
		
		run: function() {
			++analyze.passCtr;
			console.log("analyze pass " + analyze.passCtr + " started at " + new Date());
			
			try {
				//// skip variant (most unparsed)
				//// remove variant from parsed
		
				//// handle terminal, literal
				//// error on parenthese, ex;
		
				//// handle unparsed
				//// find parsed in unparsed (group)
		
				
				worker.session.current.projectNode = {}; ////
				worker.session.current.projectNode[worker.session.visibleRoot.config.id] = worker.session.visibleRoot; ////
		
		
				worker.session.analyze.structure = [];
				//worker.session.analyze.package = []; //// reset/init
				var hasProjectRoot = false;
				utils.forList(worker.session.analyze.parse,function(val) {
					
					// outside project -> unparsed
					if(val.type != "project")
						val.unparsed = true;
						
					// update project root
					if(!hasProjectRoot && val.type == "project") {
						hasProjectRoot = true;
						worker.session.current.projectRoot = val;
						worker.session.analyze.package.project = [[],val,{}]; //// reset/init
					}
				});
				analyze.walkParsed({token: worker.session.analyze.parse},"r",[["[p","token"]],"","",[[],(worker.session.analyze.package.project || [null,null,{}])[2]],-1); ////
				
				worker.session.analyze.outputFormat = [];
				utils.forList(worker.session.analyze.parse,function(val) {
					analyze.performPrint({token: val},[["p",null,"token"],["n"]]); //// unparsed whitespace
				});
				
				//console.log(worker.session.analyze.package);
				
				//// set function package to context
				
				if(worker.session.analyze.package.project
				&& worker.session.analyze.package.function.length) {
					var token = worker.session.analyze.package.function[worker.session.analyze.package.function.length - 1][1];
					
					
					
				
					var context = {
						global: {
							function: token,
							param: {},
							tmpCtr: 0,
							scopeCtr: 0,
						},
						scope: {
							name: null,
							var: {},
						},
						continue: {
							name: null,
						},
						break: {
							name: null,
						},
						throw: {
							name: null,
						},
						token: {
							htmlrelpath: "",
						},
					};
					utils.forList(token.parameter,function(val1) {
						context.global.param["i_" + val1.value] = true;
					});
					
					
					
					var sequence = [];
					var container = [];
					var edges = [];
					analyze.execFlowchart(token,context,sequence);
					
					//console.log(sequence);
					
					analyze.buildFlowchartDiagram(sequence,container,edges);
					
					worker.session.analyze.sampleproject = [["[",container],edges];
				}
				//worker.session.analyze.sampleproject = null;
			
				console.log("analyze pass " + analyze.passCtr + " finished at " + new Date());
			}
			catch(ex) { //// todo discard parsed & recover previous state
				console.log("analyze pass " + analyze.passCtr + " aborted at " + new Date()); //// leave path up compiled
				throw ex; ////
			}
		},
		dereference: function(token) {
			if(token.type == "reference") {
				token = worker.session.current.projectNode[token.reference];
			}
			return token;
		},
		walkParsed: function(token,type,structure,htmlname1,htmlpath,package,indent) {
			
			if(!token)
				return;
			
			var visibleRoot = null;
			switch(type) {
			case "p":
				var reference = token;
				token = reference[0][reference[1]];
				
				// dereference
				var isReferenced = false;
				if(token && token.type == "reference") {
					isReferenced = true;
					token = analyze.dereference(token);
				}
				
				if(!token || !token.parsed)
					return;
				
				var production = (grammar.production[token.type]) ? grammar.production[token.type][0] : null;
				
				// update project node
				if(production && production.config) {
					token.config.id = token.config.id || analyze.incNextId();
					worker.session.current.projectNode[token.config.id] = token;
					
					// insert reference, if not already
					if(!isReferenced) {
						reference[0][reference[1]] = {
							parsed: true,
							type: "reference",
							reference: token.config.id,
						};
					}
				}
				
				//// config-less descendant (terminal) sub-config
				
				// set parameters for this production
				structure = (production) ? production.structure : null;
				visibleRoot = (token.config) ? token.config.id : null;
				
				switch(token.type) {
				case "package":
				case "class":
				case "function":
					package = [utils.clone(package[0]),package[1]];
					package[0].push([token.type,token.config.name]);
					var entry = [package[0],token,{}];
					worker.session.analyze.package[token.type].push(entry);
					package[1]["i_" + token.config.name] = entry;
					package[1] = entry[2];
					
					token.package = [entry[0],entry[2]];
					
					break;
				}
				
				// format htmlname
				htmlname1 += "&lt;" + utils.escapeHtml(grammar.short[token.type] || token.type) + "&gt;";
				switch(token.type) {
				case "property":
					htmlname1 += "<span style=\"color:#f06;\">(" + utils.escapeHtml(token.identifier.value) + ")</span>";
					
					break;
				case "identifier":
					htmlname1 += "<span style=\"color:#f06;\">(" + utils.escapeHtml(token.value) + ")</span>";
					
					break;
				case "literal":
				case "string":
				case "number":
					htmlname1 += "<span style=\"color:#075;\">(" + utils.escapeHtml(token.value) + ")</span>";
					
					break;
				default:
					htmlname1 += (token.config && token.config.name) ? "<span style=\"color:#f06;\">(" + utils.escapeHtml(token.config.name) + ")</span>" : "";
					
					break;
				}
				
				break;
			case "{":
				htmlname1 = "<span style=\"color:#888;\">" + htmlname1 + "</span>";
			
				break;
			case "u":
				htmlname1 = "<span style=\"color:#8a2;font-style:italic;\">unparsed</span>";
			
				break;
			}
			
			// append htmlname to htmlpath
			if(token != worker.session.current.projectRoot)
				htmlpath += ((htmlpath) ? "." : "") + htmlname1;
			
			token.htmlname = htmlname1; //// do not store
			token.htmlpath = htmlpath || htmlname1; //// do not store
			
			// append structure entry
			if(indent >= 0) {
				worker.session.analyze.structure.push({
					htmlname: new Array(indent + 1).join("&emsp;") + htmlname1,
					htmlpath: token.htmlpath,
					visibleRoot: visibleRoot,
				});
			}
			
			if(!structure)
				return;
			
			// walk descendants in structure
			utils.forList(structure,function(val1) {
				var htmlname2 = (type != "r" && type != "u") ? utils.escapeHtml(grammar.short[val1[1]] || val1[1]) : "";
				
				switch(val1[0]) {
				case "p":
					analyze.walkParsed([token,val1[1]],"p",null,htmlname2,htmlpath,package,indent + 1);
			
					break;
				case "{":
					analyze.walkParsed(token[val1[1]],"{",val1[2],htmlname2,htmlpath,package,indent + 1);
			
					break;
				case "[{":
					utils.forList(token[val1[1]],function(val2,i) {
						analyze.walkParsed(val2,"{",val1[2],htmlname2 + i,htmlpath,package,indent + 1);
					});
			
					break;
				case "[p":
					var unparsed = [];  // condense successive unparsed
					
					var length = token[val1[1]].length;
					var i = 0;
					for(var p = 0; p < length; ++p) {
						var val2 = token[val1[1]][p];
						var parsed = (type == "u" || (val2.parsed && !val2.unparsed));
						
						// push unparsed
						if(!parsed) {
							unparsed.push(val2);
						}
						
						// walk parsed descendants in condensed unparsed
						if((parsed || p == length - 1) && unparsed.length) {
							var descendant = [];
							analyze.findParsedDescendant(descendant,unparsed);
							analyze.walkParsed({token: descendant},"u",[["[p","token"]],"",htmlpath,package,indent + 1);
							unparsed = [];
						}
						
						// walk parsed
						if(parsed) {
							var htmlname3 = (type != "r" && type != "u") ? (htmlname2 + i) : "";
							
							analyze.walkParsed([token[val1[1]],p],"p",null,htmlname3,htmlpath,package,indent + 1);
							
							++i;
						}
					}
			
					break;
				}
			});
		},
		findParsedDescendant: function(descendant,unparsed) {
			utils.forList(unparsed,function(val) {
				if(val.parsed && !val.terminal) {
					descendant.push(val);
				}
				if(val.type == "group") {
					analyze.findParsedDescendant(descendant,val.token);
				}
			});
		},
		incNextId: function() {
			var nextId = worker.session.current.nextId;
			var result = nextId.join("_");
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
			return result;
		},
		
		performPrint: function(token,pattern) {
			utils.forList(pattern,function(val1) {
				if(typeof(val1) == "object") {
					switch(val1[0]) {
					case "p":
					case "p$":
						var val2 = token[val1[2]];
						
						// p group terminal
						
						
						switch(val2.type) {
						case "group":
							worker.session.analyze.outputFormat.push(["t",val2.delimiter]);
							utils.forList(val2.token,function(val3) {
								analyze.performPrint({token: val3},[["p",null,"token"],["n"]]); //// unparsed whitespace
							});
							worker.session.analyze.outputFormat.push(["t",grammar.group[val2.delimiter][1]]);
							
							break;
						case "config":
							worker.session.analyze.outputFormat.push(["c","@" + JSON.stringify(val2.value)]);
							
							break;
						default:
							val2 = analyze.dereference(val2);
							
							if(val2.terminal) {
								worker.session.analyze.outputFormat.push(["t",val2.value]);
							}
							if(val2.parsed && !val2.terminal) {
								var production = grammar.production[val2.type][0];
				
								val2 = production.print(val2);
				
								analyze.performPrint(val2,production.pattern);
							}
							
							break;
						}
						
						
						break;
					case "g":
						var val2 = token[val1[2]];
						
						worker.session.analyze.outputFormat.push(["t",val1[1]]);
						analyze.performPrint(val2,val1[3]);
						worker.session.analyze.outputFormat.push(["t",grammar.group[val1[1]][1]]);
					
						break;
					case "?":
						var val2 = token[val1[1]];
						
						if(val2) {
							analyze.performPrint(val2,val1[2]);
						}
					
						break;
					case "*":
					case "+":
						var val2 = token[val1[1]];
						
						utils.forList(val2,function(val3) {
							analyze.performPrint(val3,val1[2]);
						});
					
						break;
					case "|":
						var val2 = token[val1[1]];
						
						analyze.performPrint(val2,val1[2][val2.production]);
					
						break;
					case "n":
					case "i":
						worker.session.analyze.outputFormat.push(val1);
						
						break;
					}
				}
				else {
					worker.session.analyze.outputFormat.push(["t",val1]);
				}
			});
			
			//// production, terminal, keyword-pattern, whitespace, reference, group, config, unparsed
		
			//// browser-specific newline
		},
		
		/*resolveProperty: function() { //// resolve in context
		},*/
		/*condenseOperator: function() { //// switch || only
		},*/
		pushContext: function(context) {
			return {
				global: context.global,
				scope: context.scope,
				continue: context.continue,
				break: context.break,
				throw: context.throw,
				token: context.token,
			};
		},
		execFlowchartBlock: function(statement,context1,sequence,htmlrelpath1) {
			utils.forList(statement,function(val1) {
				if(val1.parsed && !val1.unparsed) {
					var htmlrelpath2 = context1.token.htmlrelpath;
					if(htmlrelpath2)
						htmlrelpath2 += ".";
					if(htmlrelpath1)
						htmlrelpath2 += htmlrelpath1 + ".";
					htmlrelpath2 += analyze.dereference(val1).htmlname;
					sequence.push({
						type: "htmlrelpath",
						htmlrelpath: htmlrelpath2,
					});
					
					analyze.execFlowchart(val1,context1,sequence);
				}
			});
		},
		execFlowchart: function(token,context1,sequence,res1,config) { // transform parse tree with execution order
			config = config || {};
			
			//// spec: behavior
			
			
			
			token = analyze.dereference(token); //// where to dereference ?
			
			
			//console.log(token);
			
			
			if(res1 && !grammar.categorize["expression"][token.type]) {
				console.log("exec flowchart: invalid type in function " + token.type);
				
				//throw new Error();
				return;
			}
			
			//// expr; no res
			
			//// htmlrelpath
			
			context1 = analyze.pushContext(context1);
			var htmlrelpath1 = context1.token.htmlrelpath;
			if(htmlrelpath1)
				htmlrelpath1 += ".";
			htmlrelpath1 += token.htmlname;
			context1.token = {
				htmlrelpath: htmlrelpath1,
			}
			
			var exec = {};
			switch(token.type) {
			case "function":  // function
				// parameter
				exec.type = "function";
				exec.parameter = [];
				exec.sequence = [];
				
				context1.token.htmlrelpath = "";
				analyze.execFlowchartBlock(token.statement,context1,exec.sequence,"");
				
				break;
			case "if":  // _$1 = expr1;_ if(expr1) { statement1 } else { ... }
				/*sequence.push({
					type: "htmlrelpath",
					htmlrelpath: "xyzabc",
				});*/
				
				exec.type = "if";
				exec.sequence = [];//console.log(token);
				utils.forList(token.statement,function(val1,i) {
					exec.sequence[i] = {
						condition: [],
						statement: [],
					};
					context1.token.htmlrelpath = "";
					var res2 = [];
					analyze.execFlowchartExpression(val1.condition,context1,exec.sequence[i].condition,res2);
					exec.sequence[i].res = res2[0];
					
					//console.log(val1.condition,res2[0]);
					
					analyze.execFlowchartBlock(val1.statement,context1,exec.sequence[i].statement,"<span style=\"color:#888;\">" + (grammar.short.statement + i) + "</span>");
				});
				exec.sequence[token.statement.length] = {
					statement: [],
				};
				if(token.else)
					analyze.execFlowchartBlock(token.else.statement,context1,exec.sequence[token.statement.length].statement,"<span style=\"color:#888;\">" + grammar.short.else + "</span>");
				
				//console.log(exec,token.else);
				
				break;
			case "switch":  // _$1 = expr1;_ _$2 = expr2;_ $3 = ($1 == $2); if($3) { statement1 } else { ... }
				/*sequence.push({
					type: "htmlrelpath",
					htmlrelpath: "xyzabc",
				});*/
				
				exec.type = "if";
				exec.sequence = [
					{
						condition: [],
						statement: [],
						res: [,,"////"],
					},{
						condition: [],
						statement: [],
					}
				];
			
			
			
				//// break at end or empty
				
				/*	if(val1.parsed && !val1.unparsed)
				
				utils.forList(token.statement,function(val1,i) {
					if(val1.parsed && !val1.unparsed)
						analyze.execFlowchart(val1,context1,exec.sequence);
				});*/
				
				break;
			case "while":  // statement; _$1 = expr1_
				/*sequence.push({
					type: "htmlrelpath",
					htmlrelpath: "xyzabc",
				});*/
				
				exec.type = "while";
				exec.sequence = [];
				
				break;
			case "for":  // _var init;_ statement; _$1 = expr1;_ _$2 = expr2_
				/*sequence.push({
					type: "htmlrelpath",
					htmlrelpath: "xyzabc",
				});*/
				
				exec.type = "while";
				exec.sequence = [];
				
				break;
			case "for in":  // $1 = expr1; statement; var iter
				/*sequence.push({
					type: "htmlrelpath",
					htmlrelpath: "xyzabc",
				});*/
				
				exec.type = "while";
				exec.sequence = [];
				
				break;
			case "try":  // statement1; statement2
				/*sequence.push({
					type: "htmlrelpath",
					htmlrelpath: "xyzabc",
				});*/
				
				exec.type = "try";
				
				break;
			case "block":  // statement ...
				/*sequence.push({
					type: "htmlrelpath",
					htmlrelpath: "xyzabc",
				});*/
				
				////var context2 = analyze.pushContext(context1);
				
				analyze.execFlowchartBlock(token.statement,context1,sequence,"");
				exec = null;
				
				break;
			case "var":  // _$1 = expr1_ ...
				/*sequence.push({
					type: "htmlrelpath",
					htmlrelpath: "xyzabc",
				});*/
				
				exec.type = "var";
				////exec.scope = ;
				exec.sequence = [];
				exec.var = [];
				utils.forList(token.var,function(val1,i) {
					var res2 = [];
					if(val1.expression)
						analyze.execFlowchartExpression(val1.expression,context1,exec.sequence,res2);
					exec.var[i] = [val1.name,res2[0]];
				});
				
				break;
			case "continue":
				// only whl, for, fin
				
				exec.type = "control";
				
				break;
			case "break":
				// only swi, whl, for, fin
				
				exec.type = "control";
				
				break;
			case "return":
				// any
				
				exec.type = "control";
				
				break;
			case "throw":
				// any
				
				exec.type = "control";
				
				break;
			case "?":  // _$1 = expr1;_ if(expr1) { _$2 = expr2;_ _res = $2_ } else { _$3 = expr3;_ _res = $3_ }
				exec.type = "statement";
				exec.operation = token.type;
				exec.right = [,,"////"];
				exec.res = [,,"////"];
				if(res1) {
					res1[0] = exec.res;
				}
				
				break;
			case "=":  // _$1 = pro;_ _$2 = expr1;_ pro[$1] = $2; _res = $2_  //// exec order ?
				exec.type = "statement";
				exec.operation = token.type;
				var res2 = [];
				analyze.execFlowchartProperty(token.left,context1,sequence,res2);
				var res3 = [];
				analyze.execFlowchartExpression(token.right,context1,sequence,res3,{res: res2});
				exec.right = res3[0];
				exec.res = res2[0];
				exec.nooperation = true;
				if(res1) {
					res1[0] = res3[0];
				}
				if(res2[0] == res3[0]) {
					exec = null;
				}
				
				
				//// "=" only primitive (static data structure)
				
				break;
			case "*=":
			case "/=":
			case "%=":
			case "+=":
			case "-=":
			case "<<=":
			case ">>=":
			case ">>>=":
			case "&=":
			case "^=":
			case "|=":
				exec.type = "statement";
				exec.operation = {"*=": "*","/=": "/","%=": "%","+=": "+","-=": "-","<<=": "<<",">>=": ">>",">>>=": ">>>","&=": "&","^=": "^","|=": "|"}[token.type];
				var res2 = [];
				analyze.execFlowchartProperty(token.left,context1,sequence,res2);
				var res3 = [];
				analyze.execFlowchartExpression(token.right,context1,sequence,res3);
				exec.left = res2[0];
				exec.right = res3[0];
				exec.res = res2[0];
				if(res1) {
					res1[0] = res2[0];
				}
				
				break;
			case "||":  // _$1 = expr1; if(expr1) { _res = $1_ } else { _$2 = expr2;_ _res = $2_ }
				exec.type = "statement";
				exec.operation = token.type;
				exec.right = [,,"////"];
				exec.res = [,,"////"];
				if(res1) {
					res1[0] = exec.res;
				}
				
				break;
			case "&&":  // _$1 = expr1; if(expr1) { _$2 = expr2;_ _res = $2_ } else { _res = $1_ }
				exec.type = "statement";
				exec.operation = token.type;
				exec.right = [,,"////"];
				exec.res = [,,"////"];
				if(res1) {
					res1[0] = exec.res;
				}
				
				break;
			case "|":  // _$1 = expr1;_ _$2 = expr2;_ $3 = $1 | $2; _res = $3_
			case "^":
			case "&":
			case "==":
			case "!=":
			case "<":
			case "<=":
			case ">":
			case ">=":
			case "<<":
			case ">>":
			case ">>>":
			case "a+b":
			case "a-b":
			case "*":
			case "/":
			case "%":
				exec.type = "statement";
				exec.operation = {"a+b": "+","a-b": "-"}[token.type] || token.type;
				var res2 = (res1) ? [] : null;
				analyze.execFlowchartExpression(token.left,context1,sequence,res2);
				var res3 = (res1) ? [] : null;
				analyze.execFlowchartExpression(token.right,context1,sequence,res3);
				if(res1) {
					exec.left = res2[0];
					exec.right = res3[0];
					if(config.res) {
						exec.res = config.res[0];
					}
					else {
						++context1.global.tmpCtr;
						exec.res = ["$",context1.global.tmpCtr,"$" + context1.global.tmpCtr];
					}
					res1[0] = exec.res;
				}
				if(!res1) {
					exec = null;
				}
				
				break;
			case "!":  // _$1 = expr;_ $2 = ! $1; _res = $2_
			case "~":
				exec.type = "statement";
				exec.operation = token.type;
				var res2 = (res1) ? [] : null;
				analyze.execFlowchartExpression(token.left,context1,sequence,res2);
				if(res1) {
					exec.prefix = true;
					exec.left = res2[0];
					if(config.res) {
						exec.res = config.res[0];
					}
					else {
						++context1.global.tmpCtr;
						exec.res = ["$",context1.global.tmpCtr,"$" + context1.global.tmpCtr];
					}
					res1[0] = exec.res;
				}
				if(!res1) {
					exec = null;
				}
				
				break;
			case "++x":  // _$1 = pro;_ $2 = pro[$1]; $3 = $2 + 1; pro[$1] = $3; _res = $3_
			case "--x":
				exec.type = "statement";
				exec.operation = {"++x": "+","--x": "-"}[token.type];
				var res2 = [];
				analyze.execFlowchartProperty(token.left,context1,sequence,res2);
				exec.left = res2[0];
				exec.right = ["literal",1,"<span style=\"color:#075;\">1</span>"];
				exec.res = res2[0];
				if(res1) {
					res1[0] = exec.res;
				}
				
				break;
			case "x++":  // _$1 = pro;_ $2 = pro[$1]; $3 = $2 + 1; pro[$1] = $3; _res = $2_
			case "x--":
				exec.type = "statement";
				exec.operation = {"x++": "+","x--": "-"}[token.type];
				var res2 = [];
				analyze.execFlowchartProperty(token.left,context1,sequence,res2);
				exec.left = res2[0];
				exec.right = ["literal",1,"<span style=\"color:#075;\">1</span>"];
				exec.res = res2[0];
				if(res1) {
					++context1.global.tmpCtr;
					res1[0] = ["$",context1.global.tmpCtr,"$" + context1.global.tmpCtr];
					sequence.push({
						type: "statement",
						operation: "=",
						left: res1[0],
						right: exec.left,
					});
				}
				
				break;
			case "invocation":  // _$1 = pro;_ _$2 = par;_ _$3 = _pro[$1]($2); _res = $3_
				exec.type = "statement";
				exec.operation = token.type;
				exec.right = [,,"////"];
				exec.res = [,,"////"];
				if(res1) {
					res1[0] = exec.res;
				}
				
				////
				
				//if(type == "system")
				//// system: condense +, skip +
				
				break;
			case ".":
			case "[":
			case "property":
				analyze.execFlowchartProperty(token,context1,sequence,res1);
				exec = null;
				
				break;
			case "literal":
				exec = null;
				
				break;
			default:
				console.log("exec flowchart: invalid type in function " + token.type);
				
				//throw new Error();
				exec = null;
			}
			
			if(exec)
				sequence.push(exec);
		},
		execFlowchartProperty: function(token,context1,sequence,res1) {
			if(res1) {
				res1[0] = res1[0] || ["property",[],""];
			}
			
			token = analyze.dereference(token);
			
			var exec = {};
			switch(token.type) {
			case ".":
				analyze.execFlowchartProperty(token.expression,context1,sequence,res1);
				if(res1) {
					res1[0][1].push(["identifier",token.key.value]);
					res1[0][2] += ".<span style=\"color:#f06;\">" + utils.escapeHtml(token.key.value) + "</span>";
				}
				
				break;
			case "[":
				analyze.execFlowchartProperty(token.expression,context1,sequence,res1);
				var res2 = (res1) ? [] : null;
				analyze.execFlowchartExpression(token.key,context1,sequence,res2);
				if(res1) {
					res1[0][1].push(res2[0]);
					res1[0][2] += "[" + res2[0][2] + "]"; ////
				}
				
				break;
			case "property":
				if(res1) {
					var type = null;
					if(context1.scope.var["i_" + token.identifier.value]) {
						type = "scope";
						res1[0][2] += "<span style=\"color:#369;\">" + context1.scope.name + "." + utils.escapeHtml(token.identifier.value) + "</span>"; ////
					}
					else if(context1.global.param["i_" + token.identifier.value]) {
						type = "param";
						res1[0][2] += "<span style=\"color:#369;\">" + "par." + utils.escapeHtml(token.identifier.value) + "</span>"; ////
					}
					else {
						var package1 = worker.session.analyze.package.project;
						var package2 = null;
						var htmlpath1 = "";
						var htmlpath2 = "";
						utils.forList(context1.global.function.package[0],function(val1) {
							package1 = package1[2]["i_" + val1[1]];
							if(htmlpath1)
								htmlpath1 += ".";
							htmlpath1 += utils.escapeHtml(val1[1]);
							if(package1[2]["i_" + token.identifier.value]) {
								package2 = package1;
								htmlpath2 = htmlpath1;
							}
						});
						
						if(package2) {
							type = "global";
							res1[0][2] += "<span style=\"color:#f06;\">" + htmlpath2 + "." + utils.escapeHtml(token.identifier.value) + "</span>"; ////
						}
						else {
							console.log("exec flowchart: variable not found in function " + token.type);
							res1[0][2] += "<span style=\"padding-left:0.3em;padding-right:0.3em;background-color:#ddd;\">" + utils.escapeHtml(token.identifier.value) + "</span>"; ////
				
							//throw new Error();
						}
					}
					res1[0][1].push([type,token.identifier.value]);
				}
				
				break;
			default:
				console.log("exec flowchart: invalid type in function " + token.type);
				
				//throw new Error();
			}
		},
		execFlowchartExpression: function(token,context1,sequence,res1,config) {
			token = analyze.dereference(token);
			
			if(token.type == "literal") {
				if(res1) {
					res1[0] = ["literal",token.value,"<span style=\"color:#075;\">" + utils.escapeHtml(token.value) + "</span>"];
				}
			}
			else {
				analyze.execFlowchart(token,context1,sequence,res1,config);
			}
		},
		pushContainer: function(container,edges,prev,next) {
			container.push([next]);
			if(prev[0])
				edges.push([[prev[0],1],[next,0]]);
			prev[0] = next;
		},
		buildFlowchartDiagram: function(sequence,container1,edges,prev) {
			prev = prev || [null];
			utils.forList(sequence,function(val1) {
				switch(val1.type) {
				case "htmlrelpath":
					analyze.pushContainer(container1,edges,prev,["s",val1.htmlrelpath,"htmlrelpath",{sequence: true}]);
					
					break;
				case "statement": //console.log(val1);
					var html = "";
					if(val1.res)
						html += val1.res[2] + " = ";
					if(val1.left && !val1.prefix)
						html += val1.left[2] + " ";
					if(!val1.nooperation)
						html += utils.escapeHtml(val1.operation) + " ";
					html += ((val1.prefix) ? val1.left[2] : val1.right[2]);
					analyze.pushContainer(container1,edges,prev,["s",html,"statement"]);
					
					//console.log(html);
			
					break;
				case "invocation":
					analyze.pushContainer(container1,edges,prev,["s","html","system"]);
			
					break;
				case "var":
					analyze.pushContainer(container1,edges,prev,["s","html","system"]);
			
					break;
				case "system":
					analyze.pushContainer(container1,edges,prev,["s","html","system"]);
			
					break;
				case "control":
					analyze.pushContainer(container1,edges,prev,["s","html","system"]);
			
					break;
				case "if":
					var container2 = [];
					container2[val1.sequence.length * 2] = [];
					container2[val1.sequence.length * 2 + 1] = [];
					utils.forList(val1.sequence,function(val2,j) {
						if(val2.condition && val2.condition.length) {
							container2[j * 2] = [];
							
							var container3 = [];
							analyze.buildFlowchartDiagram(val2.condition,container3,edges);
							container2[j * 2][j] = ["[",container3];
						}
						
						if(j < val1.sequence.length - 1) {
							container2[j * 2 + 1] = [];
							
							container2[j * 2 + 1][j] = ["s",val2.res[2],"if"];
						}
						
						var container4 = [];
						if(val2.statement.length) {
							analyze.buildFlowchartDiagram(val2.statement,container4,edges);
						}
						if(j) {
							container4.push([["s","break","control"]]);
						}
						container2[val1.sequence.length * 2 + 1][j] = ["[",container4];
						
						
						if(!j) {
							if(val2.condition && val2.condition.length) {
								if(prev[0])
									edges.push([[prev[0],1],[container3[0][0],0]]);
								edges.push([[container3[container3.length - 1][0],1],[container2[j * 2 + 1][j],0]]);
							}
							else {
								if(prev[0])
									edges.push([[prev[0],1],[container2[j * 2 + 1][j],0]]);
							}
							
							if(val2.statement.length)
								edges.push([[container2[j * 2 + 1][j],1],[container4[0][0],0]]);
						}
						else {
							if(j < val1.sequence.length - 1) {
								if(val2.condition && val2.condition.length) {
									edges.push([[container2[(j - 1) * 2 + 1][j - 1],3],[container3[0][0],0]]);
									edges.push([[container3[container3.length - 1][0],1],[container2[j * 2 + 1][j],0]]);
								}
								else {
									edges.push([[container2[(j - 1) * 2 + 1][j - 1],3],[container2[j * 2 + 1][j],0]]);
								}
							
								edges.push([[container2[j * 2 + 1][j],1],[container4[0][0],0]]);
							}
							else {
								edges.push([[container2[(j - 1) * 2 + 1][j - 1],3],[container4[0][0],0]]);
							}
							
							if(val2.statement.length) {
								var end = container4[container4.length - 2][0];
								if(end[0] == "s" && (!end[3] || !end[3].noedge)) {
									edges.push([[end,1],[container4[container4.length - 1][0],0]]);
								}
							}
						}
					});
					container1.push([["[",container2]]);
					prev[0] = null;
					analyze.pushContainer(container1,edges,prev,["s","break","control"]);
					
					var end = container2[val1.sequence.length * 2 + 1][0][1];
					if(end.length) {
						end = end[end.length - 1][0];
						if(end[0] == "s" && (!end[3] || !end[3].noedge)) {
							edges.push([[end,1],[prev[0],0]]);
						}
					}
					else {
						edges.push([[container2[1][0],1],[prev[0],0]]);
					}
					
					//console.log(val1.sequence);
			
					break;
				case "while":
					analyze.pushContainer(container1,edges,prev,["s","html","system"]);
			
					break;
				case "function":
					analyze.pushContainer(container1,edges,prev,["s","","control"]);
					analyze.pushContainer(container1,edges,prev,["s","","var"]);
					analyze.buildFlowchartDiagram(val1.sequence,container1,edges);
					prev[0] = null;
					analyze.pushContainer(container1,edges,prev,["s","","control"]);
				
					break;
				case "try":
					break;
				}
			});
			
			//while(type == "if")
			//if(exec.statement[0].statement.type != "control");
		},
		execAbstract: function() { // controlflow & dataflow & behavior
		},
	};
}