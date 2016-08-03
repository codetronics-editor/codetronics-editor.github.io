function setup_analyze() {
	return {
		passCtr: 0,
		
		run: function() {
			analyze.passCtr++;
			console.log("analyze pass " + analyze.passCtr + " started at " + new Date());
			
			try {
				
				//// skip variant (most unparsed)
				//// remove variant from parsed
		
				//// handle terminal, literal
				//// error on parenthese, ex;
		
		
				//// handle unparsed
				//// find parsed in unparsed (group)
		
				worker.session.analyze.structure = [];
				analyze.walkParsed({top: worker.session.analyze.parse},["[p","top"],null,"",null,"structure",0);
		
				console.log(worker.session.analyze.structure);
			
				/*
				&lt;p&gt;<span style="color:#f0f;">(XYZ)</span>
				&emsp;n0&lt;pk&gt;<span style="color:#f0f;">(A)</span>
		
				*/
			
				console.log("analyze pass " + analyze.passCtr + " finished at " + new Date());
			}
			catch(ex) { //// todo discard parsed & recover previous state
				console.log("analyze pass " + analyze.passCtr + " aborted at " + new Date()); //// leave path up compiled
				throw ex; ////
			}
		},
		walkParsed: function(val1,structure1,htmlname1,htmlpath,visibleRoot1,type,indent) {console.log(val1,structure1,htmlname1,htmlpath,visibleRoot1,type,indent);
			if(type == "production") {
				// variant flag & skip
				//delete val1.parsed; ////
				delete val1.variant;
				delete val1.skip;
				
				// config
				if(val1.config)
					val1.config.id = val1.config.id || analyze.incNextId();
				
				if(!val1.config) console.log("no config " + val1.type);
				
				
				htmlname1 += "&lt;" + utils.escapeHtml((val1.parsed) ? (grammar.short[val1.type] || val1.type) : "unparsed") + "&gt;";
				htmlname1 += (val1.parsed && val1.config && val1.config.name) ? "<span style=\"color:#f0f;\">(" + utils.escapeHtml(val1.config.name) + ")</span>" : "";
			}
			
			//// correct path & name tree ?
			
			if(indent > 0 && htmlname1)
				htmlpath += "." + htmlname1;
			
			
			visibleRoot1 = "1"; ////
			
			if(indent >= 0 && htmlname1) {
				worker.session.analyze.structure.push({
					htmlname: new Array(indent).join("&emsp;") + htmlname1,
					htmlpath: htmlpath,
					visibleRoot: (type == "production") ? visibleRoot1 : null,
				});
			}
			
			if(!structure1)
				return;
			
			if(type == "production") {
				utils.forList(structure1,function(val4) {
					analyze.walkParsed(val1,val4,null,htmlpath,visibleRoot1,"structure",indent);
				});
			}
			if(type == "structure") {
				var val2 = val1[structure1[1]];console.log(val1,structure1[1],val2);
				if(!val2)
					return;
			
				var htmlname2 = (grammar.short[structure1[1]] || structure1[1]);
			
				switch(structure1[0]) {
				case "p":
					var structure2 = (val2.parsed && grammar.production[val2.type]) ? grammar.production[val2.type][0].structure : null;
					var visibleRoot2 = (val2.parsed && val2.config && val2.config.id) ? val2.config.id.join("_") : null;
					analyze.walkParsed(val2,structure2,htmlname2,htmlpath,visibleRoot2,"production",indent + 1);
					break;
				case "{":
					utils.forList(structure1[2],function(val4) {
						analyze.walkParsed(val2,val4,htmlname2,htmlpath,visibleRoot1,"structure",indent + 1);
					});
					break;
				case "[p":
					var showUnparsed = true; // condense successive unparsed tokens
				
					utils.forList(val2,function(val3,i) {
						if(val3.parsed || showUnparsed) {console.log(val3.type,grammar.production[val3.type]);
							var structure2 = (val3.parsed && grammar.production[val3.type]) ? grammar.production[val3.type][0].structure : null;
							var visibleRoot2 = (val3.parsed && val3.config && val3.config.id) ? val3.config.id.join("_") : null;
							analyze.walkParsed(val3,structure2,htmlname2 + i,htmlpath,visibleRoot2,"production",indent + 1);
						}
					
						showUnparsed = val3.parsed;
					});
					break;
				case "[{":
					utils.forList(val2,function(val3,i) {
						utils.forList(structure1[2],function(val4) {
							analyze.walkParsed(val3,val4,htmlname2 + i,htmlpath,visibleRoot1,"structure",indent + 1);
						});
					});
					break;
				}
			}
			
			
			
			
			//// !
		
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
		
		print: function() {
			/*
			             grammar.production[match1.type][0]
			var print1 = grammar.production[parse.type][0].print(parse);*/
			
			// format html
			
			
			
			
			//// browser-specific newline
		},
		
		execFlowchart: function() { // transform parse tree with execution order
		},
		execAbstract: function() { // controlflow & dataflow & behavior
		},
	};
}