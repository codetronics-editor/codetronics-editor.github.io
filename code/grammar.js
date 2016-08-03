function setup_grammar() {
	function configToken() {
		return ["?","config",[
			["p","config","config"]
		]];
	}
	function genBinaryPattern(list,parsedEx) {
		var production = {
			iterate: true,
			production: [],
		};
		utils.forList(list,function(val1) {
			var key2 = (typeof(val1) == "object") ? val1[0] : val1;
			var val2 = (typeof(val1) == "object") ? val1[1] : val1;
			production.production[key2] = {
				structure: [
					["p","left"],
					["p","right"]
				],
				pattern: [
					["p","expression","left"]," ",configToken(),val2," ",["p","expression","right"]
				],
				parse: function(val3) {
					var res3 = utils.clone(val3);
					
					res3.config = val3.config || {}; ////
					
					res3.left = parseParenthese(val3.left);
					res3.right = parseParenthese(val3.right);
					
					res3.parsed = val3.parsed && (!parsedEx || parsedEx(res3));
					
					return res3;
				},
				print: function(val3) {
					var res3 = utils.clone(val3);
					
					res3.config = val3.config;
					
					res3.left = printParenthese(val3.left,"sequence",val3);
					res3.right = printParenthese(val3.right,"sequence",val3);
					
					return res3;
				},
			};
		});
		return production;
	}
	function genPrefixPattern(list,parsedEx) {
		var production = {
			iterate: true,
			production: [],
		};
		utils.forList(list,function(val1) {
			var key2 = (typeof(val1) == "object") ? val1[0] : val1;
			var val2 = (typeof(val1) == "object") ? val1[1] : val1;
			production.production[key2] = {
				structure: [
					["p","left"]
				],
				pattern: [
					configToken(),val2," ",["p","expression","left"]
				],
				parse: function(val3) {
					var res3 = utils.clone(val3);
					
					res3.config = val3.config || {}; ////
					
					res3.left = parseParenthese(val3.left);
					
					res3.parsed = val3.parsed && (!parsedEx || parsedEx(res3));
					
					return res3;
				},
				print: function(val3) {
					var res3 = utils.clone(val3);
					
					res3.config = val3.config;
					
					res3.left = printParenthese(val3.left,"sequence",val3);
					
					return res3;
				},
			};
		});
		return production;
	}
	function genPostfixPattern(list,parsedEx) {
		var production = {
			iterate: true,
			production: [],
		};
		utils.forList(list,function(val1) {
			var key2 = (typeof(val1) == "object") ? val1[0] : val1;
			var val2 = (typeof(val1) == "object") ? val1[1] : val1;
			production.production[key2] = {
				structure: [
					["p","left"]
				],
				pattern: [
					["p","expression","left"]," ",configToken(),val2
				],
				parse: function(val3) {
					var res3 = utils.clone(val3);
					
					res3.config = val3.config || {}; ////
					
					res3.left = parseParenthese(val3.left);
					
					res3.parsed = val3.parsed && (!parsedEx || parsedEx(res3));
					
					return res3;
				},
				print: function(val3) {
					var res3 = utils.clone(val3);
					
					res3.config = val3.config;
					
					res3.left = printParenthese(val3.left,"sequence",val3);
					
					return res3;
				},
			};
		});
		return production;
	}
	function parseParenthese(expression) {
		var i = 0;
		for(; expression.type == "parenthese"; ++i)
			expression = expression.expression;
		if(i)
			expression.parenthese = i;
		return expression;
	}
	function printParenthese(expression,mode,val1) {  //// tree write  a+(b+c) != a+b+c
		var i = {
			restore:  0,  // restore exact group count before parsing
			group:    1,  // restore, but group at least once
			              // restore, but group at least once if contained.type < container.type
			sequence: (grammar.production[expression.type][1] < grammar.production[val1.type][1]) ? 1 : 0,
		}[mode];
		i = expression.parenthese || i;
		for(; i; --i)
			expression = {
				type: "parenthese",
				expression: expression,
			};
		return expression;
	}
	function parseExpression(statement) { ////
		return (statement.type == "expression;") ? statement.expression : statement;
	}
	function printExpression(statement) {
		return (grammar.categorize["expression"][statement.type]) ? {
			type: "expression;",
			expression: statement,
		} : statement;
	}
	
	////
	//// PARSE no print, PRINT no parse !!!
	//// pass already cloned, no return
	////
	
	//// literal/property/terminal id ?
	//// terminal parsed/unparsed ?
	
	return {
		pattern: [],
		production: {},
		group: {
			"{": ["{","}"],
			"(": ["(",")"],
			"[": ["[","]"],
		},
		sequence: [
		
			// structure
			{
				production: {   //// tolerate unparsed in project, package and class
					project: {
						structure: [
							["[p","entry"]
						],
						pattern: [
							configToken(),"project"," ",["p","string","name"]," ",["g","{","entry",[
								["n"],
									["i",+1],["*","entry",[
										["p$","package","entry"],["n"],
										["n"]
									]],
								["i",-1]
							]]
						],
						parse: function(val1) {
							var res1 = utils.clone(val1);
							
							res1.config = val1.config || {}; ////
							res1.config.name = utils.unescapeQuote(val1.name.value.substring(1,val1.name.value.length - 1)); //// unescape
							
							res1.entry = [];
							utils.forList(val1.entry.entry,function(val2) {
								res1.entry.push(val2.entry);
							});
							
							delete res1.name;
							
							return res1;
						},
						print: function(val1) {
							var res1 = utils.clone(val1);
							
							res1.config = val1.config;
							
							res1.name = {
								type: "string",
								value: "\"" + utils.escapeQuote(val1.config.name) + "\"", //// escape
							};
							
							res1.entry = {entry: []};
							utils.forList(val1.entry,function(val2) {
								res1.entry.entry.push({entry: val2});
							});
							
							return res1;
						},
					},
				},
			},
			{
				production: {
					package: {
						structure: [
							["[p","entry"]
						],
						pattern: [
							configToken(),"package"," ",["p","identifier","name"]," ",["g","{","entry",[
								["n"],
									["i",+1],["*","entry",[
										["|$","entry",{
											package: [["p","package","entry"]],
											class: [["p","class","entry"]],
										}],["n"],
										["n"]
									]],
								["i",-1]
							]]
						],
						parse: function(val1) {
							var res1 = utils.clone(val1);
							
							res1.config = val1.config || {}; ////
							res1.config.name = val1.name.value;
							
							res1.entry = [];
							utils.forList(val1.entry.entry,function(val2) {
								res1.entry.push(val2.entry.entry);
							});
							
							delete res1.name;
							
							return res1;
						},
						print: function(val1) {
							var res1 = utils.clone(val1);
							
							res1.config = val1.config;
							
							res1.name = {
								type: "identifier",
								value: utils.makeIdentifier(val1.config.name),
							};
							
							res1.entry = {entry: []};
							utils.forList(val1.entry,function(val2) {
								var res2 = {};
								
								res2.entry = {entry: val2};
								res2.entry.production = val2.type;
								
								res1.entry.entry.push(res2);
							});
							
							return res1;
						},
					},
				},
			},
			{
				production: {
					class: {
						structure: [
							["[p","entry"]
						],
						pattern: [
							configToken(),"class"," ",["p","identifier","name"]," ",["g","{","entry",[
								["n"],
									["i",+1],["*","entry",[
										["|$","entry",{
											var: [["p","var","entry"]],
											function: [["p","function","entry"]],
										}],["?","separator",[  // print all
											";"
										]],["n"],
										["n"]
									]],
								["i",-1]
							]]
						],
						parse: function(val1) {
							var res1 = utils.clone(val1);
							
							res1.config = val1.config || {}; ////
							res1.config.name = val1.name.value;
							
							res1.entry = [];
							utils.forList(val1.entry.entry,function(val2) {
								res1.entry.push(val2.entry.entry);
							});
							
							delete res1.name;
							
							return res1;
						},
						print: function(val1) {
							var res1 = utils.clone(val1);
							
							res1.config = val1.config;
							
							res1.name = {
								type: "identifier",
								value: utils.makeIdentifier(val1.config.name),
							};
							
							res1.entry = {entry: []};
							utils.forList(val1.entry,function(val2) {
								var res2 = {};
								
								res2.entry = {entry: val2};
								res2.entry.production = val2.type;
								res2.separator = true;
								
								res1.entry.entry.push(res2);
							});
							
							return res1;
						},
					},
				},
			},
			{
				production: {
					function: {
						structure: [
							["[p","parameter"],
							["p","statement"]
						],
						pattern: [
							configToken(),"function"," ",["p","identifier","name"],":"," ",["g","(","parameter",[
								["*","parameter",[
									configToken(),["p","property","parameter"],["?","separator",[  // match last => unparsed
										","," "
									]]
								]]
							]]," ",["p","block","statement"]
						],
						parse: function(val1) {
							var res1 = utils.clone(val1);
							
							res1.config = val1.config || {}; ////
							res1.config.name = val1.name.value;
							
							res1.parsed = (!val1.parameter.parameter.length
								|| !val1.parameter.parameter[val1.parameter.parameter.length - 1].separator);
							
							res1.parameter = [];
							utils.forList(val1.parameter.parameter,function(val2) {
								var res2 = val2.parameter;
								
								res2.config = val2.config || {}; ////
								
								res1.parameter.push(res2);
							});
							
							res1.statement = val1.statement;
							
							delete res1.name;
							
							return res1;
						},
						print: function(val1) {
							var res1 = utils.clone(val1);
							
							res1.config = val1.config;
							
							res1.name = {
								type: "identifier",
								value: utils.makeIdentifier(val1.config.name),
							};
							
							res1.parameter = {parameter: []};
							utils.forList(val1.parameter,function(val2,i) {
								var res2 = {};
								
								res2.config = val2.config;
								
								res2.parameter = val2;
								res2.separator = (i < val1.parameter.length - 1);
								
								res1.parameter.parameter.push(res2);
							});
							
							res1.statement = val1.statement;
							
							return res1;
						},
					},
				},
			},
			
			// statement
			{
				production: {
					if: {
						structure: [
							["[{","statement",[
								["p","condition"],
								["p","statement"]
							]],
							["{","else",[
								["p","statement"]
							]]
						],
						pattern: [
							configToken(),"if",["g","(","condition",[
								["p","expression","condition"]
							]]," ",["p","block","statement"],["*","elseif",[
								["n"],"else"," ","if",["g","(","condition",[  //// make sibling unparsed
									["p","expression","condition"]
								]]," ",["p","block","statement"]
							]],["?","else",[
								["n"],"else"," ",["p","block","statement"]
							]]
						],
						parse: function(val1) {
							var res1 = utils.clone(val1);
							
							res1.config = val1.config || {}; ////
							
							res1.statement = [{
								condition: parseParenthese(val1.condition.condition),
								statement: val1.statement,
							}];
							
							utils.forList(val1.elseif,function(val2) {
								var res2 = {};
								
								res2.condition = parseParenthese(val2.condition.condition);
								res2.statement = val2.statement;
								
								res1.statement.push(res2);
							});
							
							res1.else = (val1.else) ? val1.else.else : null;
							
							delete res1.condition;
							delete res1.elseif;
							
							return res1;
						},
						print: function(val1) {
							var res1 = utils.clone(val1);
							
							res1.config = val1.config;
							
							res1.condition = {condition: printParenthese(val1.statement[0].condition,"restore")};
							res1.statement = val1.statement[0].statement;
							
							res1.elseif = [];
							utils.forList(val1.statement,function(val2,i) {
								if(i) {
									var res2 = {};
									
									res2.condition = {condition: printParenthese(val2.condition,"restore")};
									res2.statement = val2.statement;
									
									res1.elseif.push(res2);
								}
							});
							
							res1.else = (val1.else) ? {else: val1.else} : null;
							
							return res1;
						},
					},
				},
			},
			{
				production: {
					switch: {
						structure: [
							["p","expression"],
							["[{","statement",[
								["p","expression"],
								["[p","statement"]
							]],
							["{","default",[
								["[p","statement"]
							]]
						],
						pattern: [
							configToken(),"switch",["g","(","expression",[
								["p","expression","expression"]
							]]," ",["g","{","statement",[
								["n"],
								["*","statement",[
									"case"," ",["p","expression","expression"],":",["n"],
										["i",+1],["*","statement",[
											["p$","statement","statement"],["n"]
										]],
									["i",-1]
								]],
								["?","default",[
									"default",":",["n"],
										["i",+1],["*","statement",[
											["p$","statement","statement"],["n"]
										]],
									["i",-1]
								]]
							]]
						],
						parse: function(val1) {
							var res1 = utils.clone(val1);
							
							res1.config = val1.config || {}; ////
							
							res1.expression = parseParenthese(val1.expression.expression);
							
							res1.statement = [];
							utils.forList(val1.statement.statement,function(val2) {
								var res2 = {};
								
								res2.expression = parseParenthese(val2.expression);
								
								res2.statement = [];
								utils.forList(val2.statement,function(val3) {
									res2.statement.push(parseExpression(val3.statement));
								});
								
								res1.statement.push(res2);
							});
							
							if(val1.statement.default) {
								res1.default = {statement: []};
								utils.forList(val1.statement.default,function(val2) {
									res1.default.statement.push(parseExpression(val2.statement));
								});
							}
							
							return res1;
						},
						print: function(val1) {
							var res1 = utils.clone(val1);
							
							res1.config = val1.config;
							
							res1.expression = {expression: printParenthese(val1.expression,"restore")};
							
							res1.statement = {statement: []};
							utils.forList(val1.statement,function(val2) {
								var res2 = {};
								
								res2.expression = printParenthese(val2.expression,"restore");
								
								res2.statement = [];
								utils.forList(val2.statement,function(val3) {
									res2.statement.push({statement: printExpression(val3)});
								});
								
								res1.statement.push(res2);
							});
							
							if(val1.default) {
								res1.statement.default = {statement: []};
								utils.forList(val1.default.statement,function(val2) {
									res1.statement.default.statement.push({statement: printExpression(val2)});
								});
							}
							
							return res1;
						},
					},
				},
			},
			{
				production: {
					while: {
						structure: [
							["p","condition"],
							["p","statement"]
						],
						pattern: [
							configToken(),"while",["g","(","condition",[
								["p","expression","condition"]
							]]," ",["p","block","statement"]
						],
						parse: function(val1) {
							var res1 = utils.clone(val1);
							
							res1.config = val1.config || {}; ////
							
							res1.condition = parseParenthese(val1.condition.condition);
							res1.statement = val1.statement;
							
							return res1;
						},
						print: function(val1) {
							var res1 = utils.clone(val1);
							
							res1.config = val1.config;
							
							res1.condition = {condition: printParenthese(val1.condition,"restore")};
							res1.statement = val1.statement;
							
							return res1;
						},
					},
				},
			},
			{
				production: {
					for: {
						structure: [
							["p","var"],
							["p","condition"],
							["[p","step"],
							["p","statement"]
						],
						pattern: [
							configToken(),"for",["g","(","for",[
								["|","var",{
									var: [["p","var","var"]],
									";": [";"],
								}]," ",["?","condition",[
									["p","expression","condition"]
								]],";"," ",["*","step",[
									["p","statement","step"],["?","separator",[  // match last => unparsed
										","," "
									]]
								]]
							]]," ",["p","block","statement"]
						],
						parse: function(val1) {
							var res1 = utils.clone(val1);
							
							res1.config = val1.config || {}; ////
							
							res1.parsed = (!val1.for.step.length
								|| !val1.for.step[val1.for.step.length - 1].separator);
							
							res1.var = (val1.for.var.var) ? val1.for.var.var : null;
							res1.condition = (val1.for.condition) ? parseParenthese(val1.for.condition.condition) : null;
							
							res1.step = [];
							utils.forList(val1.for.step,function(val2) {
								res1.step.push(parseExpression(val2.step));
							});
							
							res1.statement = val1.statement;
							
							delete res1.for;
							
							return res1;
						},
						print: function(val1) {
							var res1 = utils.clone(val1);
							
							res1.config = val1.config;
							
							res1.for = {};
							res1.for.var = (val1.var) ? {var: val1.var} : {};
							res1.for.var.production = (val1.var) ? "var" : ";";
							res1.for.condition = (val1.condition) ? {condition: printParenthese(val1.condition,"restore")} : null;
							
							res1.for.step = [];
							utils.forList(val1.step,function(val2,i) {
								var res2 = {};
								
								val2.separator = false;
								res2.step = printExpression(val2);
								res2.separator = (i < val1.step.length - 1);
								
								res1.for.step.push(res2);
							});
							
							res1.statement = val1.statement;
							
							return res1;
						},
					},
				},
			},
			{
				production: {
					"for in": {
						structure: [
							["p","var"],
							["p","expression"],
							["p","statement"]
						],
						pattern: [
							configToken(),"for",["g","(","for",[
								["p","var","var"]," ","in"," ",["p","expression","expression"]
							]]," ",["p","block","statement"]
						],
						parse: function(val1) {
							var res1 = utils.clone(val1);
							
							res1.config = val1.config || {}; ////
							
							res1.parsed = (val1.for.var.var.length == 1 && !val1.for.var.var[0].expression);
							
							res1.var = val1.for.var;
							res1.expression = parseParenthese(val1.for.expression);
							res1.statement = val1.statement;
							
							delete res1.for;
							
							return res1;
						},
						print: function(val1) {
							var res1 = utils.clone(val1);
							
							res1.config = val1.config;
							
							res1.for = {};
							val1.var.separator = false;
							res1.var = val1.var,expression;
							res1.expression = printParenthese(val1.expression,"restore");
							res1.statement = val1.statement;
							
							return res1;
						},
					},
				},
			},
			{
				production: {
					try: {
						structure: [
							["p","statement"],
							["p","catch"],
							["p","finally"]
						],
						pattern: [
							configToken(),"try"," ",["p","block","statement"],["?","catch",[
								["n"],"catch",["e","(ex)"]," ",["p","block","catch"]
							]],["?","finally",[
								["n"],"finally"," ",["p","block","finally"]
							]]
						],
						parse: function(val1) {
							var res1 = utils.clone(val1);
							
							res1.config = val1.config || {}; ////
							
							res1.statement = val1.statement;
							res1.catch = (val1.catch) ? val1.catch.catch : null;
							res1.finally = (val1.finally) ? val1.finally.finally : null;
							
							return res1;
						},
						print: function(val1) {
							var res1 = utils.clone(val1);
							
							res1.config = val1.config;
							
							res1.statement = val1.statement;
							res1.catch = (val1.catch) ? {catch: val1.catch} : null;
							res1.finally = (val1.finally) ? {finally: val1.finally} : null;
							
							return res1;
						},
					},
				},
			},
			{
				production: {
					block: {  //// tolerate unparsed in block
						variant: true,
						structure: [
							["[p","statement"]
						],
						pattern: [
							configToken(),["g","{","statement",[
								["n"],
									["i",+1],["*","statement",[
										["p$","statement","statement"],["n"]
									]],
								["i",-1]
							]]
						],
						parse: function(val1) {
							var res1 = utils.clone(val1);
							
							res1.config = val1.config || {}; ////
							
							res1.statement = [];
							utils.forList(val1.statement.statement,function(val2) {
								res1.statement.push(parseExpression(val2.statement));
							});
							
							return res1;
						},
						print: function(val1) {
							var res1 = utils.clone(val1);
							
							res1.config = val1.config;
							
							res1.statement = {statement: []};
							utils.forList(val1.statement,function(val2) {
								res1.statement.statement.push({statement: printExpression(val2)});
							});
							
							return res1;
						},
					},
				},
			},
			{
				production: {
					var: {
						structure: [
							["[{","var",[
								["p","name"],
								["p","expression"]
							]]
						],
						pattern: [
							configToken(),"var"," ",["+","var",[
								configToken(),["|","var",{
									property: [["p","property","var"]],
									"=": [["p","=","var"]], // warning: variant xor iterate
								}],["?","separator",[  // match last => unparsed
									","," "
								]]
							]],["?","separator",[  // print all
								";"
							]]
						],
						parse: function(val1) {
							var res1 = utils.clone(val1);
							
							res1.config = val1.config || {}; ////
							
							res1.parsed = (!val1.var.length
								|| !val1.var[val1.var.length - 1].separator);
							
							res1.var = [];
							utils.forList(val1.var,function(val2) {
								var res2 = {};
								
								res2.name = val2.var.var;
								res2.expression = null;
								
								if(val2.var.production == "=") {
									if(val2.var.var.left.type == "property") {
										res2.name = val2.var.var.left;
										res2.expression = parseParenthese(val2.var.var.right);
									}
									else {
										res1.parsed = false;
									}
								}
								
								res2.config = val2.config || {}; ////
								res2.config.name = res2.name.value;
								
								res1.var.push(res2);
							});
							
							delete res1.separator;
							
							return res1;
						},
						print: function(val1) {
							var res1 = utils.clone(val1);
							
							res1.config = val1.config;
							
							res1.var = [];
							utils.forList(val1.var,function(val2,i) {
								var res2 = {};
								
								res2.config = val2.config;
								
								res2.var = {
									var: {
										type: "property",
										identifier: {
											type: "identifier",
											value: utils.makeIdentifier(val2.config.name),
										},
									},
								};
								res2.var.production = "property";
								if(val2.expression) {
									res2.var = {
										var: {
											type: "=",
											left: res2.var.var,
											right: printParenthese(val2.expression,"restore"),
										},
									};
									res2.var.production = "=";
								}
								res2.separator = (i < val1.var.length - 1);
								
								res1.var.push(res2);
							});
							
							res1.separator = true;
							
							return res1;
						},
					},
				},
			},
			{
				production: {
					continue: {
						pattern: [
							configToken(),"continue",["?","separator",[  // print all
								";"
							]]
						],
						parse: function(val1) {
							var res1 = utils.clone(val1);
							
							res1.config = val1.config || {}; ////
							
							delete res1.separator;
							
							return res1;
						},
						print: function(val1) {
							var res1 = utils.clone(val1);
							
							res1.config = val1.config;
							
							res1.separator = true;
							
							return res1;
						},
					},
				},
			},
			{
				production: {
					break: {
						pattern: [
							configToken(),"break",["?","separator",[  // print all
								";"
							]]
						],
						parse: function(val1) {
							var res1 = utils.clone(val1);
							
							res1.config = val1.config || {}; ////
							
							delete res1.separator;
							
							return res1;
						},
						print: function(val1) {
							var res1 = utils.clone(val1);
							
							res1.config = val1.config;
							
							res1.separator = true;
							
							return res1;
						},
					},
				},
			},
			{
				production: {
					return: {
						pattern: [
							configToken(),"return",["?","separator",[  // print all
								";"
							]]
						],
						parse: function(val1) {
							var res1 = utils.clone(val1);
							
							res1.config = val1.config || {}; ////
							
							delete res1.separator;
							
							return res1;
						},
						print: function(val1) {
							var res1 = utils.clone(val1);
							
							res1.config = val1.config;
							
							res1.separator = true;
							
							return res1;
						},
					},
				},
			},
			{
				production: {
					throw: {
						pattern: [
							configToken(),"throw",["e"," new Error()"],["?","separator",[  // print all
								";"
							]]
						],
						parse: function(val1) {
							var res1 = utils.clone(val1);
							
							res1.config = val1.config || {}; ////
							
							delete res1.separator;
							
							return res1;
						},
						print: function(val1) {
							var res1 = utils.clone(val1);
							
							res1.config = val1.config;
							
							res1.separator = true;
							
							return res1;
						},
					},
				},
			},
			{
				production: {
					"expression;": {
						variant: true,
						pattern: [
							["p","expression","expression"],["?","separator",[  // print all
								";"
							]]
						],
						parse: function(val1) {
							var res1 = utils.clone(val1);
							
							res1.expression = parseParenthese(val1.expression);
							
							delete res1.separator;
							
							return res1;
						},
						print: function(val1) {
							var res1 = utils.clone(val1);
							
							res1.expression = printParenthese(val1.expression,"restore");
							res1.separator = true;
							
							return res1;
						},
					},
				},
			},
			
			// expression
			{
				iterate: true,
				production: {
					"?": {
						structure: [
							["p","condition"],
							["p","expression"],
							["p","else"]
						],
						pattern: [
							["p","expression","condition"]," ",configToken(),"?"," ",["p","expression","expression"]," ",":"," ",["p","expression","else"]
						],
						parse: function(val1) {
							var res1 = utils.clone(val1);
							
							res1.config = val1.config || {}; ////
							
							res1.condition = parseParenthese(val1.condition);
							res1.expression = parseParenthese(val1.expression);
							res1.else = parseParenthese(val1.else);
							
							return res1;
						},
						print: function(val1) {
							var res1 = utils.clone(val1);
							
							res1.config = val1.config;
							
							res1.condition = printParenthese(val1.condition,"group");
							res1.expression = printParenthese(val1.expression,"sequence",val1);
							res1.else = printParenthese(val1.else,"sequence",val1);
							
							return res1;
						},
					},
				},
			},
			genBinaryPattern(["=","*=","/=","%=","+=","-=","<<=",">>=",">>>=","&=","^=","|="],function(res3) {
				return !!{".": true,"[": true,property: true}[res3.left.type];
			}),
			genBinaryPattern(["||"]),
			genBinaryPattern(["&&"]),
			genBinaryPattern(["|"]),
			genBinaryPattern(["^"]),
			genBinaryPattern(["&"]),
			genBinaryPattern(["==","===","!=","!=="]),
			genBinaryPattern(["<","<=",">",">="]),
			genBinaryPattern(["<<",">>",">>>"]),
			genBinaryPattern([["a+b","+"],["a-b","-"]]),
			genBinaryPattern(["*","/","%"]),
			genPrefixPattern(["!","~",["++x","++"],["--x","--"]],function(res3) {
				return !{"++x": true,"--x": true}[res3.type] || !!{".": true,"[": true,property: true}[res3.left.type];
			}),
			genPostfixPattern([["x++","++"],["x--","--"]],function(res3) {
				return !!{".": true,"[": true,property: true}[res3.left.type];
			}),
			{
				iterate: true,
				production: {
					".": {
						structure: [
							["p","expression"],
							["p","key"]
						],
						pattern: [
							["p","expression","expression"],configToken(),".",["p","identifier","key"]
						],
						parse: function(val1) {
							var res1 = utils.clone(val1);
							
							res1.config = val1.config || {}; ////
							
							res1.expression = parseParenthese(val1.expression);
							res1.key = val1.key;
							
							return res1;
						},
						print: function(val1) {
							var res1 = utils.clone(val1);
							
							res1.config = val1.config;
							
							res1.expression = printParenthese(val1.expression,"sequence",val1);
							res1.key = val1.key;
							
							return res1;
						},
					},
					"[": {
						structure: [
							["p","expression"],
							["p","key"]
						],
						pattern: [
							["p","expression","expression"],configToken(),["g","[","key",[
								["p","expression","key"]
							]]
						],
						parse: function(val1) {
							var res1 = utils.clone(val1);
							
							res1.config = val1.config || {}; ////
							
							res1.expression = parseParenthese(val1.expression);
							res1.key = parseParenthese(val1.key.key);
							
							return res1;
						},
						print: function(val1) {
							var res1 = utils.clone(val1);
							
							res1.config = val1.config;
							
							res1.expression = printParenthese(val1.expression,"sequence",val1);
							res1.key = {key: printParenthese(val1.key,"restore")};
							
							return res1;
						},
					},
					invocation: {
						structure: [
							["p","expression"],
							["[p","parameter"]
						],
						pattern: [
							["p","expression","expression"],configToken()," ",["g","(","parameter",[
								["*","parameter",[
									configToken(),["p","expression","parameter"],["?","separator",[  // match last => unparsed
										","," "
									]]
								]]
							]]
						],
						parse: function(val1) {
							var res1 = utils.clone(val1);
							
							res1.config = val1.config || {}; ////
							
							res1.parsed = (!val1.parameter.parameter.length
								|| !val1.parameter.parameter[val1.parameter.parameter.length - 1].separator);
							
							res1.expression = parseParenthese(val1.expression);
							
							res1.parameter = [];
							utils.forList(val1.parameter.parameter,function(val2) {
								var res2 = parseParenthese(val2.parameter);
								
								res2.config = val2.config || {}; ////
								
								res1.parameter.push(res2);
							});
							
							return res1;
						},
						print: function(val1) {
							var res1 = utils.clone(val1);
							
							res1.config = val1.config;
							
							res1.expression = printParenthese(val1.expression,"sequence",val1);
							
							res1.parameter = {parameter: []};
							utils.forList(val1.parameter,function(val2,i) {
								var res2 = {};
								
								res2.config = val2.config;
								
								res2.parameter = printParenthese(val2,"restore");
								res2.separator = (i < val1.parameter.length - 1);
								
								res1.parameter.parameter.push(res2);
							});
							
							return res1;
						},
					},
				},
			},
			{
				production: {
					map: {
						variant: true,
						structure: [
							["[{","entry",[
								["p","key"],
								["p","entry"]
							]]
						],
						pattern: [
							configToken(),["g","{","entry",[
								["n"],
									["i",+1],["*","entry",[
										["|","key",{
											identifier: [["p","identifier","key"]],
											string: [["p","string","key"]],
											number: [["p","number","key"]],
										}],":"," ",["p","expression","entry"],["?","separator",[  // print all
											",",["n"]
										]]
									]],["n"],
								["i",-1]
							]]
						],
						parse: function(val1) {
							var res1 = utils.clone(val1);
							
							res1.config = val1.config || {}; ////
							
							res1.entry = [];
							utils.forList(val1.entry.entry,function(val2) {
								var res2 = {};
								
								res2.key = val2.key.key;
								res2.entry = parseParenthese(val2.entry);
								
								res1.entry.push(res2);
							});
							
							return res1;
						},
						print: function(val1) {
							var res1 = utils.clone(val1);
							
							res1.config = val1.config;
							
							res1.entry = {entry: []};
							utils.forList(val1.entry,function(val2) {
								var res2 = {};
								
								res2.key = {key: val2.key};
								res2.key.production = val2.key.type;
								res2.entry = printParenthese(val2.entry,"restore");
								res2.separator = true;
								
								res1.entry.entry.push(res2);
							});
							
							return res1;
						},
					},
				},
			},
			{
				production: {
					list: {
						variant: true,
						structure: [
							["[p","entry"]
						],
						pattern: [
							configToken(),["g","[","entry",[
								["n"],
									["i",+1],["*","entry",[
										["p","expression","entry"],["?","separator",[  // match last => unparsed
											",",["n"]
										]]
									]],["n"],
								["i",-1]
							]]
						],
						parse: function(val1) {
							var res1 = utils.clone(val1);
							
							res1.config = val1.config || {}; ////
							
							res1.parsed = (!val1.entry.entry.length
								|| !val1.entry.entry[val1.entry.entry.length - 1].separator);
							
							res1.entry = [];
							utils.forList(val1.entry.entry,function(val2) {
								res1.entry.push(parseParenthese(val2.entry));
							});
							
							return res1;
						},
						print: function(val1) {
							var res1 = utils.clone(val1);
							
							res1.config = val1.config;
							
							res1.entry = {entry: []};
							utils.forList(val1.entry,function(val2,i) {
								var res2 = {};
								
								res2.entry = printParenthese(val2,"restore");
								res2.separator = (i < val1.entry.length - 1);
								
								res1.entry.entry.push(res2);
							});
							
							return res1;
						},
					},
				},
			},
			{
				production: {
					parenthese: {
						variant: true,
						pattern: [
							["g","(","expression",[
								["p","expression","expression"]
							]]
						],
						parse: function(val1) {
							var res1 = utils.clone(val1);
							
							res1.expression = val1.expression.expression;
							
							return res1;
						},
						print: function(val1) {
							var res1 = utils.clone(val1);
							
							res1.expression = {expression: val1.expression};
							
							return res1;
						},
					},
				},
			},
			{
				production: {
					typeof: {
						structure: [
							["p","expression"]
						],
						pattern: [
							configToken(),"typeof",["g","(","expression",[
								["p","expression","expression"]
							]]
						],
						parse: function(val1) {
							var res1 = utils.clone(val1);
							
							res1.config = val1.config || {}; ////
							
							res1.expression = parseParenthese(val1.expression.expression);
							
							return res1;
						},
						print: function(val1) {
							var res1 = utils.clone(val1);
							
							res1.config = val1.config;
							
							res1.expression = {expression: printParenthese(val1.expression,"group")};
							
							return res1;
						},
					},
				},
			},
			{
				production: {
					property: {
						variant: true, // map key
						pattern: [
							["p","identifier","identifier"]
						],
						parse: function(val1) {
							var res1 = utils.clone(val1);
							
							res1.parsed = !grammar.reserved[val1.identifier.value];
							
							res1.identifier = val1.identifier;
							
							return res1;
						},
						print: function(val1) {
							var res1 = utils.clone(val1);
							
							res1.identifier = val1.identifier;
							
							return res1;
						},
						extract: function(val1) { ////
						},
					},
				},
			},
			{
				production: {
					literal: {
						variant: true, // map key
						pattern: [
							["|","literal",{
								string: [["p","string","literal"]],
								number: [["p","number","literal"]],
								null: ["null"],
								true: ["true"],
								false: ["false"],
							}]
						],
						parse: function(val1) {
							var res1 = utils.clone(val1);
							
							res1.production = val1.literal.production;
							res1.value = (val1.literal.literal) ? val1.literal.literal.value : val1.literal.production;
							
							delete res1.literal;
							
							return res1;
						},
						print: function(val1) {
							var res1 = utils.clone(val1);
							
							res1.literal = {literal: val1.value || null};
							res1.literal.production = val1.production;
							
							return res1;
						},
						extract: function(val1) { ////
						},
					},
				},
			}
			
			// config
			//// contains id, formatting
			//// JSON.parse()
			//// hidden: true,
			//// "@",["g","{",[]] ////
		],
		token: {
			number: {
				pattern: [
					["|",[
						[  // 0x012F
							"0x",
							["+",[
								["c",[[0x0030,0x0039],[0x0041,0x0046]]]
							]]
						],
						[  // 12.34  //// execute: trim to prevent octal interpretation
							["+",[
								["c",[[0x0030,0x0039]]]
							]],
							["?",[
								".",
								["+",[
									["c",[[0x0030,0x0039]]]
								]]
							]]
						]
					]]
				],
			},
			punctuator: {
				pattern: [
					["|",[
						["@"],
						["{"],["}"],["("],[")"],["["],["]"],  // group: map, list, parenthese
						[";"],[","],[":"],
						["?"],
						["*="],["/="],["%="],["+="],["-="],["<<="],[">>="],[">>>="],["&="],["^="],["|="],
						["||"],
						["&&"],
						["|"],
						["^"],
						["&"],
						["!=="],["!="],["==="],["=="],
						["<<"],[">>>"],[">>"],
						["<="],["<"],[">="],[">"],
						["*"],["/"],["%"],
						["!"],["~"],["++"],["--"],  // ++x, --x  // -a => (0 - a)
						// ["++"],["--"],  // x++, x--
						["."],  // [], invocation
						// typeof
						// property, literal: string, number, null, true, false
						["="],
						["+"],["-"]  // a+b, a-b
					]]
				],
			},
			string: {
				pattern: [
					["|",[
						[  // string in double quotes
							"\"",["*",[
								["|",[
									[  // escaped all
										"\\",
										["c",[[0x0000,0xFFFF]]]
									],
									[  // all except double quote and escape
										["c",[[0x0000,0x0021],[0x0023,0x005B],[0x005C,0xFFFF]]]
									]
								]]
							]],"\""
						],
						/*[  // string in single quotes
							"\'",["*",[
								["|",[
									[  // escaped all
										"\\",
										["c",[[0x0000,0xFFFF]]]
									],
									[  // all except single quote and escape
										["c",[[0x0000,0x0026],[0x0028,0x005B],[0x005C,0xFFFF]]]
									]
								]]
							]],"\'"
						]*/
					]]
				],
			},
			identifier: {
				pattern: [
					// A..Z,"_",a..z,0x0080..0xFFFF (does not start with number)
					["c",[[0x0041,0x005A],[0x005F,0x005F],[0x0061,0x007A],[0x0080,0xFFFF]]],
					
					// 0..9,A..Z,"_",a..z,0x0080..0xFFFF
					["*",[
						["c",[[0x0030,0x0039],[0x0041,0x005A],[0x005F,0x005F],[0x0061,0x007A],[0x0080,0xFFFF]]]
					]]
				],
			},
			whitespace: {
				pattern: [
					["+",[
						["c",[[0x0000,0x0020]]]
					]]
				],
			},
		},
		categorize: {
			statement: {
				block: true,
				if: true,
				switch: true,
				while: true,
				for: true,
				"for in": true,
				try: true,
				var: true,
				continue: true,
				break: true,
				return: true,
				throw: true,
				"expression;": true,
			},
			expression: {
				"?": true,
				"=": true,
				"*=": true,
				"/=": true,
				"%=": true,
				"+=": true,
				"-=": true,
				"<<=": true,
				">>=": true,
				">>>=": true,
				"&=": true,
				"^=": true,
				"|=": true,
				"||": true,
				"&&": true,
				"|": true,
				"^": true,
				"&": true,
				"==": true,
				"===": true,
				"!=": true,
				"!==": true,
				"<": true,
				"<=": true,
				">": true,
				">=": true,
				"<<": true,
				">>": true,
				">>>": true,
				"a+b": true,
				"a-b": true,
				"*": true,
				"/": true,
				"%": true,
				"!": true,
				"~": true,
				"++x": true,
				"--x": true,
				"x++": true,
				"x--": true,
				".": true,
				"[": true,
				invocation: true,
				map: true,
				list: true,
				parenthese: true,
				typeof: true,
				property: true,
				literal: true,
			},
		},
		reserved: {
			project: true,
			
			break: true,
			case: true,
			catch: true,
			continue: true,
			debugger: true, //
			default: true,
			delete: true,
			do: true, //
			else: true,
			finally: true,
			for: true,
			function: true,
			if: true,
			in: true,
			instanceof: true,
			new: true,
			return: true,
			switch: true,
			this: true, //
			throw: true,
			try: true,
			typeof: true,
			var: true,
			void: true, //
			while: true,
			with: true, //
			
			class: true,
			const: true,
			enum: true,
			export: true,
			extends: true,
			import: true,
			super: true,
			
			implements: true,
			interface: true,
			let: true,
			package: true,
			private: true,
			protected: true,
			public: true,
			static: true,
			yield: true,
			
			null: true,
			true: true,
			false: true,
			
			//// provide no apis (no math, number, string, array)
			//// forbid prototype, window, implicit window
			//// ? provide read only: length, NaN, Infinity, undefined
			
			//"Infinity",
			//"length",
			//"NaN",
			prototype: true,
			//"undefined"
		},
		short: {
			package: "pk",
			class: "cls",
			function: "fun",
			block: "blk",
			switch: "swi",
			while: "whl",
			"for in": "fin",
			list: "lst",
			invocation: "inv",
			parenthese: "par",
			typeof: "tof",
			property: "pro",
			literal: "lit",
			identifier: "ident",
			
			//// property naming: 
			//// literal naming: string, number, null, true, false
			
			config: "cfg",
			entry: "n",
			statement: "st",
			expression: "ex",
			condition: "cd",
			else: "el",
			catch: "cat",
			finally: "fly",
			left: "lef",
			right: "rig",
			parameter: "par",
		},
		
		// apply production AND keep string token
		//// formatting-nodes
		//// rewrite - compare
	};
}