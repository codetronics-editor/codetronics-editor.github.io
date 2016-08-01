function setup_diagram() {
	return {
		ctx: {
			svg: null,
			html: null,
		},
		
		buildTable: function(content) {
			switch(content.type) {
			case "text":
				var node1 = document.createElement("div");
				content.node.appendChild(node1);
				node1.appendTextNode(val2.text);
			
				if(content.shape)
					diagram.setShape(content);
				
				break;
			case "table":
				var node1 = document.createElement("table");
				content.node.appendChild(node1);
			
				utils.forList(content,function(val1) {
					var node2 = document.createElement("tr");
					node1.appendChild(node2);
				
					utils.forList(val1,function(val2) {
						val2.node = document.createElement("td");
						node2.appendChild(val2.node);
						
						diagram.buildTable(val2);
					});
				});
				
				break;
			}
		},
		setShape: function(content) {
			var node1 = content.node.firstElementChild;
			var rect = node1.getBoundingClientRect();
			rect = function(off){return [rect.left,rect.top,rect.left + rect.width,rect.top + rect.height,rect.width,rect.height]};
			
			content.connectors = null;
			
			switch(content.shape) {
			case "rect":
				var node2 = document.createElement("path");
				node2.setAttribute("d",["M",rect[0],rect[2],"L",m[0],r.top,"L",r.left + r.width + r.height * 2,m[1],"L",m[0],r.top + r.height + r.width / 2,"Z"].join(" "));
				diagram.ctx.svg.appendChild(node2);
				content.connectors = [mleft,mright,mtop,mbottom];
				break;
			case "rectLR":
				node1.style = "padding-left:10px;padding-right:10px;";
				break;
			case "rectLT":
				node1.style = "padding-left:10px;padding-top:10px;";
				break;
			case "diamond":
				//var off = 
				break;
			case "hexagon":
				break;
			case "parallel":
				break;
			case "oval":
				break;
			case "circle":
				break;
			}
			
			
				var x = document.getElementById("x");
				var y = document.getElementById("y");
				var r = x.getBoundingClientRect();
				x.style.marginLeft = x.style.marginRight = r.height + "px";
				x.style.marginTop = x.style.marginBottom = (r.width / 4) + "px";
				
				var m = [r.left + r.width / 2 + r.height,r.top + r.height / 2 + r.width / 4];
				var d = ["M",r.left,m[1],"L",m[0],r.top,"L",r.left + r.width + r.height * 2,m[1],"L",m[0],r.top + r.height + r.width / 2,"Z"];
				
				document.getElementById("p").setAttribute("d", d.join(" "));
			
			node1.setAttribute("style",node1.style);
		},
		connect: function(from,to) {
			// arrows
			// line width
			// color
			// line/curve (do not cross layout)
		},
	};
}