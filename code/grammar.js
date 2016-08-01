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
				pattern: [
					["p","expression","left"]," ",configToken(),val2," ",["p","expression","right"]
				],
				parse: function(print) {
					var parse = JSON.parse(JSON.stringify(print));
					parse.left = parseParenthese(print.left);
					parse.right = parseParenthese(print.right);
					parse.parsed = parse.parsed && (!parsedEx || parsedEx(parse));
					return parse;
				},
				print: function(parse) {
					var print = JSON.parse(JSON.stringify(parse));
					print.left = printParenthese(parse.left,"sequence",parse);
					print.right = printParenthese(parse.right,"sequence",parse);
					return print;
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
				pattern: [
					configToken(),val2," ",["p","expression","left"]
				],
				parse: function(print) {
					var parse = JSON.parse(JSON.stringify(print));
					parse.left = parseParenthese(print.left);
					parse.parsed = parse.parsed && (!parsedEx || parsedEx(parse));
					return parse;
				},
				print: function(parse) {
					var print = JSON.parse(JSON.stringify(parse));
					print.left = printParenthese(parse.left,"sequence",parse);
					return print;
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
				pattern: [
					["p","expression","left"]," ",configToken(),val2
				],
				parse: function(print) {
					var parse = JSON.parse(JSON.stringify(print));
					parse.left = parseParenthese(print.left);
					parse.parsed = parse.parsed && (!parsedEx || parsedEx(parse));
					return parse;
				},
				print: function(parse) {
					var print = JSON.parse(JSON.stringify(parse));
					print.left = printParenthese(parse.left,"sequence",parse);
					return print;
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
	function printParenthese(expression,mode,parse) {  //// tree write  a+(b+c) != a+b+c
		var i = {
			restore:  0,  // restore exact group count before parsing
			group:    1,  // restore, but group at least once
			              // restore, but group at least once if contained.type < container.type
			sequence: (grammar.production[expression.type][1] < grammar.production[parse.type][1]) ? 1 : 0,
		}[mode];
		i = expression.parenthese || i;
		for(; i; --i)
			expression = {
				type: "parenthese",
				expression: expression,
			};
		return expression;
	}
	
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
						pattern: [
							configToken(),"project"," ",["p","string","name"]," ",["g","{","entry",[
								["n"],
									["i",+1],["+","entry",[
										["p","package","entry"],["n"],
										["n"]
									]],
								["i",-1]
							]]
						],
						parse: function(print) {
							var parse = JSON.parse(JSON.stringify(print));
							parse.config.name = utils.unescapeQuote(parse.name.value.substring(1,parse.name.value.length - 1)); //// unescape
							parse.entry = [];
							utils.forList(JSON.parse(JSON.stringify(print.entry.entry)),function(val) {
								parse.entry.push(val.entry);
							});
							return parse;
						},
						print: function(parse) {
							var print = JSON.parse(JSON.stringify(parse));
							print.name = {
								type: "string",
								value: "\"" + utils.escapeQuote(parse.config.name) + "\"", //// escape
							};
							print.entry = {entry: []};
							utils.forList(JSON.parse(JSON.stringify(parse.entry)),function(val) {
								print.entry.entry.push({entry: val});
							});
							return print;
						},
					},
				},
			},
			{
				production: {
					package: {
						pattern: [
							configToken(),"package"," ",["p","identifier","name"]," ",["g","{","entry",[
								["n"],
									["i",+1],["+","entry",[
										["|","entry",{
											package: [["p","package","entry"]],
											class: [["p","class","entry"]],
										}],["n"],
										["n"]
									]],
								["i",-1]
							]]
						],
						parse: function(print) {
							var parse = JSON.parse(JSON.stringify(print));
							parse.config.name = parse.name.value;
							parse.entry = [];
							utils.forList(JSON.parse(JSON.stringify(print.entry.entry)),function(val) {
								parse.entry.push(val.entry.entry);
							});
							return parse;
						},
						print: function(parse) {
							var print = JSON.parse(JSON.stringify(parse));
							print.name = {
								type: "identifier",
								value: utils.makeIdentifier(parse.config.name),
							};
							print.entry = {entry: []};
							utils.forList(JSON.parse(JSON.stringify(parse.entry)),function(val) {
								print.entry.entry.push({entry: {entry: val}});
							});
							return print;
						},
					},
				},
			},
			{
				production: {
					class: {
						pattern: [
							configToken(),"class"," ",["p","identifier","name"]," ",["g","{","entry",[
								["n"],
									["i",+1],["+","entry",[
										["|","entry",{
											var: [["p","var","entry"]],
											function: [["p","function","entry"]],
										}],";",["n"],
										["n"]
									]],
								["i",-1]
							]]
						],
						parse: function(print) {
							var parse = JSON.parse(JSON.stringify(print));
							parse.config.name = parse.name.value;
							parse.entry = [];
							utils.forList(JSON.parse(JSON.stringify(print.entry.entry)),function(val) {
								parse.entry.push(val.entry.entry);
							});
							return parse;
						},
						print: function(parse) {
							var print = JSON.parse(JSON.stringify(parse));
							print.name = {
								type: "identifier",
								value: utils.makeIdentifier(parse.config.name),
							};
							print.entry = {entry: []};
							utils.forList(JSON.parse(JSON.stringify(parse.entry)),function(val) {
								print.entry.entry.push({entry: {entry: val}});
							});
							return print;
						},
					},
				},
			},
			{
				production: {
					function: {
						pattern: [
							configToken(),"function"," ",["p","identifier","name"]," ",["g","(","parameter",[
								["*","parameter",[
									configToken(),["p","property","parameter"],["?","separator",[  // match last => unparsed
										","," "
									]]
								]]
							]]," ",["p","block","statement"]
						],
						parse: function(print) {
							var parse = JSON.parse(JSON.stringify(print));
							parse.parsed = (!print.parameter.parameter.length
								|| !print.parameter.parameter[print.parameter.parameter.length - 1].separator);
							parse.config.name = parse.name.value;
							parse.parameter = [];
							utils.forList(JSON.parse(JSON.stringify(print.parameter.parameter)),function(val) {
								val.parameter.config = val.config;
								delete val.separator;
								parse.parameter.push(val.parameter);
							});
							return parse;
						},
						print: function(parse) {
							var print = JSON.parse(JSON.stringify(parse));
							print.name = {
								type: "identifier",
								value: utils.makeIdentifier(parse.config.name),
							};
							print.parameter = {parameter: []};
							utils.forList(JSON.parse(JSON.stringify(parse.parameter)),function(val,i) {
								val = {parameter: val};
								val.config = val.parameter.config;
								val.separator = (i < parse.parameter.length - 1);
								print.parameter.parameter.push(val);
							});
							return print;
						},
					},
				},
			},
			
			// statement
			{
				production: {
					block: {  //// tolerate unparsed in block
						variant: true,
						pattern: [
							configToken(),["g","{","statement",[
								["n"],
									["i",+1],["*","statement",[
										["p","statement","statement"],["n"]
									]],
								["i",-1]
							]]
						],
						parse: function(print) {
							var parse = JSON.parse(JSON.stringify(print));
							parse.statement = [];
							utils.forList(JSON.parse(JSON.stringify(print.statement.statement)),function(val) {
								parse.statement.push(val.statement);
							});
							return parse;
						},
						print: function(parse) {
							var print = JSON.parse(JSON.stringify(parse));
							print.statement = {statement: []};
							utils.forList(JSON.parse(JSON.stringify(parse.statement)),function(val) {
								print.statement.statement.push({statement: val});
							});
							return print;
						},
					},
				},
			},
			{
				production: {
					if: {
						pattern: [
							configToken(),"if",["g","(","condition",[
								["p","expression","condition"]
							]]," ",["p","block","statement"],["*","elseif",[
								["n"],"else"," ","if",["g","(","condition",[  //// make sibling unparsed
									["p","expression","condition"]
								]]," ",["p","block","statement"]
							]],["?","else",[
								["n"],"else"," ",["p","block","else"]
							]]
						],
						parse: function(print) {
							var parse = JSON.parse(JSON.stringify(print));
							parse.statement = [{
								condition: parseParenthese(print.condition.condition),
								statement: print.statement,
							}];
							utils.forList(JSON.parse(JSON.stringify(print.elseif)),function(val) {
								val.condition = parseParenthese(val.condition.condition);
								parse.statement.push(val);
							});
							parse.else = (print.else) ? print.else.else : null;
							delete parse.elsif;
							return parse;
						},
						print: function(parse) {
							var print = JSON.parse(JSON.stringify(parse));
							print.condition = {condition: printParenthese(parse.statement[0].condition,"restore")};
							print.statement = parse.statement[0].statement;
							print.elseif = [];
							utils.forList(JSON.parse(JSON.stringify(parse.statement)),function(val,i) {
								if(i) {
									val.condition = {condition: printParenthese(val.condition,"restore")};
									print.elseif.push(val);
								}
							});
							print.else = (parse.else) ? {else: parse.else} : null;
							return print;
						},
					},
				},
			},
			{
				production: {
					switch: {
						pattern: [
							configToken(),"switch",["g","(","expression",[
								["p","expression","expression"]
							]]," ",["g","{","statement",[
								["n"],
								["*","statement",[
									"case"," ",["p","expression","expression"],":",["n"]
										["i",+1],["*","statement",[
											["p","statement","statement"],["n"]
										]],
									["i",-1]
								]],
								["?","default",[
									"default",":",["n"]
										["i",+1],["*","statement",[
											["p","statement","statement"],["n"]
										]],
									["i",-1]
								]]
							]]
						],
						parse: function(print) {
							var parse = JSON.parse(JSON.stringify(print));
							parse.expression = parseParenthese(print.expression.expression);
							parse.statement = [];
							utils.forList(JSON.parse(JSON.stringify(print.statement.statement)),function(val1) {
								var val2 = JSON.parse(JSON.stringify(val1));
								val2.expression = parseParenthese(val1.expression);
								val2.statement = [];
								utils.forList(JSON.parse(JSON.stringify(val1.statement)),function(val3) {
									val2.statement.push(val3.statement);
								});
								parse.statement.push(val2);
							});
							if(print.statement.default) {
								parse.default = {statement: []};
								utils.forList(JSON.parse(JSON.stringify(print.statement.default.statement)),function(val) {
									parse.default.statement.push(val.statement);
								});
							}
							return parse;
						},
						print: function(parse) {
							var print = JSON.parse(JSON.stringify(parse));
							print.expression = {expression: printParenthese(parse.expression,"restore")};
							print.statement = {statement: []};
							utils.forList(JSON.parse(JSON.stringify(parse.statement)),function(val1) {
								var val2 = JSON.parse(JSON.stringify(val1));
								val2.expression = printParenthese(val1.expression,"restore");
								val2.statement = [];
								utils.forList(JSON.parse(JSON.stringify(val1.statement)),function(val3) {
									val2.statement.push({statement: val3});
								});
								print.statement.push(val2);
							});
							if(parse.default) {
								print.statement.default = {statement: []};
								utils.forList(JSON.parse(JSON.stringify(parse.default.statement)),function(val) {
									print.statement.default.statement.push({statement: val});
								});
							}
							return print;
						},
					},
				},
			},
			{
				production: {
					while: {
						pattern: [
							configToken(),"while",["g","(","condition",[
								["p","expression","condition"]
							]]," ",["p","block","statement"]
						],
						parse: function(print) {
							var parse = JSON.parse(JSON.stringify(print));
							parse.condition = parseParenthese(print.condition.condition);
							return parse;
						},
						print: function(parse) {
							var print = JSON.parse(JSON.stringify(parse));
							print.condition = {condition: printParenthese(parse.condition,"restore")};
							return print;
						},
					},
				},
			},
			{
				production: {
					for: {
						pattern: [
							configToken(),"for",["g","(","for",[
								["?","var",[
									["p","var","var"]
								]],";"," ",["?","condition",[
									["p","expression","condition"]
								]],";"," ",["*","step",[
									["p","statement","step"],["?","separator",[  // match last => unparsed
										","," "
									]]
								]]
							]]," ",["p","block","statement"]
						],
						parse: function(print) {
							var parse = JSON.parse(JSON.stringify(print));
							parse.parsed = (!print.for.step.length
								|| !print.for.step[print.for.step.length - 1].separator);
							parse.var = (print.for.var) ? print.for.var.var : null;
							parse.condition = (print.for.condition) ? parseParenthese(print.for.condition.condition) : null;
							parse.step = [];
							utils.forList(JSON.parse(JSON.stringify(print.for.step)),function(val) {
								parse.step.push(val.step);
							});
							delete parse.for;
							return parse;
						},
						print: function(parse) {
							var print = JSON.parse(JSON.stringify(parse));
							print.for = {};
							print.for.var = (parse.var) ? {var: parse.var} : null;
							print.for.condition = (parse.condition) ? {condition: printParenthese(parse.condition,"restore")} : null;
							print.for.step = [];
							utils.forList(JSON.parse(JSON.stringify(parse.step)),function(val,i) {
								val = {step: val};
								val.separator = (i < parse.step.length - 1);
								print.for.step.push(val);
							});
							return print;
						},
					},
				},
			},
			{
				production: {
					"for in": {
						pattern: [
							configToken(),"for",["g","(","for",[
								["p","var","var"]," ","in"," ",["p","expression","expression"]
							]]," ",["p","block","statement"]
						],
						parse: function(print) {
							var parse = JSON.parse(JSON.stringify(print));
							parse.parsed = (print.for.var.var.length == 1 && !print.for.var.var[0].expression);
							parse.var = print.for.var;
							parse.expression = parseParenthese(print.for.expression);
							delete parse.for;
							return parse;
						},
						print: function(parse) {
							var print = JSON.parse(JSON.stringify(parse));
							print.for = {var: parse.var,expression: printParenthese(parse.expression,"restore")};
							return print;
						},
					},
				},
			},
			{
				production: {
					try: {
						pattern: [
							configToken(),"try"," ",["p","block","statement"],["?","catch",[
								["n"],"catch",["e","(ex)"]," ",["p","block","catch"]
							]],["?","finally",[
								["n"],"finally"," ",["p","block","finally"]
							]]
						],
						parse: function(print) {
							var parse = JSON.parse(JSON.stringify(print));
							parse.catch = (print.catch) ? print.catch.catch : null;
							parse.finally = (print.finally) ? print.finally.finally : null;
							return parse;
						},
						print: function(parse) {
							var print = JSON.parse(JSON.stringify(parse));
							print.catch = (parse.catch) ? {catch: parse.catch} : null;
							print.finally = (parse.finally) ? {finally: parse.finally} : null;
							return print;
						},
					},
				},
			},
			{
				production: {
					var: {
						pattern: [
							"var"," ",["+","var",[
								configToken(),["|","var",{
									property: [["p","property","var"]],
									"=": [["p","=","var"]], // warning: variant xor iterate
								}],["?","separator",[  // match last => unparsed
									","," "
								]]
							]],";"
						],
						parse: function(print) {
							var parse = JSON.parse(JSON.stringify(print));
							parse.parsed = (!print.var.length || !print.var[print.var.length - 1].separator);
							parse.var = [];
							utils.forList(JSON.parse(JSON.stringify(print.var)),function(val) {
								val.name = val.var.var;
								val.expression = null;
								if(val.var.production == "=") {
									if(val.var.var.left.type == "property") {
										val.name = val.var.var.left;
										val.expression = parseParenthese(val.var.var.right);
									}
									else {
										parse.parsed = false;
									}
								}
								val.config.name = val.name.value;
								delete val.separator;
								parse.var.push(val);
							});
							return parse;
						},
						print: function(parse) {
							var print = JSON.parse(JSON.stringify(parse));
							print.var = [];
							utils.forList(JSON.parse(JSON.stringify(parse.var)),function(val,i) {
								val.var = {
									var: {
										type: "property",
										identifier: {
											type: "identifier",
											value: utils.makeIdentifier(parse.config.name),
										},
									},
								};
								if(val.expression) {
									val.var = {
										var: {
											type: "=",
											left: val.var.var,
											right: printParenthese(val.expression,"restore"),
										},
									};
								}
								val.separator = (i < parse.step.length - 1);
								print.var.push(val);
							});
							return print;
						},
					},
				},
			},
			{
				production: {
					continue: {
						pattern: [
							"continue",";"
						],
						parse: function(print) {
							return JSON.parse(JSON.stringify(print));
						},
						print: function(parse) {
							return JSON.parse(JSON.stringify(parse));
						},
					},
				},
			},
			{
				production: {
					break: {
						pattern: [
							"break",";"
						],
						parse: function(print) {
							return JSON.parse(JSON.stringify(print));
						},
						print: function(parse) {
							return JSON.parse(JSON.stringify(parse));
						},
					},
				},
			},
			{
				production: {
					return: {
						pattern: [
							"return",";"
						],
						parse: function(print) {
							return JSON.parse(JSON.stringify(print));
						},
						print: function(parse) {
							return JSON.parse(JSON.stringify(parse));
						},
					},
				},
			},
			{
				production: {
					throw: {
						pattern: [
							"throw",["e"," new Error()"],";"
						],
						parse: function(print) {
							return JSON.parse(JSON.stringify(print));
						},
						print: function(parse) {
							return JSON.parse(JSON.stringify(parse));
						},
					},
				},
			},
			{
				production: {
					"expression;": {
						pattern: [
							["p","expression","expression"],";"
						],
						parse: function(print) {
							var parse = JSON.parse(JSON.stringify(print));
							parse.expression = parseParenthese(print.expression);
							return parse;
						},
						print: function(parse) {
							var print = JSON.parse(JSON.stringify(parse));
							print.expression = printParenthese(parse.expression,"restore");
							return print;
						},
					},
				},
			},
			
			// expression
			{
				iterate: true,
				production: {
					"?": {
						pattern: [
							["p","expression","condition"]," ",configToken(),"?"," ",["p","expression","expression"]," ",":"," ",["p","expression","else"]
						],
						parse: function(print) {
							var parse = JSON.parse(JSON.stringify(print));
							parse.condition = parseParenthese(print.condition);
							parse.expression = parseParenthese(print.expression);
							parse.else = parseParenthese(print.else);
							return parse;
						},
						print: function(parse) {
							var print = JSON.parse(JSON.stringify(parse));
							print.condition = printParenthese(parse.condition,"group");
							print.expression = printParenthese(parse.expression,"sequence",parse);
							print.else = printParenthese(parse.else,"sequence",parse);
							return print;
						},
					},
				},
			},
			genBinaryPattern(["=","*=","/=","%=","+=","-=","<<=",">>=",">>>=","&=","^=","|="],function(parse) {
				return !!{".": true,"[": true,property: true}[parse.left.type];
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
			genPrefixPattern(["!","~",["++x","++"],["--x","--"]],function(parse) {
				return !{"++x": true,"--x": true}[parse.type] || !!{".": true,"[": true,property: true}[parse.left.type];
			}),
			genPostfixPattern([["x++","++"],["x--","--"]],function(parse) {
				return !!{".": true,"[": true,property: true}[parse.left.type];
			}),
			{
				iterate: true,
				production: {
					".": {
						pattern: [
							["p","expression","expression"],configToken(),".",["p","identifier","key"]
						],
						parse: function(print) {
							var parse = JSON.parse(JSON.stringify(print));
							parse.expression = parseParenthese(print.expression);
							return parse;
						},
						print: function(parse) {
							var print = JSON.parse(JSON.stringify(parse));
							print.expression = printParenthese(parse.expression,"sequence",parse);
							return print;
						},
					},
					"[": {
						pattern: [
							["p","expression","expression"],configToken(),["g","[","key",[
								["p","expression","key"]
							]]
						],
						parse: function(print) {
							var parse = JSON.parse(JSON.stringify(print));
							parse.expression = parseParenthese(print.expression);
							parse.key = parseParenthese(print.key.key);
							return parse;
						},
						print: function(parse) {
							var print = JSON.parse(JSON.stringify(parse));
							print.expression = printParenthese(parse.expression,"sequence",parse);
							print.key = {key: printParenthese(parse.key,"restore")};
							return print;
						},
					},
					invocation: {
						pattern: [
							["p","expression","expression"],configToken()," ",["g","(","parameter",[
								["*","parameter",[
									configToken(),["p","expression","parameter"],["?","separator",[  // match last => unparsed
										","," "
									]]
								]]
							]]
						],
						parse: function(print) {
							var parse = JSON.parse(JSON.stringify(print));
							parse.parsed = (!print.parameter.parameter.length
								|| !print.parameter.parameter[print.parameter.parameter.length - 1].separator);
							parse.expression = parseParenthese(print.expression);
							parse.parameter = [];
							utils.forList(JSON.parse(JSON.stringify(print.parameter.parameter)),function(val) {
								val.parameter = parseParenthese(val.parameter);
								delete val.separator;
								parse.parameter.push(val);
							});
							return parse;
						},
						print: function(parse) {
							var print = JSON.parse(JSON.stringify(parse));
							print.expression = printParenthese(parse.expression,"sequence",parse);
							print.parameter = {parameter: []};
							utils.forList(JSON.parse(JSON.stringify(parse.parameter)),function(val,i) {
								val.parameter = printParenthese(val.parameter,"restore");
								val.separator = (i < parse.parameter.length - 1);
								print.parameter.parameter.push(val);
							});
							return print;
						},
					},
				},
			},
			{
				production: {
					map: {
						variant: true,
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
						parse: function(print) {
							var parse = JSON.parse(JSON.stringify(print));
							parse.entry = [];
							utils.forList(JSON.parse(JSON.stringify(print.entry.entry)),function(val) {
								val.key = val.key.key;
								val.entry = parseParenthese(val.entry);
								delete val.separator;
								parse.entry.push(val);
							});
							return parse;
						},
						print: function(parse) {
							var print = JSON.parse(JSON.stringify(parse));
							print.entry = {entry: []};
							utils.forList(JSON.parse(JSON.stringify(parse.entry)),function(val) {
								val.production = val.key.type;
								val.key = {key: val.key};
								val.entry = printParenthese(val.entry,"restore");
								val.separator = true;
								print.entry.entry.push(val);
							});
							return print;
						},
					},
				},
			},
			{
				production: {
					list: {
						variant: true,
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
						parse: function(print) {
							var parse = JSON.parse(JSON.stringify(print));
							parse.parsed = (!print.entry.entry.length
								|| !print.entry.entry[print.entry.entry.length - 1].separator);
							parse.entry = [];
							utils.forList(JSON.parse(JSON.stringify(print.entry.entry)),function(val) {
								val = parseParenthese(val.entry);
								parse.entry.push(val);
							});
							return parse;
						},
						print: function(parse) {
							var print = JSON.parse(JSON.stringify(parse));
							print.entry = {entry: []};
							utils.forList(JSON.parse(JSON.stringify(parse.entry)),function(val,i) {
								val = {entry: printParenthese(val,"restore")};
								val.separator = (i < parse.entry.length - 1);
								print.entry.entry.push(val);
							});
							return print;
						},
					},
				},
			},
			{
				production: {
					parenthese: {
						variant: true,
						pattern: [
							configToken(),["g","(","expression",[
								["p","expression","expression"]
							]]
						],
						parse: function(print) {
							var parse = JSON.parse(JSON.stringify(print));
							parse.expression = print.expression.expression;
							return parse;
						},
						print: function(parse) {
							var print = JSON.parse(JSON.stringify(parse));
							print.expression = {expression: parse.expression};
							return print;
						},
					},
				},
			},
			{
				production: {
					typeof: {
						pattern: [
							configToken(),"typeof",["g","(","expression",[
								["p","expression","expression"]
							]]
						],
						parse: function(print) {
							var parse = JSON.parse(JSON.stringify(print));
							parse.expression = parseParenthese(print.expression.expression);
							return parse;
						},
						print: function(parse) {
							var print = JSON.parse(JSON.stringify(parse));
							print.expression = {expression: printParenthese(parse.expression,"group")};
							return print;
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
						parse: function(print) {
							var parse = JSON.parse(JSON.stringify(print));
							parse.parsed = !grammar.reserved[print.identifier.value];
							return parse;
						},
						print: function(parse) {
							return JSON.parse(JSON.stringify(parse));
						},
						extract: function(parse) { ////
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
						parse: function(print) {
							var parse = JSON.parse(JSON.stringify(print));
							parse.production = print.literal.production;
							parse.value = (print.literal.literal) ? print.literal.literal.value : print.literal.production;
							delete parse.literal;
							return parse;
						},
						print: function(parse) {
							var print = JSON.parse(JSON.stringify(parse));
							print.literal = {literal: parse.value || null};
							print.literal.production = parse.production;
							return print;
						},
						extract: function(parse) { ////
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
			punctuator: {
				pattern: [
					["|",[
						["@"],
						["{"],["}"],["("],[")"],["["],["]"],  // group: map, list, parenthese
						[";"],[","],[":"],
						["?"],
						["="],["*="],["/="],["%="],["+="],["-="],["<<="],[">>="],[">>>="],["&="],["^="],["|="],
						["||"],
						["&&"],
						["|"],
						["^"],
						["&"],
						["=="],["==="],["!="],["!=="],
						["<"],["<="],[">"],[">="],
						["<<"],[">>"],[">>>"],
						["+"],["-"],  // a+b, a-b
						["*"],["/"],["%"],
						["!"],["~"],["++"],["--"],  // ++x, --x  // -a => (0 - a)
						// ["++"],["--"],  // x++, x--
						["."]  // [], invocation
						// typeof
						// property, literal: string, number, null, true, false
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
				map: true,
				list: true,
				parenthese: true,
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
			project: "p",
			package: "pk",
			class: "cls",
			function: "fun",
			block: "blk",
			switch: "swi",
			while: "whl",
			"for in": "fin",
			list: "lst",
			parenthese: "par",
			invocation: "inv",
			typeof: "tof",
			
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
			left: "lt",
			right: "rt",
			parameter: "par",
		},
		
		// apply production AND keep string token
		//// formatting-nodes
		//// rewrite - compare
	};
}