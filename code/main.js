function setup_main() {
	return {
		panel: {
			"left_keys": null,
			"left_loadedprojects": null,
			"left_currentproject": null,
			"left_tabs": null,
			"left_structure": null,
			"left_properties": null,
			"left_variants": null,
			"left_history": null,
			"left_search": null,
			"left_execute": null,
			"left_inspect": null,
			"left_state": null,
			"edit_code": null,
			"edit_config": null,
			"edit_codediagram": null,
			"edit_data": null,
			"edit_dependencies": null,
			"edit_scopes": null,
			"edit_states": null,
			"edit_flowchart": null,
			"edit_controlpath": null,
			"edit_behavior": null,
			"edit_dataflow": null,
			"edit_valuerange": null,
		},
		noproject: {
			"left_keys": true,
			"left_loadedprojects": true,
		},
		notab: {
			"left_keys": true,
			"left_loadedprojects": true,
			"left_currentproject": true,
			"left_tabs": true,
			"left_structure": true,
			"left_variants": true,
			"left_history": true,
			"left_search": true,
			"left_execute": true,
			"left_inspect": true,
			"left_state": true,
		},
		node: {
			"body": null,
			"menu1": null,
			"menu2": null,
			"browser": null,
			"updating": null,
			"content": null,
			"left": null,
			"right": null,
			"edit": null,
			"output": null,
			"frame": null,
			"number": null,
			"code": null,
			"projects": null,
			"currentname": null,
			"currenttab": null,
			"hastabs": null,
			"tabs": null,
			"structure": null,
		},
		session: {
			current: null,
			visibleRoot: null,
			resetTab: null,
			compile: null,
			analyze: null,
		},
		storage: {
			menu: "Projekt",
			left: {
				panel: "left_structure",
				size: 0,
			},
			edit: {
				panel: "edit_code",
				html: null, //// do not save this
			},
			output: {
				size: 0,
			},
			project: {},
			restore: {
				current: null,
			}
		},
		agent: "unknown",
		worker: null,
		workerMessage: null,
		currentPanel: {},
		
		hasLoaded: false,
		updateCtr: 0,
		isResizing: null,
		shouldResize: true,
		shouldCompile: true,
	
		load: function() {
			var setup1 = {
				"utils": setup_utils,
				"menu": setup_menu,
				"diagram": setup_diagram,
				"sampleproject": setup_sampleproject,
			};
			for(key in setup1)
				window[key] = setup1[key]();
			
			utils.forMap(main.panel,function(val,key) {
				var node = document.getElementById(key);
				main.panel[key] = (node.contentDocument || node.contentWindow.document).getElementById("panel").firstElementChild;
			});
			utils.forMap(main.node,function(val1,key1) {
				main.node[key1] = document.getElementById(key1);
			
				utils.forMap(main.panel,function(val2,key2) {
					var node = document.getElementById(key2);
					main.node[key1] = main.node[key1] || (node.contentDocument || node.contentWindow.document).getElementById(key1);
				});
			});
			main.node.body.removeChild(main.node.frame);
			
			var version = 0;
			if(navigator.userAgent.search(/gecko/i) != -1)
				main.agent = "gecko";
			if(navigator.userAgent.search(/webkit/i) != -1)
				main.agent = "webkit";
			if(navigator.userAgent.search(/trident/i) != -1)
				main.agent = "trident";
			
			main.node.browser.innerHTML = "UNBEKANNTER BROWSER:&emsp;<span style=\"color:red;\">NICHT GETESTET</span>";
			switch(main.agent) {
			case "gecko": // 47.0 -> 47.0
				try {version = parseInt(navigator.userAgent.match(/firefox\/(\d+)/i)[1]);} catch(ex) {}
				try {version = parseInt(navigator.userAgent.match(/ rv:\/(\d+)/i)[1]);} catch(ex) {}
				console.log(version);
				if(version >= 47)
					main.node.browser.innerHTML = "FIREFOX ERKANNT:&emsp;<span style=\"color:green;\">OK</span>";
				else
					main.node.browser.innerHTML = "ALTEN FIREFOX ERKANNT:&emsp;<span style=\"color:red;\">NICHT GETESTET</span>";
				break;
			case "webkit": // 51.0 -> 537.36
				try {version = parseInt(navigator.userAgent.match(/webkit\/(\d+)/i)[1]);} catch(ex) {}
				if(version >= 537)
					main.node.browser.innerHTML = "CHROME/SAFARI ERKANNT:&emsp;<span style=\"color:green;\">OK</span>";
				else
					main.node.browser.innerHTML = "ALTEN CHROME/SAFARI ERKANNT:&emsp;<span style=\"color:red;\">NICHT GETESTET</span>";
				break;
			case "trident": // 11.0 -> 7.0
				try {version = parseInt(navigator.userAgent.match(/trident\/(\d+)/i)[1]);} catch(ex) {}
				if(version >= 7)
					main.node.browser.innerHTML = "INTERNET EXPLORER ERKANNT:&emsp;<span style=\"color:green;\">OK</span>";
				else
					main.node.browser.innerHTML = "ALTEN INTERNET EXPLORER ERKANNT:&emsp;<span style=\"color:red;\">NICHT GETESTET</span>";
				break;
			}
			
			try {main.storage = JSON.parse(localStorage.getItem("storage")) || main.storage;} catch(ex) {}
			
			if(!main.storage.left.size)
				main.storage.left.size = main.node.content.clientWidth / 4;
			if(!main.storage.output.size)
				main.storage.output.size = main.node.right.clientHeight / 4;
			
			var hasProject = false;
			for(key in main.storage.project) {
				hasProject = true;
				break;
			}
			if(!hasProject) {
				main.storage.restore.current = main.addProject(); //// hello world
			}
			
			main.setMenu(main.storage.menu);
			main.setProject(main.storage.restore.current);
			
			
			
			if(!main.storage.edit.html) ////
				main.storage.edit.html = utils.escapeHtml(sampleproject.test).replace(/\n/g,{gecko: "<br />",webkit: "<div></div>",trident: "<p></p>",unknown: "<br />"}[main.agent]);
			main.node.code.innerHTML = main.storage.edit.html;  //// do not store edit
			/*try {
				if(main.storage.edit.select) { //// do this after initial compile !
					var node = [main.node.code,main.node.code];
					utils.forUpto(2,function(i) {
						utils.forList(main.storage.edit.select[i].node,function(val) {
							node[i] = node[i].childNodes[val];
						});
					});
					var selection = document.getSelection();
					selection.collapse(node[0],main.storage.edit.select[0].offset);
					selection.extend(node[1],main.storage.edit.select[1].offset);  // no IE support !
				}
			} catch(ex) {}*/
			
			
		
			main.node.body.onmouseup = function() {
				main.isResizing = null;
			};
			main.node.body.onmousemove = function(ev) {
				if(main.isResizing == "left") {
					main.storage.left.size = ev.clientX - main.node.content.getBoundingClientRect().left - 5;
					main.shouldResize = true;
					main.requestUpdate();
				}
				if(main.isResizing == "output") {
					main.storage.output.size = main.node.content.clientHeight - (ev.clientY - main.node.content.getBoundingClientRect().top);
					main.shouldResize = true;
					main.requestUpdate();
				}
			};
		
			var setup2 = {
				"utils": setup_utils,
				"compile": setup_compile,
				"grammar": setup_grammar,
				"analyze": setup_analyze,
				"worker": setup_worker,
			};
			var script = "";
			utils.forMap(setup2,function(val,key) {
				script += "var " + key + " = (" + val + ")();\n";
			});
			script += "worker.load(this);";
			
			main.worker = new Worker(URL.createObjectURL(new Blob([script],{type: "text/javascript"})));
			main.worker.onmessage = main.workerMessage;
		
			main.hasLoaded = true;
			main.requestUpdate();
		},
		setParentSize: function(dest,w,h) {
			main.node[dest].parentNode.style.width = main.node[dest].parentNode.style.maxWidth = w;
			main.node[dest].parentNode.style.height = main.node[dest].parentNode.style.maxHeight = h;
		},
		listEntry: function(content,style,onclick) {
			return "<td style=\"" + (style || "") + "\"" + ((onclick) ? " onmouseenter=\"style.backgroundColor = '#24c';\" onmouseleave=\"style.backgroundColor = null;\" onclick=\"style.backgroundColor = null; " + onclick + "\"" : "") + ">&ensp;" + content + "&ensp;</td>";
		},
		setMenu: function(key1) {
			main.storage.menu = key1;
			var html1 = "";
			var html2 = "";
			utils.forMap(menu,function(val2,key2,i) {
				html1 += main.listEntry((i + 1) + ": " + key2,"padding-top:5px;padding-bottom:5px;","main.setMenu('" + key2 + "');");
			});
			utils.forMap(menu[key1],function(val2,key2,i) {
				html2 += main.listEntry((i + 1) + ": " + key2,"padding-top:5px;padding-bottom:5px;","menu[main.storage.menu]['" + key2 + "'](); main.requestUpdate();");
			});
			main.node.menu1.innerHTML = html1;
			main.node.menu2.innerHTML = html2;
		},
		setPanel: function(dest,panel) {
			main.storage[dest].panel = panel;
			
			if(panel && !main.session.current && !main.noproject[panel])
				panel = (dest == "left") ? "left_loadedprojects" : null;
			if(panel && !main.session.visibleRoot && !main.notab[panel])
				panel = (dest == "left") ? "left_tabs" : null;
				
			if(main.currentPanel[dest] == panel)
				return;
			
			main.currentPanel[dest] = panel;
			main.node[dest].innerHTML = "";
			
			if(panel)
				main.node[dest].appendChild(main.panel[panel]);
		},
		addProject: function(name1) {
			name1 = name1 || "Neues Projekt";
			var count1 = 1;
			utils.forMap(main.storage.project,function(val,key) {
				var count2 = 1;
				try {count2 = parseInt(key.match(/\((\d+)\)$/)[1]);} catch(ex) {}
				var name2 = (count2 && count2 > 1) ? name1 + " (" + count2 + ")" : name1;
				if(count2 && key == name2 && count1 <= count2) {
					count1 = count2 + 1;
				}
			});
			var name3 = (count1 > 1) ? name1 + " (" + count1 + ")" : name1;
			
			var projectRoot = {type: "project",config: {id: [1].join("_"),name: name3}};
			var projectNode = {};
			projectNode[[1].join("_")] = projectRoot;
			main.storage.project[name3] = {
				name: name3,
				projectRoot: projectRoot,
				projectNode: projectNode,  // all created nodes so far
				nextId: [2],  // big integer
				tab: [{
					htmlpath: "////",  //// moved ?
					visibleRoot: [1].join("_"),
					select: null,
				}],
				projectLog: [],  // insert, remove, change(classify), move, duplicate
				searchLog: [],  // search history
				variant: [],
				restore: {
					tab: 0,
				}
			};
			
			
			console.log(name3,main.storage.project);
			
			return name3;
		},
		addSampleProject: function(name1) {
			var name3 = addProject(name1);
			main.storage.project[name3] = utils.clone(sampleproject[name1]); ////
			main.storage.project[name3].name = name3;
			
			return name3;
		},
		removeProject: function(name) {
			if(main.storage.restore.current == name)
				main.setProject(null);
			delete main.storage.project[name];
		},
		setProject: function(name) {
			main.storage.restore.current = name || null;
			main.session.current = (name) ? main.storage.project[name] : null;
			
			main.node.output.innerHTML = "";
			main.setTab((main.session.current) ? main.session.current.restore.tab : null);
			
			if(main.session.current) {
				//// restore execution state (output)
			}
		},
		addTab: function(htmlpath,visibleRoot) {
			var tab = main.session.current.tab.length;
			utils.forList(main.session.current.tab,function(val,i) {
				if(visibleRoot == val.visibleRoot)
					tab = i;
			});
			
			if(tab == main.session.current.tab.length) {
				main.session.current.tab.push({
					htmlpath: htmlpath,
					visibleRoot: visibleRoot,
					select: null,  // editor selection
				});
			}
			
			main.setTab(tab);
		},
		removeTab: function(tab) {
			if(main.session.current.restore.tab > tab) { //// test
				--main.session.current.restore.tab;
			}
			
			if(main.session.visibleRoot
			== main.session.current.projectNode[main.session.current.tab[tab].visibleRoot]) {
				main.setTab(null);
			}
			main.session.current.tab.splice(tab,1);
		},
		setTab: function(tab) {
			if(main.session.current)
				main.session.current.restore.tab = (main.session.current.tab[tab]) ? tab : null;
			main.session.visibleRoot = (main.session.current && main.session.current.tab[tab])
				? main.session.current.projectNode[main.session.current.tab[tab].visibleRoot] : null;
			
			main.setPanel("left",main.storage.left.panel);
			main.setPanel("edit",main.storage.edit.panel);
			
			if(!main.session.resetTab
			|| main.session.resetTab.current != main.session.current
			|| main.session.resetTab.visibleRoot != main.session.visibleRoot) {
				main.session.resetTab = {
					current: main.session.current,
					visibleRoot: main.session.visibleRoot,
				};
				
				main.resetCompiler();
			}
		},
		resetCompiler: function() {
			main.session.compile = {
				shouldUpdate: false,
				inputText: null, // input html-decoded editor content
				inputSelect: null, // offset in inputText
				outputFormat: null, // output html format definitions
				outputSelect: null, // index and offset in outputFormat
				outputText: null, // output html-decoded editor content (detect change)
				outputGroups: [], // output group ranges for html-decoded editor content (detect changed range)
			};
			main.session.analyze = {
				shouldUpdate: false,
				structure: null, // code structure
			};
		},
		requestUpdate: function() {
			if(!main.hasLoaded)
				return;
			
			main.node.updating.innerHTML = "&ensp;◷&ensp;";
			
			main.updateCtr = (main.updateCtr + 1) % Number.MAX_SAFE_INTEGER;
			var queue = utils.initInterruptable(function(updateCtr) {//console.log("A " + updateCtr + " " + main.updateCtr + " " + (updateCtr == main.updateCtr));
				return updateCtr == main.updateCtr;
			},main.updateCtr);
			
			utils.queueInterruptable(queue,main.update1_resize);
			utils.queueInterruptable(queue,main.update1_compile1);
			utils.queueInterruptable(queue,function(queue) {main.worker.postMessage([main.session,main.storage,queue.ctx1]);});
			
			utils.runInterruptable(queue);
		},
		workerMessage: function(ev) {
			main.workerMessage = ev.data[0];
			
			var queue = utils.initInterruptable(function(updateCtr) {//console.log("C " + updateCtr + " " + main.updateCtr + " " + (updateCtr == main.updateCtr));
				return updateCtr == main.updateCtr;
			},ev.data[1]);
			
			utils.queueInterruptable(queue,main.update3_compile2);
			utils.queueInterruptable(queue,main.update3_updateEdit);
			utils.queueInterruptable(queue,main.update3_updateLeft);
			utils.queueInterruptable(queue,main.update3_store);
			
			utils.queueInterruptable(queue,function(queue) {
				main.shouldResize = false;
				main.shouldCompile = false;
				main.node.updating.innerHTML = "";
			});
			
			utils.runInterruptable(queue);
		},
		
		// update1
		
		update1_resize: function(queue) {
			if(!main.shouldResize) // update only if resized
				return;
		
			main.setParentSize("content","100%","100%");
			main.setParentSize("left","0px","0px");
			main.setParentSize("right","0px","0px");
			main.setParentSize("edit","0px","0px");
			main.setParentSize("output","0px","0px");
		
			var w = main.node.content.clientWidth - 10;
			var h = main.node.content.clientHeight;
			var x = Math.max(4,Math.min(w - 3,main.storage.left.size));
			var y = Math.max(4,Math.min(h - 3,h - main.storage.output.size));
		
			main.setParentSize("content",main.node.content.clientWidth + "px",main.node.content.clientHeight + "px");
			main.setParentSize("left",(x - 3) + "px",main.node.content.clientHeight + "px");
			main.setParentSize("right",(w - x - 2) + "px",main.node.content.clientHeight + "px");
			main.setParentSize("edit",main.node.right.clientWidth + "px",(y - 3) + "px");
			main.setParentSize("output",main.node.right.clientWidth + "px",(h - y - 2) + "px");
		
		
			//// proper event chain
			
			//// check update step required "should"/changed
		},
		update1_compile1: function(queue) {
			main.session.compile.shouldUpdate = false;
			main.session.analyze.shouldUpdate = false;
			if(!main.shouldCompile) // update only if editor content changed
				return;
			
			
			//// todo analyze (structure) without parse on setProject
			//// todo print (editor content) without parse on setTab
			
			
			main.session.compile.shouldUpdate = true;
			main.session.analyze.shouldUpdate = true;
			
			// save selection 1
			var selection = document.getSelection();
			var node1 = document.createElement("input");
			node1.setAttribute("type","hidden");
			var node2 = document.createElement("input");
			node2.setAttribute("type","hidden");
			var right = true; ////
			if(selection.rangeCount) {
				var range1 = document.createRange();
				range1.setStart(selection.anchorNode,selection.anchorOffset);
				range1.setEnd(selection.focusNode,selection.focusOffset);
				right = !range1.collapsed;
				
				var range2 = selection.getRangeAt(0).cloneRange();
				range2.insertNode(node1);
				range2.collapse(false);
				range2.insertNode(node2);
			}
			
			// decode html 1
			var text = main.node.code.innerHTML;
			
			// save selection 2
			main.session.compile.inputSelect = [];
			text = text.replace(/<\/input>/ig,"");
			text = text.replace(/<(?!input)[^>]*>/ig," ");
			main.session.compile.inputSelect[(right) ? 0 : 1] = text.indexOf("<input");
			text = text.replace(/<input[^>]*>/i,"");
			main.session.compile.inputSelect[(right) ? 1 : 0] = text.indexOf("<input");
			text = text.replace(/<input[^>]*>/i,"");
			
			// decode html 2
			if(text.search(/<[^>]*>/ig) != -1) { ////
				throw new Error();
			}
			main.session.compile.inputText = utils.unescapeHtml(text);
			
			// save selection 3 and cleanup
			if(main.session.compile.inputSelect[0] == -1 || main.session.compile.inputSelect[1] == -1)
				main.session.compile.inputSelect = null;
			if(selection.rangeCount) {
				node1.parentNode.removeChild(node1);
				node2.parentNode.removeChild(node2);
			}
		},
		
		// update3
		
		update3_compile2: function(queue) {
			if(!main.shouldCompile) // update only if editor content changed
				return;
			
			
			main.storage.edit.select = null;
			
			
			
			main.session.current.name = main.workerMessage.current.name;
			main.session.current.projectRoot = main.workerMessage.current.projectRoot; //// unparsed in root ???
			main.session.current.projectNode = main.workerMessage.current.projectNode;
			main.session.current.nextId = main.workerMessage.current.nextId;
			main.session.compile = main.workerMessage.compile;
			main.session.analyze = main.workerMessage.analyze;
			
			
			return;
			
			
			// add html, encode entities
			main.node.code.innerHTML = "";
			var indent = 0;
			var newline = {gecko: "br",webkit: "div",trident: "p",unknown: "br"}[main.agent];
			var node1 = (newline == "br") ? main.node.code : document.createElement(newline);
			utils.forList(main.session.compile.outputText,function(val) {
				switch(val[0]) {
				case "f":
					var node2 = document.createElement("span");
					node2.appendChild(document.createTextNode(val[1]));
					node2.setAttribute("style",val[2]);
					node1.appendChild(node2);
					break;
				case "t":
					node1.appendChild(document.createTextNode(val[1]));
					break;
				case "n":
					if(newline == "br") {
						main.node.code.appendChild(document.createElement("br"));
					}
					else {
						main.node.code.appendChild(node1);
						node1 = document.createElement(newline);
					}
					node1.appendChild(document.createTextNode(new Array(indent + 1).join("\t")));
					break;
				case "i":
					indent += val[1];
					break;
				}
			});
			if(newline != "br") {
				main.node.code.appendChild(node1);
			}
			
			
			// outputText & outputGroups
			
			
			
			
			// range
			
			//// compare main.node.code.innerHTML and main.node.code.innerHTML
			//// skip additional formatting 
			
			//// editor content is unchanged since compiler start, otherwise interrupted
			//// escape E->EE 0->E0 1->E1, unescape after tokenization
			
			
			main.session.compile.outputHtml = main.node.code.innerHTML;
		},
		update3_updateEdit: function(queue) {
			switch(main.currentPanel.edit) { // update only visible panel
			case "edit_code":console.log(111);
				main.storage.edit.html = main.node.code.innerHTML;
				main.update3_updateCode(queue);
				break;
			case "edit_config":
				main.storage.edit.html = main.node.code.innerHTML;
				main.update3_updateCode(queue);
				break;
			case "edit_codediagram":
				break;
			case "edit_data":
				break;
			case "edit_dependencies":
				break;
			case "edit_scopes":
				break;
			case "edit_states":
				break;
			case "edit_flowchart":
				main.update3_updateDiagram(queue);
				break;
			case "edit_controlpath":
				main.update3_updateDiagram(queue);
				break;
			case "edit_behavior":
				break;
			case "edit_dataflow":
				main.update3_updateDiagram(queue);
				break;
			case "edit_valuerange":
				break;
			}
		},
		update3_updateCode: function(queue) {
			var skip = [true];
			
			utils.queueInterruptable(queue,function(queue,skip) {
				if(!main.node.number.firstElementChild)
					main.node.number.innerHTML = "<div>1</div>";
				var h = main.node.number.firstElementChild.clientHeight;
				
				utils.forList(main.node.code.getElementsByTagName("br"),function(val) {
					skip[Math.round(val.offsetTop / h) + 1] = true;
				});
				utils.forList(main.node.code.getElementsByTagName("div"),function(val) { //// test
					skip[Math.round(val.offsetTop / h)] = true;
				});
				utils.forList(main.node.code.getElementsByTagName("p"),function(val) { //// test
					skip[Math.round(val.offsetTop / h)] = true;
				});
				main.node.code.style.minHeight = "0px";
				skip.length = Math.round(main.node.code.clientHeight / h);
			},skip);
	
			//// check div
			//// check trunc
			
			//// check general
			
			utils.queueInterruptable(queue,function(queue,skip) {
				main.node.number.innerHTML = "";
				var j = 1;
				utils.forUpto(skip.length,function(i) {
					var node = document.createElement("div");
					node.appendChild(document.createTextNode((skip[i]) ? j++ : "\u00A0"));
					main.node.number.appendChild(node);
				});
			},skip);
			
			utils.queueInterruptable(queue,function(queue) {
				main.node.code.style.minHeight = "0px";
				main.node.code.style.minHeight = Math.floor(main.node.code.parentNode.clientHeight - main.node.code.offsetTop * 2) + "px";
			});
		},
		update3_updateDiagram: function(queue) {
			
			
			
		},
		update3_updateLeft: function(queue) {
			switch(main.currentPanel.left) { // update only visible panel
			case "left_keys":
				break;
			case "left_loadedprojects":
				var html = "";
				utils.forMap(main.storage.project,function(val,key) {
					html += "<tr>";
					html += main.listEntry(utils.escapeHtml(key),"width:100%;padding-top:5px;padding-bottom:5px;","main.setProject(utils.unescapeHtml('" + utils.escapeQuote(utils.escapeHtml(key)) + "')); main.setPanel('left','left_structure'); main.requestUpdate();");
					html += main.listEntry("Entf.","width:0px;padding-top:5px;padding-bottom:5px;","main.removeProject(utils.unescapeHtml('" + utils.escapeQuote(utils.escapeHtml(key)) + "')); main.requestUpdate();");
					html += "</tr>";
				});
				if(!html) {
					html += "<tr>" + main.listEntry("","width:100%;padding-top:5px;padding-bottom:5px;") + "</tr>";
				}
				main.node.projects.innerHTML = html;
				break;
			case "left_currentproject":
				main.node.currentname.innerHTML = utils.escapeHtml(main.session.current.name);
				break;
			case "left_tabs":console.log(main.session.current.restore.tab);
				var tab = main.session.current.restore.tab;
				main.node.currenttab.innerHTML = (main.session.current.tab[tab])
					? main.session.current.tab[tab].htmlpath
					: "Kein Tab ausgewählt";
				if(main.session.current.tab.length) {
					main.node.hastabs.innerHTML = "Geöffnete Tabs";
					var html = "";
					utils.forList(main.session.current.tab,function(val,i) {
						html += "<tr>";
						html += main.listEntry(val.htmlpath,"width:100%;padding-top:5px;padding-bottom:5px;","main.setTab(" + i + "); main.requestUpdate();");
						html += main.listEntry("Entf.","width:0px;padding-top:5px;padding-bottom:5px;","main.removeTab(" + i + "); main.requestUpdate();");
						html += "</tr>";
					});
					main.node.tabs.innerHTML = html;
				}
				else {
					main.node.hastabs.innerHTML = "Keine Tabs geöffnet";
					main.node.tabs.innerHTML = "<tr>" + main.listEntry("Strukturansicht zeigen","width:0px;padding-top:5px;padding-bottom:5px;","main.setPanel('left','left_structure'); main.requestUpdate();") + "</tr>";
				}
				break;
			case "left_structure":
				var html = "";
				utils.forList(main.session.analyze.structure,function(val) {  //// indented html name, html path, id string
					//// &shy; soft hyphens (wrap) and nowrap spans
					html += "<tr>" + main.listEntry(val.htmlname,(val.visibleRoot) ? "" : "color:#666;",(val.visibleRoot) ? "main.addTab(utils.unescapeHtml('" + utils.escapeQuote(utils.escapeHtml(val.htmlpath)) + "'),'" + val.visibleRoot + "');" : null) + "</tr>"; //// how to escape
				});
				if(!html) {
					html += "<tr>" + main.listEntry("","width:100%;padding-top:5px;padding-bottom:5px;") + "</tr>";
				}
				main.node.structure.innerHTML = html;
				break;
			case "left_properties":
				break;
			case "left_variants":
				utils.forList(main.session.current.variant,function(val) {
				});
				break;
			case "left_history":
				utils.forList(main.session.current.projectLog,function(val) {
				});
				break;
			case "left_search":
				break;
			case "left_execute":
				break;
			case "left_inspect":
				break;
			case "left_state":
				break;
			}
		},
		update3_store: function(queue) {
			localStorage.setItem("storage",JSON.stringify(main.storage));
		},
	
		//// browser test
	};
}