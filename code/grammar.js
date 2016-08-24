function setup_grammar() {
	function configToken() {
		return ["?","config",[
			["p","config","config"]
		]];
	}
	function genPattern(type,list,parsedEx) {
		
		//// associative multiple operand list (=,+,*,||,&&,|,&,^)
		//// <,<=,==,  >,>=,==,  ==   exec
		//// . [
		//// map/list direct access convert
		//// unary minus
		
		var production = {
			iterate: true,
			production: [],
		};
		utils.forList(list,function(val1) {
			var key2 = (typeof(val1) == "object") ? val1[0] : val1;
			var val2 = (typeof(val1) == "object") ? val1[1] : val1;
			production.production[key2] = {
				config: true,
				structure: {
					"binary": [
						["p","left"],
						["p","right"]
					],
					"prefix": [
						["p","left"]
					],
					"postfix": [
						["p","left"]
					],
				}[type],
				pattern: {
					"binary": [
						["p","expression","left"]," ",configToken(),val2," ",["p","expression","right"]
					],
					"prefix": [
						configToken(),val2,["p","expression","left"]
					],
					"postfix": [
						["p","expression","left"],configToken(),val2
					],
				}[type],
				parse: function(val3) {
					var res3 = utils.clone(val3);
					
					res3.config = (val3.config) ? val3.config.config.value : {};
					
					res3.left = parseParenthese(val3.left);
					if(type == "binary")
						res3.right = parseParenthese(val3.right);
					
					res3.parsed = res3.parsed && (!parsedEx || parsedEx(res3));
					
					return res3;
				},
				print: function(val3) {
					var res3 = utils.clone(val3);
					
					res3.config = (val3.config) ? {config: {type: "config",value: val3.config}} : null;
					
					res3.left = printParenthese(val3.left,"sequence",val3);
					if(type == "binary")
						res3.right = printParenthese(val3.right,"sequence",val3);
					
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
			sequence: (val1 && grammar.production[expression.type]
				&& grammar.production[expression.type][1] < grammar.production[val1.type][1]) ? 1 : 0,
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
		return (!!grammar.categorize["expression"][statement.type]) ? {
			type: "expression;",
			expression: statement,
		} : statement;
	}
	function parseBlock(statement) { ////
		return statement.statement;
	}
	function printBlock(statement) {
		return {
			type: "block",
			statement: statement,
		};
	}
	
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
						config: true,
						structure: [
							["[p","entry"]
						],
						pattern: [
							configToken(),"project"," ",["p","string","name"]," ",["g","{","entry",[
								["n"],
									["i",+1],["*","entry",[
										["p$","package","entry"],["n"],["?","blank",[  // do not print last
											["n"]
										]]
									]],
								["i",-1]
							]]
						],
						parse: function(val1) {
							var res1 = utils.clone(val1);
							
							res1.config = (val1.config) ? val1.config.config.value : {};
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
							
							res1.config = (val1.config) ? {config: {type: "config",value: val1.config}} : null;
							
							res1.name = {
								terminal: true,
								type: "string",
								value: "\"" + utils.escapeQuote(val1.config.name) + "\"", //// escape
							};
							
							res1.entry = {entry: []};
							utils.forList(val1.entry,function(val2,i) {
								var res2 = {};
								
								res2.entry = val2;
								res2.blank = (i < val1.entry.length - 1);
								
								res1.entry.entry.push(res2);
							});
							
							return res1;
						},
					},
				},
			},
			{
				production: {
					package: {
						config: true,
						structure: [
							["[p","entry"]
						],
						pattern: [
							configToken(),"package"," ",["p","identifier","name"]," ",["g","{","entry",[
								["n"],
									["i",+1],["*","entry",[
										["|","entry",{
											package: [["p","package","entry"]],
											class: [["p","class","entry"]],
											"$": [["p$","$","entry"]],
										}],["n"],["?","blank",[  // do not print last
											["n"]
										]]
									]],
								["i",-1]
							]]
						],
						parse: function(val1) {
							var res1 = utils.clone(val1);
							
							res1.config = (val1.config) ? val1.config.config.value : {};
							res1.config.name = val1.name.value;
							
							res1.parsed = res1.parsed && !{"system": true}[res1.config.name];
							
							res1.entry = [];
							utils.forList(val1.entry.entry,function(val2) {
								res1.entry.push(val2.entry.entry);
							});
							
							delete res1.name;
							
							return res1;
						},
						print: function(val1) {
							var res1 = utils.clone(val1);
							
							res1.config = (val1.config) ? {config: {type: "config",value: val1.config}} : null;
							
							res1.name = {
								terminal: true,
								type: "identifier",
								value: utils.makeIdentifier(val1.config.name),
							};
							
							res1.entry = {entry: []};
							utils.forList(val1.entry,function(val2,i) {
								var res2 = {};
								
								res2.entry = {entry: val2};
								res2.entry.production = ({package: true,class: true}[val2.type]) ? val2.type : "$";
								res2.blank = (i < val1.entry.length - 1);
								
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
						config: true,
						structure: [
							["[p","entry"]
						],
						pattern: [
							configToken(),"class"," ",["p","identifier","name"]," ",["g","{","entry",[
								["n"],
									["i",+1],["*","entry",[
										["|","entry",{
											var: [["p","var","entry"]],
											function: [["p","function","entry"]],
											"$": [["p$","$","entry"]],
										}],["?","separator",[  // print all
											";"
										]],["n"],["?","blank",[  // do not print last
											["n"]
										]]
									]],
								["i",-1]
							]]
						],
						parse: function(val1) {
							var res1 = utils.clone(val1);
							
							res1.config = (val1.config) ? val1.config.config.value : {};
							res1.config.name = val1.name.value;
							
							res1.parsed = res1.parsed && !{"system": true}[res1.config.name];
							
							res1.entry = [];
							utils.forList(val1.entry.entry,function(val2) {
								res1.entry.push(val2.entry.entry);
							});
							
							delete res1.name;
							
							return res1;
						},
						print: function(val1) {
							var res1 = utils.clone(val1);
							
							res1.config = (val1.config) ? {config: {type: "config",value: val1.config}} : null;
							
							res1.name = {
								terminal: true,
								type: "identifier",
								value: utils.makeIdentifier(val1.config.name),
							};
							
							res1.entry = {entry: []};
							utils.forList(val1.entry,function(val2,i) {
								var res2 = {};
								
								res2.entry = {entry: val2};
								res2.entry.production = ({var: true,function: true}[val2.type]) ? val2.type : "$";
								res2.separator = !!{function: true}[val2.type];
								res2.blank = (i < val1.entry.length - 1);
								
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
						config: true,
						structure: [
							["[p","parameter"],
							["[p","statement"]
						],
						pattern: [
							configToken(),"function"," ",["p","identifier","name"],":"," ",["g","(","parameter",[  //// grammar problem 1
								["*","parameter",[
									configToken(),["p","identifier","parameter"],["?","separator",[  // match last => unparsed
										","," "
									]]
								]]
							]]," ",["p","block","statement"]
						],
						parse: function(val1) {
							var res1 = utils.clone(val1);
							
							res1.config = (val1.config) ? val1.config.config.value : {};
							res1.config.name = val1.name.value;
							
							res1.parsed = res1.parsed && !{"system": true}[res1.config.name];
							
							res1.parsed = res1.parsed && (!val1.parameter.parameter.length
								|| !val1.parameter.parameter[val1.parameter.parameter.length - 1].separator);
							
							res1.parameter = [];
							utils.forList(val1.parameter.parameter,function(val2) {
								var res2 = val2.parameter;
								
								res2.config = (val2.config) ? val2.config.config.value : {};
								
								res1.parameter.push(res2);
							});
							
							res1.statement = parseBlock(val1.statement);
							
							delete res1.name;
							
							return res1;
						},
						print: function(val1) {
							var res1 = utils.clone(val1);
							
							res1.config = (val1.config) ? {config: {type: "config",value: val1.config}} : null;
							
							res1.name = {
								terminal: true,
								type: "identifier",
								value: utils.makeIdentifier(val1.config.name),
							};
							
							res1.parameter = {parameter: []};
							utils.forList(val1.parameter,function(val2,i) {
								var res2 = {};
								
								res2.config = (val2.config) ? {config: {type: "config",value: val2.config}} : null;
								
								res2.parameter = val2;
								res2.separator = (i < val1.parameter.length - 1);
								
								res1.parameter.parameter.push(res2);
							});
							
							res1.statement = printBlock(val1.statement);
							
							return res1;
						},
					},
				},
			},
			
			// statement
			{
				production: {
					if: {
						config: true,
						structure: [
							["[{","statement",[
								["p","condition"],
								["[p","statement"]
							]],
							["{","else",[
								["[p","statement"]
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
							
							res1.config = (val1.config) ? val1.config.config.value : {};
							
							res1.statement = [{
								condition: parseParenthese(val1.condition.condition),
								statement: parseBlock(val1.statement),
							}];
							
							utils.forList(val1.elseif,function(val2) {
								var res2 = {};
								
								res2.condition = parseParenthese(val2.condition.condition);
								res2.statement = parseBlock(val2.statement);
								
								res1.statement.push(res2);
							});
							
							res1.else = (val1.else) ? {statement: parseBlock(val1.else.statement)} : null;
							
							delete res1.condition;
							delete res1.elseif;
							
							return res1;
						},
						print: function(val1) {
							var res1 = utils.clone(val1);
							
							res1.config = (val1.config) ? {config: {type: "config",value: val1.config}} : null;
							
							res1.condition = {condition: printParenthese(val1.statement[0].condition,"restore")};
							res1.statement = printBlock(val1.statement[0].statement);
							
							res1.elseif = [];
							utils.forList(val1.statement,function(val2,i) {
								if(i) {
									var res2 = {};
									
									res2.condition = {condition: printParenthese(val2.condition,"restore")};
									res2.statement = printBlock(val2.statement);
									
									res1.elseif.push(res2);
								}
							});
							
							res1.else = (val1.else) ? {statement: printBlock(val1.else.statement)} : null;
							
							return res1;
						},
					},
				},
			},
			{
				production: {
					switch: {
						config: true,
						structure: [
							["p","expression"],
							["[{","statement",[
								["[p","expression"],
								["[p","statement"]
							]],
							["{","else",[
								["[p","statement"]
							]]
						],
						pattern: [
							configToken(),"switch",["g","(","expression",[
								["p","expression","expression"]
							]]," ",["g","{","statement",[
								["n"],
								["*","statement",[
									["+","expression",[
										"case"," ",["p","expression","expression"],":",["n"]
									]],
										["i",+1],["*","statement",[
											["p$","statement","statement",{case: true,default: true}],["n"]
										]],
									["i",-1]
								]],
								["?","else",[
									"default",":",["n"],
										["i",+1],["*","statement",[
											["p$","statement","statement",{case: true,default: true}],["n"]
										]],
									["i",-1]
								]]
							]]
						],
						parse: function(val1) {
							var res1 = utils.clone(val1);
							
							res1.config = (val1.config) ? val1.config.config.value : {};
							
							res1.expression = parseParenthese(val1.expression.expression);
							
							res1.statement = [];
							utils.forList(val1.statement.statement,function(val2) {
								var res2 = {};
								
								res2.expression = [];
								utils.forList(val2.expression,function(val3) {
									res2.expression.push(parseParenthese(val3.expression));
								});
								
								res2.statement = [];
								utils.forList(val2.statement,function(val3) {
									res2.statement.push(parseExpression(val3.statement));
								});
								
								if(!res2.statement.length || !{continue: true,break: true,return: true,throw: true}[res2.statement[res2.statement.length - 1].type]) {
									res1.parsed = false;
								}
								
								res1.statement.push(res2);
							});
							
							if(val1.statement.else) {
								res1.else = {statement: []};
								utils.forList(val1.statement.else.statement,function(val2) {
									res1.else.statement.push(parseExpression(val2.statement));
								});
							}
							
							return res1;
						},
						print: function(val1) {
							var res1 = utils.clone(val1);
							
							res1.config = (val1.config) ? {config: {type: "config",value: val1.config}} : null;
							
							res1.expression = {expression: printParenthese(val1.expression,"restore")};
							
							res1.statement = {statement: []};
							utils.forList(val1.statement,function(val2) {
								var res2 = {};
								
								res2.expression = [];
								utils.forList(val2.expression,function(val3) {
									res2.expression.push({expression: printParenthese(val3,"restore")});
								});
								
								res2.statement = [];
								utils.forList(val2.statement,function(val3) {
									res2.statement.push({statement: printExpression(val3)});
								});
								
								res1.statement.statement.push(res2);
							});
							
							if(val1.else) {
								res1.statement.else = {statement: []};
								utils.forList(val1.else.statement,function(val2) {
									res1.statement.else.statement.push({statement: printExpression(val2)});
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
						config: true,
						structure: [
							["p","condition"],
							["[p","statement"]
						],
						pattern: [
							configToken(),"while",["g","(","condition",[
								["p","expression","condition"]
							]]," ",["p","block","statement"]
						],
						parse: function(val1) {
							var res1 = utils.clone(val1);
							
							res1.config = (val1.config) ? val1.config.config.value : {};
							
							res1.condition = parseParenthese(val1.condition.condition);
							res1.statement = parseBlock(val1.statement);
							
							return res1;
						},
						print: function(val1) {
							var res1 = utils.clone(val1);
							
							res1.config = (val1.config) ? {config: {type: "config",value: val1.config}} : null;
							
							res1.condition = {condition: printParenthese(val1.condition,"restore")};
							res1.statement = printBlock(val1.statement);
							
							return res1;
						},
					},
				},
			},
			{
				production: {
					for: {
						config: true,
						structure: [
							["p","var"],
							["p","condition"],
							["[p","step"],
							["[p","statement"]
						],
						pattern: [
							configToken(),"for",["g","(","for",[
								["|","var",{  //// grammar problem 2
									var: [["p","var","var"]],
									";": [";"],
								}]," ",["?","condition",[
									["p","expression","condition"]
								]],";"," ",["*","step",[
									["p","expression","step"],["?","separator",[  // match last => unparsed
										","," "
									]]
								]]
							]]," ",["p","block","statement"]
						],
						parse: function(val1) {
							var res1 = utils.clone(val1);
							
							res1.config = (val1.config) ? val1.config.config.value : {};
							
							res1.parsed = res1.parsed && (!val1.for.step.length
								|| !val1.for.step[val1.for.step.length - 1].separator);
							
							res1.var = (val1.for.var.var) ? val1.for.var.var : null;
							res1.condition = (val1.for.condition) ? parseParenthese(val1.for.condition.condition) : null;
							
							res1.step = [];
							utils.forList(val1.for.step,function(val2) {
								res1.step.push(parseParenthese(val2.step));
							});
							
							res1.statement = parseBlock(val1.statement);
							
							delete res1.for;
							
							return res1;
						},
						print: function(val1) {
							var res1 = utils.clone(val1);
							
							res1.config = (val1.config) ? {config: {type: "config",value: val1.config}} : null;
							
							res1.for = {};
							res1.for.var = (val1.var) ? {var: val1.var} : {};
							res1.for.var.production = (val1.var) ? "var" : ";";
							res1.for.condition = (val1.condition) ? {condition: printParenthese(val1.condition,"restore")} : null;
							
							res1.for.step = [];
							utils.forList(val1.step,function(val2,i) {
								var res2 = {};
								
								res2.step = printParenthese(val2,"restore");
								res2.separator = (i < val1.step.length - 1);
								
								res1.for.step.push(res2);
							});
							
							res1.statement = printBlock(val1.statement);
							
							return res1;
						},
					},
				},
			},
			{
				production: {
					"for in": {
						config: true,
						structure: [
							["p","var"],
							["p","expression"],
							["[p","statement"]
						],
						pattern: [
							configToken(),"for",["g","(","for",[
								["p","var","var"]," ","in"," ",["p","expression","expression"]
							]]," ",["p","block","statement"]
						],
						parse: function(val1) {
							var res1 = utils.clone(val1);
							
							res1.config = (val1.config) ? val1.config.config.value : {};
							
							res1.parsed = res1.parsed && (val1.for.var.var.length == 1 && !val1.for.var.var[0].expression);
							
							res1.var = val1.for.var;
							res1.expression = parseParenthese(val1.for.expression);
							res1.statement = parseBlock(val1.statement);
							
							delete res1.for;
							
							return res1;
						},
						print: function(val1) {
							var res1 = utils.clone(val1);
							
							res1.config = (val1.config) ? {config: {type: "config",value: val1.config}} : null;
							
							res1.for = {};
							res1.for.var = utils.clone(val1.var);
							res1.for.var.noseparator = true;
							res1.for.expression = printParenthese(val1.expression,"restore");
							res1.statement = printBlock(val1.statement);
							
							return res1;
						},
					},
				},
			},
			{
				production: {
					try: {
						config: true,
						structure: [
							["[p","statement"],
							["[p","catch"]
						],
						pattern: [
							configToken(),"try"," ",["p","block","statement"],["?","catch",[
								["n"],"catch",["e","(ex)"]," ",["p","block","catch"]
							]]
						],
						parse: function(val1) {
							var res1 = utils.clone(val1);
							
							res1.config = (val1.config) ? val1.config.config.value : {};
							
							res1.statement = parseBlock(val1.statement);
							res1.catch = (val1.catch) ? parseBlock(val1.catch.catch) : null;
							
							return res1;
						},
						print: function(val1) {
							var res1 = utils.clone(val1);
							
							res1.config = (val1.config) ? {config: {type: "config",value: val1.config}} : null;
							
							res1.statement = printBlock(val1.statement);
							res1.catch = (val1.catch) ? {catch: printBlock(val1.catch)} : null;
							
							return res1;
						},
					},
				},
			},
			{
				production: {
					block: {  //// tolerate unparsed in block
						
						//// parse/print block
						
						variant: true,
						config: true,
						structure: [
							["[p","statement"]
						],
						pattern: [
							configToken(),["g","{","statement",[  //// make sibling unparsed (map in block -> unparsed block)
								["n"],
									["i",+1],["*","statement",[
										["p$","statement","statement"],["n"]
									]],
								["i",-1]
							]]
						],
						parse: function(val1) {
							var res1 = utils.clone(val1);
							
							res1.config = (val1.config) ? val1.config.config.value : {};
							
							res1.statement = [];
							utils.forList(val1.statement.statement,function(val2) {
								res1.statement.push(parseExpression(val2.statement));
							});
							
							return res1;
						},
						print: function(val1) {
							var res1 = utils.clone(val1);
							
							res1.config = (val1.config) ? {config: {type: "config",value: val1.config}} : null;
							
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
						config: true,
						structure: [
							["[{","var",[
								["p","name"],
								["p","expression"]
							]]
						],
						pattern: [
							configToken(),"var"," ",["+","var",[
								configToken(),["|","var",{
									identifier: [["p","identifier","var"]],
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
							
							res1.config = (val1.config) ? val1.config.config.value : {};
							
							res1.parsed = res1.parsed && (!val1.var.length
								|| !val1.var[val1.var.length - 1].separator);
							
							res1.var = [];
							utils.forList(val1.var,function(val2) {
								var res2 = {};
								
								res2.name = val2.var.var;
								res2.expression = null;
								
								if(val2.var.production == "=") {
									if(val2.var.var.left.type == "property") {
										res2.name = val2.var.var.left.identifier;
										res2.expression = parseParenthese(val2.var.var.right);
									}
									else {
										res1.parsed = false;
									}
								}
								
								res2.config = (val2.config) ? val2.config.config.value : {};
								res2.config.name = res2.name.value;
								
								if({"system": true}[res2.config.name]) {
									res1.parsed = false;
								}
								
								res1.var.push(res2);
							});
							
							delete res1.separator;
							
							return res1;
						},
						print: function(val1) {
							var res1 = utils.clone(val1);
							
							res1.config = (val1.config) ? {config: {type: "config",value: val1.config}} : null;
							
							res1.var = [];
							utils.forList(val1.var,function(val2,i) {
								var res2 = {};
								
								res2.config = (val2.config) ? {config: {type: "config",value: val2.config}} : null;
								
								res2.var = {
									var: {
										terminal: true,
										type: "identifier",
										value: utils.makeIdentifier(val2.config.name),
									},
								};
								res2.var.production = "identifier";
								if(val2.expression) {
									res2.var = {
										var: {
											type: "=",
											left: {
												type: "property",
												identifier: res2.var.var,
											},
											right: printParenthese(val2.expression,"restore"),
										},
									};
									res2.var.production = "=";
								}
								res2.separator = (i < val1.var.length - 1);
								
								res1.var.push(res2);
							});
							
							res1.separator = !val1.noseparator;
							
							return res1;
						},
					},
				},
			},
			{
				production: {
					continue: {
						config: true,
						pattern: [
							configToken(),"continue",["?","separator",[  // print all
								";"
							]]
						],
						parse: function(val1) {
							var res1 = utils.clone(val1);
							
							res1.config = (val1.config) ? val1.config.config.value : {};
							
							delete res1.separator;
							
							return res1;
						},
						print: function(val1) {
							var res1 = utils.clone(val1);
							
							res1.config = (val1.config) ? {config: {type: "config",value: val1.config}} : null;
							
							res1.separator = true;
							
							return res1;
						},
					},
				},
			},
			{
				production: {
					break: {
						config: true,
						pattern: [
							configToken(),"break",["?","separator",[  // print all
								";"
							]]
						],
						parse: function(val1) {
							var res1 = utils.clone(val1);
							
							res1.config = (val1.config) ? val1.config.config.value : {};
							
							delete res1.separator;
							
							return res1;
						},
						print: function(val1) {
							var res1 = utils.clone(val1);
							
							res1.config = (val1.config) ? {config: {type: "config",value: val1.config}} : null;
							
							res1.separator = true;
							
							return res1;
						},
					},
				},
			},
			{
				production: {
					return: {
						config: true,
						pattern: [
							configToken(),"return",["?","separator",[  // print all
								";"
							]]
						],
						parse: function(val1) {
							var res1 = utils.clone(val1);
							
							res1.config = (val1.config) ? val1.config.config.value : {};
							
							delete res1.separator;
							
							return res1;
						},
						print: function(val1) {
							var res1 = utils.clone(val1);
							
							res1.config = (val1.config) ? {config: {type: "config",value: val1.config}} : null;
							
							res1.separator = true;
							
							return res1;
						},
					},
				},
			},
			{
				production: {
					throw: {
						config: true,
						pattern: [
							configToken(),"throw",["e"," new Error()"],["?","separator",[  // print all
								";"
							]]
						],
						parse: function(val1) {
							var res1 = utils.clone(val1);
							
							res1.config = (val1.config) ? val1.config.config.value : {};
							
							delete res1.separator;
							
							return res1;
						},
						print: function(val1) {
							var res1 = utils.clone(val1);
							
							res1.config = (val1.config) ? {config: {type: "config",value: val1.config}} : null;
							
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
						structure: [
							["p","expression"]
						],
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
			genPattern("binary",["=","*=","/=","%=","+=","-=","<<=",">>=",">>>=","&=","^=","|="],function(res3) {
				return !!{".": true,"[": true,property: true}[res3.left.type];
			}),
			{
				iterate: true,
				production: {
					"?": {
						config: true,
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
							
							res1.config = (val1.config) ? val1.config.config.value : {};
							
							res1.condition = parseParenthese(val1.condition);
							res1.expression = parseParenthese(val1.expression);
							res1.else = parseParenthese(val1.else);
							
							return res1;
						},
						print: function(val1) {
							var res1 = utils.clone(val1);
							
							res1.config = (val1.config) ? {config: {type: "config",value: val1.config}} : null;
							
							res1.condition = printParenthese(val1.condition,"group");
							res1.expression = printParenthese(val1.expression,"sequence",val1);
							res1.else = printParenthese(val1.else,"sequence",val1);
							
							return res1;
						},
					},
				},
			},
			genPattern("binary",["||"]),
			genPattern("binary",["&&"]),
			genPattern("binary",["|"]),
			genPattern("binary",["^"]),
			genPattern("binary",["&"]),
			genPattern("binary",["==","!="]),
			genPattern("binary",["<","<=",">",">="]),
			genPattern("binary",["<<",">>",">>>"]),
			genPattern("binary",[["a+b","+"],["a-b","-"]]),
			genPattern("binary",["*","/","%"]),
			genPattern("prefix",["!","~",["++x","++"],["--x","--"]],function(res3) {
				return !{"++x": true,"--x": true}[res3.type] || !!{".": true,"[": true,property: true}[res3.left.type];
			}),
			genPattern("postfix",[["x++","++"],["x--","--"]],function(res3) {
				return !!{".": true,"[": true,property: true}[res3.left.type];
			}),
			{
				iterate: true,
				production: {
					".": {
						config: true,
						structure: [
							["p","expression"],
							["p","key"]
						],
						pattern: [
							["p","expression","expression"],configToken(),".",["p","identifier","key"]
						],
						parse: function(val1) {
							var res1 = utils.clone(val1);
							
							res1.config = (val1.config) ? val1.config.config.value : {};
							
							res1.expression = parseParenthese(val1.expression);
							res1.key = val1.key;
							
							return res1;
						},
						print: function(val1) {
							var res1 = utils.clone(val1);
							
							res1.config = (val1.config) ? {config: {type: "config",value: val1.config}} : null;
							
							res1.expression = printParenthese(val1.expression,"sequence",val1);
							res1.key = val1.key;
							
							return res1;
						},
					},
					"[": {
						config: true,
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
							
							res1.config = (val1.config) ? val1.config.config.value : {};
							
							res1.expression = parseParenthese(val1.expression);
							res1.key = parseParenthese(val1.key.key);
							
							return res1;
						},
						print: function(val1) {
							var res1 = utils.clone(val1);
							
							res1.config = (val1.config) ? {config: {type: "config",value: val1.config}} : null;
							
							res1.expression = printParenthese(val1.expression,"sequence",val1);
							res1.key = {key: printParenthese(val1.key,"restore")};
							
							return res1;
						},
					},
					invocation: {
						config: true,
						structure: [
							["p","expression"],
							["[p","parameter"]
						],
						pattern: [
							["p","expression","expression"],configToken(),["g","(","parameter",[
								["*","parameter",[
									configToken(),["p","expression","parameter"],["?","separator",[  // match last => unparsed
										","," "
									]]
								]]
							]]
						],
						parse: function(val1) {
							var res1 = utils.clone(val1);
							
							res1.config = (val1.config) ? val1.config.config.value : {};
							
							res1.parsed = res1.parsed && (!val1.parameter.parameter.length
								|| !val1.parameter.parameter[val1.parameter.parameter.length - 1].separator);
							
							res1.expression = parseParenthese(val1.expression);
							
							res1.parsed = res1.parsed && !!{".": true,property: true}[res1.expression.type];  // only static ////
							
							res1.parameter = [];
							utils.forList(val1.parameter.parameter,function(val2) {
								var res2 = parseParenthese(val2.parameter);
								
								res2.config = (val2.config) ? val2.config.config.value : {};
								
								res1.parameter.push(res2);
							});
							
							return res1;
						},
						print: function(val1) {
							var res1 = utils.clone(val1);
							
							res1.config = (val1.config) ? {config: {type: "config",value: val1.config}} : null;
							
							res1.expression = printParenthese(val1.expression,"sequence",val1);
							
							res1.parameter = {parameter: []};
							utils.forList(val1.parameter,function(val2,i) {
								var res2 = {};
								
								res2.config = (val2.config) ? {config: {type: "config",value: val2.config}} : null;
								
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
					map: { //// replaced with block ???
						variant: true,
						config: true,
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
									]],
								["i",-1]
							]]
						],
						parse: function(val1) {
							var res1 = utils.clone(val1);
							
							res1.config = (val1.config) ? val1.config.config.value : {};
							
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
							
							res1.config = (val1.config) ? {config: {type: "config",value: val1.config}} : null;
							
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
						config: true,
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
							
							res1.config = (val1.config) ? val1.config.config.value : {};
							
							res1.parsed = res1.parsed && (!val1.entry.entry.length
								|| !val1.entry.entry[val1.entry.entry.length - 1].separator);
							
							res1.entry = [];
							utils.forList(val1.entry.entry,function(val2) {
								res1.entry.push(parseParenthese(val2.entry));
							});
							
							return res1;
						},
						print: function(val1) {
							var res1 = utils.clone(val1);
							
							res1.config = (val1.config) ? {config: {type: "config",value: val1.config}} : null;
							
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
						structure: [
							["p","expression"]
						],
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
					property: {
						variant: true, // map key
						pattern: [
							["p","identifier","identifier"]
						],
						parse: function(val1) {
							var res1 = utils.clone(val1);
							
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
							
							res1.literal = {
								literal: {
									terminal: true,
									type: val1.production,
									value: val1.value || null,
								},
							};
							res1.literal.production = val1.production;
							
							return res1;
						},
						extract: function(val1) { ////
						},
					},
				},
			}
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
						["!="],["=="],
						["<<"],[">>>"],[">>"],
						["<="],["<"],[">="],[">"],
						["*"],["/"],["%"],
						["!"],["~"],["++"],["--"],  // ++x, --x  // -a => (0 - a)
						// ["++"],["--"],  // x++, x--
						["."],  // [], invocation
						// property, literal: string, number, null, true, false
						["="],
						["+"],["-"]  // a+b, a-b
					]]
				],
			},
			string: {
				pattern: [  // string in double quotes
					"\"",["*",[
						["|",[
							[  // escaped character
								"\\",
								["c",[[0x0020,0x2027],[0x202A,0xFFFF]]]
							],
							[  // character except double quote and escape
								["c",[[0x0020,0x0021],[0x0023,0x005B],[0x005D,0x2027],[0x202A,0xFFFF]]]
							]
						]]
					]],"\""
				],
			},
			identifier: {
				pattern: [
					// A..Z,"_",a..z (does not start with number)
					["c",[[0x0041,0x005A],[0x005F,0x005F],[0x0061,0x007A]]],
					
					// 0..9,A..Z,"_",a..z
					["*",[
						["c",[[0x0030,0x0039],[0x0041,0x005A],[0x005F,0x005F],[0x0061,0x007A]]]
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
				if: true,
				switch: true,
				while: true,
				for: true,
				"for in": true,
				try: true,
				block: true,
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
				"!=": true,
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
			
			
			/* prototype: true, */
			/* "__proto__": true, */
			length: true,
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
			left: "lef",
			right: "rig",
			parameter: "par",
		},
		
		// apply production AND keep string token
		//// formatting-nodes
		//// rewrite - compare
		
		/*
		system.exception
		system.threads
		system.currentThread
		
		system.log
		system.wait
		system.notify
		
		*/
	};
}