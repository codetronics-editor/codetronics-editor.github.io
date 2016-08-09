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
		
		
		
				worker.session.analyze.structure = [];
				var hasProjectRoot = false;
				utils.forList(worker.session.analyze.parse,function(val) {
					
					// outside project -> unparsed
					if(val.type != "project")
						val.unparsed = true;
						
					// update project root
					if(!hasProjectRoot && val.type == "project") {
						hasProjectRoot = true;
						worker.session.current.projectRoot = val;
					}
				});
				analyze.walkParsed({token: worker.session.analyze.parse},"r",[["[p","token"]],"","",-1);
				
				worker.session.analyze.outputFormat = [];
				utils.forList(worker.session.analyze.parse,function(val) {
					analyze.performPrint({token: val},[["p",null,"token"],["n"]]); //// unparsed whitespace
				});
			
				console.log("analyze pass " + analyze.passCtr + " finished at " + new Date());
			}
			catch(ex) { //// todo discard parsed & recover previous state
				console.log("analyze pass " + analyze.passCtr + " aborted at " + new Date()); //// leave path up compiled
				throw ex; ////
			}
		},
		walkParsed: function(token,type,structure,htmlname1,htmlpath,indent) {
			
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
					token = worker.session.current.projectNode[token.reference];
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
				
				// set parameters for this production
				structure = (production) ? production.structure : null;
				visibleRoot = (token.config) ? token.config.id : null;
				
				
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
				var htmlname2 = (type != "r" && type != "u") ? (grammar.short[val1[1]] || val1[1]) : "";
				
				switch(val1[0]) {
				case "p":
					analyze.walkParsed([token,val1[1]],"p",null,htmlname2,htmlpath,indent + 1);
			
					break;
				case "{":
					analyze.walkParsed(token[val1[1]],"{",val1[2],htmlname2,htmlpath,indent + 1);
			
					break;
				case "[{":
					utils.forList(token[val1[1]],function(val2,i) {
						analyze.walkParsed(val2,"{",val1[2],htmlname2 + i,htmlpath,indent + 1);
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
							analyze.walkParsed({token: descendant},"u",[["[p","token"]],"",htmlpath,indent + 1);
							unparsed = [];
						}
						
						// walk parsed
						if(parsed) {
							var htmlname3 = (type != "r" && type != "u") ? (htmlname2 + i) : "";
							
							analyze.walkParsed([token[val1[1]],p],"p",null,htmlname3,htmlpath,indent + 1);
							
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
							if(val2.type == "reference") {
								val2 = worker.session.current.projectNode[val2.reference];
							}
							
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
		execFlowchart: function(token,context) { // transform parse tree with execution order
			
			//// spec: behavior
			
			switch(token.type) {
			case "if":
				path.push(["if",token.statement,token.else]);
				
				break;
			case "switch":
				//// break at end or empty
				
				path.push(["if",token.statement,token.else]);
				
				break;
			case "while":
				path.push(["for",token.statement,token.else]);
				
				break;
			case "for":
				path.push(["for",token.statement,token.else]);
				
				break;
			case "for in":
				path.push(["for in",token.statement,token.else]);
				
				break;
			case "try":
				path.push(["try",token.statement,token.else]);
				
				break;
			case "block":
				
				break;
			case "var":
				
				break;
			case "continue":
				
				break;
			case "break":
				
				break;
			case "return":
				
				break;
			case "throw":
				
				break;
			case "?":
				
				break;
			case "=":
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
				
				break;
			case "||":
			case "&&":
			case "|":
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
				
				break;
			case "!":
			case "~":
			case "++x":
			case "--x":
			case "x++":
			case "x--":
				
				break;
			case ".":
				
				break;
			case "[":
				
				break;
			case "invocation":
				
				break;
			case "typeof":
				
				break;
			case "expression;":
			case "map":
			case "list":
			case "parenthese":
				console.log("exec flowchart: invalid type in function " + token.type);
				
				throw new Error();
			}
		},
		execAbstract: function() { // controlflow & dataflow & behavior
		},
	};
}