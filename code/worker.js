function setup_worker() {
	return {
		session: null,
		storage: null,
		updateCtr: null,
	
		load: function(ctx) {
			compile.load();
			
			ctx.onmessage = function(ev) {
				worker.session = ev.data[0];
				worker.storage = ev.data[1];
				
				worker.updateCtr = ev.data[2];
				var queue = utils.initInterruptable(function(updateCtr) {//console.log("B " + updateCtr + " " + worker.updateCtr + " " + (updateCtr == worker.updateCtr));
					return updateCtr == worker.updateCtr;
				},ev.data[2]);
				
				if(worker.session.compile.shouldUpdate) // update only if required
					utils.queueInterruptable(queue,function(queue) {compile.run();});
				
				if(worker.session.analyze.shouldUpdate) // update only if required
					utils.queueInterruptable(queue,function(queue) {analyze.run();});
				
				utils.queueInterruptable(queue,function(queue) {postMessage([{
					current: {
						name: worker.session.current.name,
						projectRoot: worker.session.current.projectRoot, //// unparsed in root ???
						projectNode: worker.session.current.projectNode,
						nextId: worker.session.current.nextId,
					},
					compile: worker.session.compile,
					analyze: worker.session.analyze,
				},queue.ctx1]);});
				
				utils.runInterruptable(queue);
			};
		},
	};
}