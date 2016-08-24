function setup_diagram() {
	return {
		ctx: {
			panel: null,
			svg: null,
			html: null,
		},
		htmlRect: null,
		
		getBoundingRect: function(node,align) {
			var rect = node.getBoundingClientRect();
			rect = {
				left: rect.left - diagram.htmlRect.left,
				top: rect.top - diagram.htmlRect.top,
				width: rect.width,
				height: rect.height,
			};
			
			if(align) {
				var right = Math.ceil(rect.left + rect.width) - 0.5;
				var bottom = Math.ceil(rect.top + rect.height) - 0.5;
				rect.left = Math.floor(rect.left) + 0.5;
				rect.top = Math.floor(rect.top) + 0.5;
				rect.width = right - rect.left;
				rect.height = bottom - rect.top;
			}
			
			rect.halfwidth = rect.width / 2;
			rect.halfheight = rect.height / 2;
			rect.quartwidth = rect.width / 4;
			rect.quartheight = rect.height / 4;
			
			if(align) {
				rect.halfwidth = Math.round(rect.halfwidth);
				rect.halfheight = Math.round(rect.halfheight);
				rect.quartwidth = Math.round(rect.quartwidth);
				rect.quartheight = Math.round(rect.quartheight);
			}
			
			rect.right = rect.left + rect.width;
			rect.bottom = rect.top + rect.height;
			rect.midleft = rect.left + rect.halfwidth;
			rect.midtop = rect.top + rect.halfheight;
			
			return rect;
		},
		updateDiagram: function() {
			diagram.ctx.panel = main.panel.edit_flowchart.getElementsByTagName("svg")[0];
			diagram.ctx.svg = diagram.ctx.panel.getElementsByTagName("g");
			diagram.ctx.html = diagram.ctx.panel.getElementsByTagName("foreignObject")[0];
			
			diagram.ctx.svg[0].innerHTML = "";
			diagram.ctx.svg[1].innerHTML = "";
			diagram.ctx.svg[2].innerHTML = "";
			diagram.ctx.html.innerHTML = "";
			
			diagram.htmlRect = diagram.ctx.html.getBoundingClientRect();
			
			
			////
			var test = sampleproject.test();
			
			
			var tables = [];
			var shapes = [];
			diagram.buildTable1(diagram.ctx.html,test.table,tables,shapes); ////
			diagram.buildTable2(shapes);
			diagram.buildTable3(shapes);
			diagram.buildTable4(shapes);
			diagram.buildTable5(shapes);
			
			if(diagram.ctx.html.firstElementChild)
				diagram.ctx.html.firstElementChild.style.margin = "10px";
			
			diagram.alignTable(tables);
			diagram.drawShapes(shapes);
			diagram.drawEdges(test.edges); ////
			
			diagram.ctx.svg[0].innerHTML = diagram.ctx.svg[0].innerHTML;
			diagram.ctx.svg[1].innerHTML = diagram.ctx.svg[1].innerHTML;
			diagram.ctx.svg[2].innerHTML = diagram.ctx.svg[2].innerHTML;
			
			diagram.ctx.html.setAttribute("width",1);
			diagram.ctx.html.setAttribute("height",1);
			if(diagram.ctx.html.firstElementChild) {
				var rect = diagram.getBoundingRect(diagram.ctx.html.firstElementChild);
				rect.width = Math.ceil(rect.width) + 20;
				rect.height = Math.ceil(rect.height) + 20;
				diagram.ctx.panel.setAttribute("width",rect.width);
				diagram.ctx.panel.setAttribute("height",rect.height);
				diagram.ctx.panel.setAttribute("viewBox",[0,0,rect.width,rect.height].join(" "));
				diagram.ctx.html.setAttribute("width",rect.width);
				diagram.ctx.html.setAttribute("height",rect.height);
			}
		},
		buildTable1: function(container,val1,tables,shapes) {
			if(!val1)
				return;
			
			val1[3] = val1[3] || {};
			
			switch(val1[0]) {
			case "s":
				val1[3].node = document.createElement("table");
				val1[3].node.setAttribute("cellspacing","0");
				val1[3].node.setAttribute("cellpadding","0");
				val1[3].node.setAttribute("border","0");
				container.appendChild(val1[3].node);
				var node2 = document.createElement("tr");
				val1[3].node.appendChild(node2);
				var node3 = document.createElement("td");
				node2.appendChild(node3);
				var node4 = document.createElement("table");
				node4.setAttribute("cellspacing","0");
				node4.setAttribute("cellpadding","0");
				node4.setAttribute("border","0");
				node4.innerHTML = "<tr><td>" + (val1[1] || "&ensp;") + "</td></tr>";
				node3.appendChild(node4);
				
				val1[3].layout = {
					node3: node3,
					node4: node4,
				};
				
				shapes.push(val1);
				
				break;
			case "[":
				val1[3].node = document.createElement("table");
				val1[3].node.setAttribute("cellspacing","0");
				val1[3].node.setAttribute("cellpadding","0");
				val1[3].node.setAttribute("border","0");
				container.appendChild(val1[3].node);
				
				var blank = false;
				utils.forList(val1[1],function(val2,i) {
					if(val2 && val2.length) {
						if(blank) {
							var node2 = document.createElement("tr");
							node2.innerHTML = "<td style=\"height:10px;min-height:10px;\">&ensp;</td>";
							val1[3].node.appendChild(node2);
						}
						blank = true;
					
						var node3 = document.createElement("tr");
						val1[3].node.appendChild(node3);
				
						utils.forList(val2,function(val3,j) {
							if(j) {
								var node4 = document.createElement("td");
								node4.setAttribute("style","width:20px;min-width:20px;");
								node4.innerHTML = "&ensp;";
								node3.appendChild(node4);
							}
					
							var node5 = document.createElement("td");
							node5.setAttribute("style","vertical-align:top;");
							node3.appendChild(node5);
						
							diagram.buildTable1(node5,val3,tables,shapes);
						});
					}
				});
				
				tables.push(val1);
				
				break;
			}
		},
		buildTable2: function(shapes) {
			utils.forList(shapes,function(val1) {
				val1[3].layout.rect1 = diagram.getBoundingRect(val1[3].layout.node4);
			});
		},
		buildTable3: function(shapes) {
			utils.forList(shapes,function(val1) {
				var node4 = val1[3].layout.node4;
				var rect1 = val1[3].layout.rect1;
				var style1 = "";
				switch(val1[2]) {
				case "htmlrelpath":
					style1 += "font-size:9px;";
					style1 += "background-color:#f1f1f1;";
				
					break;
				case "statement":
					style1 += "height:" + (13) + "px;";
				
					break;
				case "invocation":
					style1 += "height:" + (13) + "px;";
				
					break;
				case "var":
					style1 += "height:" + (13) + "px;";
					style1 += "text-align:left;";
				
					break;
				case "system":
					style1 += "height:" + (13) + "px;";
				
					break;
				case "control":
					style1 += "height:" + (13) + "px;";
				
					break;
				case "if":
					var width = Math.round(72 - rect1.height * 2);
					if(rect1.width < width)
						style1 += "width:" + (width) + "px;";
				
					break;
				case "while":
					style1 += "width:" + (60) + "px;";
					style1 += "height:" + (15) + "px;";
				
					break;
				}
				node4.setAttribute("style",style1);
			});
		},
		buildTable4: function(shapes) {
			utils.forList(shapes,function(val1) {
				val1[3].layout.rect2 = diagram.getBoundingRect(val1[3].layout.node3);
			});
		},
		buildTable5: function(shapes) {
			utils.forList(shapes,function(val1) {
				var node3 = val1[3].layout.node3;
				var rect2 = val1[3].layout.rect2;
				var style2 = "";
				switch(val1[2]) {
				case "htmlrelpath":
				
					break;
				case "statement":
					style2 += "padding-left:9px;";
					style2 += "padding-right:9px;";
					style2 += "padding-top:3px;";
					style2 += "padding-bottom:3px;";
				
					break;
				case "invocation":
					style2 += "padding-left:12px;";
					style2 += "padding-right:12px;";
					style2 += "padding-top:3px;";
					style2 += "padding-bottom:3px;";
				
					break;
				case "var":
					style2 += "padding-left:12px;";
					style2 += "padding-right:10px;";
					style2 += "padding-top:7px;";
					style2 += "padding-bottom:3px;";
				
					break;
				case "system":
					style2 += "padding-left:" + Math.floor(rect2.halfheight + 8) + "px;";
					style2 += "padding-right:" + Math.ceil(rect2.halfheight + 8) + "px;";
					style2 += "padding-top:3px;";
					style2 += "padding-bottom:3px;";
				
					break;
				case "control":
					style2 += "padding-left:11px;";
					style2 += "padding-right:11px;";
					style2 += "padding-top:3px;";
					style2 += "padding-bottom:3px;";
				
					break;
				case "if":
					var height = Math.ceil((rect2.halfwidth + rect2.height + 8) / 2) * 2 - 1;
					var width = height * 2 - 1;
					style2 += "padding-left:" + Math.floor((width - rect2.width) / 2) + "px;";
					style2 += "padding-right:" + Math.ceil((width - rect2.width) / 2) + "px;";
					style2 += "padding-top:" + Math.floor((height - rect2.height) / 2) + "px;";
					style2 += "padding-bottom:" + Math.ceil((height - rect2.height) / 2) + "px;";
				
					break;
				case "while":
					var height = rect2.height * 2 + 9;
					style2 += "padding-left:" + Math.floor(rect2.halfheight + 5) + "px;";
					style2 += "padding-right:" + Math.ceil(rect2.halfheight + 5) + "px;";
					style2 += "padding-top:" + Math.floor((height - rect2.height) / 2) + "px;";
					style2 += "padding-bottom:" + Math.ceil((height - rect2.height) / 2) + "px;";
				
					break;
				}
				node3.setAttribute("style",style2);
				
				val1[3].layout = null;
			});
		},
		alignTable: function(tables) {
			utils.forList(tables,function(val1) {
				val1[3].midleft = [];
				
				utils.forList(val1[1],function(val2) {
					utils.forList(val2,function(val3,j) {
						val1[3].midleft[j] = val1[3].midleft[j] || 0;
						
						if(val3) {
							switch(val3[0]) {
							case "s":
								var rect = diagram.getBoundingRect(val3[3].node,true);
								val3[3].midleft = rect.midleft;
								val1[3].midleft[j] = Math.max(val1[3].midleft[j],rect.midleft);
							
								break;
							case "[":
								if(val3[3].midleft.length)
									val1[3].midleft[j] = Math.max(val1[3].midleft[j],val3[3].midleft[0]);
							
								break;
							}
						}
					});
				});
			});
			
			utils.forList(tables,function(val1) {
				utils.forList(val1[1],function(val2) {
					utils.forList(val2,function(val3,j) {
						if(val3) {
							var padding = 0;
						
							switch(val3[0]) {
							case "s":
								padding = val1[3].midleft[j] - val3[3].midleft;
							
								break;
							case "[":
								if(val3[3].midleft.length)
									padding = val1[3].midleft[j] - val3[3].midleft[0];
							
								break;
							}
						
							val3[3].node.parentNode.style.paddingLeft = padding + "px";
						}
					});
				});
			});
		},
		drawShapes: function(shapes) {
			utils.forList(shapes,function(val1) {
				var rect = diagram.getBoundingRect(val1[3].node,true);
				
				val1[3].edge = [
					[[rect.midleft,rect.top + 1],[0,-1]],
					[[rect.midleft,rect.bottom - 1],[0,1]],
					[[rect.left + 1,rect.midtop],[-1,0]],
					[[rect.right - 1,rect.midtop],[1,0]]
				];
				
				switch(val1[2]) {
				case "htmlrelpath":
				
					break;
				case "statement":
					var node1 = document.createElement("path");
					node1.setAttribute("d",[
						"M",rect.left,rect.top,
						"L",rect.right,rect.top,
						"L",rect.right,rect.bottom,
						"L",rect.left,rect.bottom,
						"Z"
					].join(" "));
					diagram.ctx.svg[2].appendChild(node1);
				
					break;
				case "invocation":
					var node1 = document.createElement("path");
					node1.setAttribute("d",[
						"M",rect.left,rect.top,
						"L",rect.right,rect.top,
						"L",rect.right,rect.bottom,
						"L",rect.left,rect.bottom,
						"Z",
						"M",rect.left + 4,rect.top,
						"L",rect.left + 4,rect.bottom,
						"M",rect.right - 4,rect.top,
						"L",rect.right - 4,rect.bottom
					].join(" "));
					diagram.ctx.svg[2].appendChild(node1);
				
					break;
				case "var":
					var node1 = document.createElement("path");
					node1.setAttribute("d",[
						"M",rect.left,rect.top,
						"L",rect.right,rect.top,
						"L",rect.right,rect.bottom,
						"L",rect.left,rect.bottom,
						"Z",
						"M",rect.left,rect.top + 4,
						"L",rect.right,rect.top + 4,
						"M",rect.left + 4,rect.top,
						"L",rect.left + 4,rect.bottom
					].join(" "));
					diagram.ctx.svg[2].appendChild(node1);
				
					break;
				case "system":
					var node1 = document.createElement("path");
					node1.setAttribute("d",[
						"M",rect.left + (rect.height / 2),rect.top,
						"L",rect.right,rect.top,
						"L",rect.right - (rect.height / 2),rect.bottom,
						"L",rect.left,rect.bottom,
						"Z"
					].join(" "));
					diagram.ctx.svg[2].appendChild(node1);
				
					break;
				case "control":
					var node1 = document.createElement("path");
					node1.setAttribute("d",[
						"M",rect.left,rect.top + 10,
						"Q",rect.left,rect.top,rect.left + 10,rect.top,
						"L",rect.right - 10,rect.top,
						"Q",rect.right,rect.top,rect.right,rect.top + 10,
						"L",rect.right,rect.bottom - 10,
						"Q",rect.right,rect.bottom,rect.right - 10,rect.bottom,
						"L",rect.left + 10,rect.bottom,
						"Q",rect.left,rect.bottom,rect.left,rect.bottom - 10,
						"Z"
					].join(" "));
					diagram.ctx.svg[2].appendChild(node1);
				
					break;
				case "if": //console.log("if", rect);
					var node1 = document.createElement("path");
					node1.setAttribute("d",[
						"M",rect.left,rect.midtop,
						"L",rect.midleft,rect.top,
						"L",rect.right,rect.midtop,
						"L",rect.midleft,rect.bottom,
						"Z"
					].join(" "));
					diagram.ctx.svg[2].appendChild(node1);
				
					break;
				case "while": //console.log("while", rect);
					val1[3].edge[5] = [[rect.right - rect.quartheight - 1,rect.bottom - rect.quartheight],[1,0]];
					val1[3].edge[6] = [[rect.right - rect.quartheight - 1,rect.top + rect.quartheight],[1,0]];
					
					var node1 = document.createElement("path");
					node1.setAttribute("d",[
						"M",rect.left,rect.midtop,
						"L",rect.left + rect.halfheight,rect.top,
						"L",rect.right - rect.halfheight,rect.top,
						"L",rect.right,rect.midtop,
						"L",rect.right - rect.halfheight,rect.bottom,
						"L",rect.left + rect.halfheight,rect.bottom,
						"Z"
					].join(" "));
					diagram.ctx.svg[2].appendChild(node1);
				
					break;
				}
			});
			
			
			// expression / statement
			// invocation
			// var
			// if / switch
			// while / for / for-in
			// system invocation
			// entry / return
			// join
			
		},
		drawEdges: function(edges) {
			utils.forList(edges,function(val1) {
				val1[2] = val1[2] || {};
				
				var shape1 = val1[0][0][3];
				var shape2 = val1[1][0][3];
				var edge1 = shape1.edge[val1[0][1]];
				var edge2 = shape2.edge[val1[1][1]];
				
				var node1 = document.createElement("path");
				if(val1[2].curve) {
				}
				else {
					//var dist = [edge2[0][0] - edge1[0][0],edge2[0][1] - edge1[0][1]];
					var middle = (edge1[1][0]) ? [edge2[0][0],edge1[0][1]] : [edge1[0][0],edge2[0][1]];
				
					node1.setAttribute("d",[
						"M",edge1[0][0],edge1[0][1],
						"L",middle[0],middle[1],
						"L",edge2[0][0],edge2[0][1]
					].join(" "));
					
					/*node1.setAttribute("d",[ ////
						"M",edge1[0][0] - 50,edge1[0][1],
						"L",edge2[0][0] + 50,edge2[0][1]
					].join(" "));*/
				}
				if(val1[2].width)
					node1.setAttribute("stroke-width",val1[2].width * 0.8);
				if(val1[2].color)
					node1.setAttribute("stroke",val1[2].color);
				diagram.ctx.svg[1].appendChild(node1);
			});
			
			
			// #arrows
			// *line width
			// *color
			// line/curve (do not cross layout)
			
		},
	};
}