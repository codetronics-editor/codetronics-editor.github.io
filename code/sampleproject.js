function setup_sampleproject() {
	return {
		gen: null,
		
		test: function() {
			var table = {};
			var edges = [];
			
			
			
			
			table["size"] = ["[",[
				[
					["[",[
						[
							["s","","statement"],
							["s","$3 = parameter.parameter2","statement"]
						],
						[
							["s","$3 = $1","statement"],
							["s","$3<br>$3<br>$3","statement"]
						]
					]]
				],
				[
					["[",[
						[
							["s","","invocation"],
							["s","$3 = parameter.parameter2","invocation"]
						],
						[
							["s","$3 = $1","invocation"],
							["s","$3<br>$3<br>$3","invocation"]
						]
					]]
				],
				[
					["[",[
						[
							["s","","var"],
							["s","$3 = parameter.parameter2","var"]
						],
						[
							["s","$3 = $1","var"],
							["s","$3<br>$3<br>$3","var"]
						]
					]]
				],
				[
					["[",[
						[
							["s","","if"],
							["s","<b>$3 = parameter.parameter2","if"]
						],
						[
							["s",'<span style="color:#369;">if33</span></b>',"control"]
						],
						[
							["s",'$55</b>',"if"],
							["s","<b>$55<br>$56<br>$57<br>$58<br>$59<br>$60</b>","if"],
							["s","<b>parameter.parameter2<br>parameter.parameter2<br>parameter.parameter2","if"]
						]
					]]
				],
				[
					["[",[
						[
							["s","","while"],
							["s","<b>$3 = parameter.parameter2","while"]
						],
						[
							["s",'enter <span style="color:#369;">whl255</span></b>',"control"],
							["s",'enter <span style="color:#369;">if122</span></b>',"control"]
						],
						[
							["s",'<span style="color:#369;">whl255</span> $55</b>',"while"],
							["s",'$55</b>',"if"],
							["s","","if"]
						]
					]]
				],
				[
					["[",[
						[
							["s","","system"],
							["s","$3 = parameter.parameter2","system"]
						],
						[
							["s","$3 = $1","system"],
							["s","$3<br>$3<br>$3<br>$3<br>$3<br>$3<br>$3<br>$3<br>$3<br>$3","system"]
						]
					]]
				],
				[
					["[",[
						[
							["s","","control"],
							["s",'<b>n0&lt;pk&gt;<span style="color:#f06;">(package1)</span>.n3&lt;cls&gt;<span style="color:#f06;">(class2)</span>.n2&lt;fun&gt;<span style="color:#f06;">(function1)</span></b>',"control"]
						],
						[
							["s",'return <span style="color:#f06;">function1</span></b>',"control"],
							["s",'throw <span style="color:#f06;">function1</span></b>',"control"]
						],
						[
							["s",'break <span style="color:#369;">if1</span></b>',"control"],
							["s",'continue <span style="color:#369;">whl2</span></b>',"control"]
						],
						[
							["s",'enter <span style="color:#369;">try3</span></b>',"control"],
							["s",'break <span style="color:#369;">try3</span></b>',"control"]
						],
						[
							["s",'break <span style="color:#369;">blk4</span></b>',"control"],
							["s",'throw <span style="color:#369;">try3</span></b>',"control"]
						],
						[
							["s","<b>$3 = $1","control"],
							["s","<span style='font-weight:600;'>$3</span><br><span style='font-weight:700;'>$3</span><br><span style='font-weight:900;'>$3</span>","control"]
						]
					]]
				],
				[
					["[",[
						[
							["s",'n3&lt;cls&gt;<span style="color:#f06;">(class2)</span>.n2&lt;fun&gt;<span style="color:#f06;">(function1)</span>.st10&lt;blk&gt;<br><span style="color:#369;">blk3.a</span><br><span style="color:#369;">if1.if2.blk3.b</span> = <span style=\"color:#075;\">"xyz"</span><br><span style="color:#369;">blk3.c</span> = $22<br><span style="color:#369;">blk3.d</span> = $22<br>',"var"]
						],
						[
							["s",'log(<span style=\"color:#075;\">"string \"</span> + evaluatedExpr)',"system"]
						],
						/*[
							["s",'wait(<span style="color:#f06;">lock1</span>)',"system"],
							["s",'notify(<span style="color:#f06;">lock1</span>)',"system"]
						],*/
						[
							["s","$3 = $1","statement"],
							["s",'<span style="color:#f06;">package1.class1.globalVar</span> = $1',"statement"],
							["s",'<span style="color:#369;">blk3.c</span> = $1',"statement"]
						]
					]]
				]
			]];
			
			
			/////////////
			
			table["parameter"] = ["[",[
			]];
			
			table["if"] = ["[",[
				[
					["s","st3&lt;if&gt;","htmlrelpath"]
				],
				[
					["[",[
						[
							["[",[
								[
									["s","sco2.asdkjhkjasd = $2 + $3","statement"]
								]
							]]
						],
						[
							["s","<span style=\"color:#369;\">if1</span> $1","if"]
						],
						[
							null,
							["[",[
								[
									["s","$2 = <span style=\"color:#075;\">\"string123\"</span>","statement"]
								]
							]]
						],
						[
							null,
							["s","$2","if"]
						],
						[
							["[",[
								[
									["s","log(<span style=\"color:#075;\">&quot;first&quot;</span>)","system"]
								]
							]],
							["[",[
								[
									["s","st3&lt;if&gt;","htmlrelpath"]
								],
								[
									["s","<span style=\"color:#369;\">sco2</span><br /><span style=\"color:#369;\">sco2.a</span> = <span style=\"color:#075;\">1</span><br /><span style=\"color:#369;\">sco2.b</span> = <span style=\"color:#075;\">1</span><br /><span style=\"color:#369;\">sco2.c</span> = <span style=\"color:#075;\">1</span>","var"]
								],
								[
									["s","log(<span style=\"color:#075;\">&quot;second&quot;</span>)","system"]
								],
								[
									["s","break <span style=\"color:#369;\">if1</span>","control"]
								]
							]],
							["[",[
								[
									["s","log(<span style=\"color:#075;\">&quot;third&quot;</span>)","system"]
								],
								[
									["s","break <span style=\"color:#369;\">if1</span>","control"]
								]
							]]
						]
					]]
				],
				[
					["s","break <span style=\"color:#369;\">if1</span>","control"]
				]
			]];
			
			edges.push([[table["if"][1][0][0],1],[table["if"][1][1][0][1][0][0][1][0][0],0]]);
			edges.push([[table["if"][1][1][0][1][0][0][1][0][0],1],[table["if"][1][1][0][1][1][0],0]]);
			
			edges.push([[table["if"][1][1][0][1][1][0],1],[table["if"][1][1][0][1][4][0][1][0][0],0]]);
			edges.push([[table["if"][1][1][0][1][4][0][1][0][0],1],[table["if"][1][2][0],0]]);
			
			edges.push([[table["if"][1][1][0][1][1][0],3],[table["if"][1][1][0][1][2][1][1][0][0],0]]);
			edges.push([[table["if"][1][1][0][1][2][1][1][0][0],1],[table["if"][1][1][0][1][3][1],0]]);
			
			edges.push([[table["if"][1][1][0][1][3][1],1],[table["if"][1][1][0][1][4][1][1][0][0],0]]);
			edges.push([[table["if"][1][1][0][1][4][1][1][0][0],1],[table["if"][1][1][0][1][4][1][1][1][0],0]]);
			edges.push([[table["if"][1][1][0][1][4][1][1][1][0],1],[table["if"][1][1][0][1][4][1][1][2][0],0]]);
			edges.push([[table["if"][1][1][0][1][4][1][1][2][0],1],[table["if"][1][1][0][1][4][1][1][3][0],0]]);
			
			edges.push([[table["if"][1][1][0][1][3][1],3],[table["if"][1][1][0][1][4][2][1][0][0],0]]);
			edges.push([[table["if"][1][1][0][1][4][2][1][0][0],1],[table["if"][1][1][0][1][4][2][1][1][0],0]]);
			
			//edges.push([[table["if"][1][1][0][1][4][1][1][3][0],4],[table["if"][1][2][0],4],{bg: true}]);
			//edges.push([[table["if"][1][1][0][1][4][2][1][1][0],4],[table["if"][1][2][0],4],{bg: true}]);
			
			table["switch"] = ["[",[
				[
					["s","n0&lt;pk&gt;<span style=\"color:#f06;\">(package1)</span>.n3&lt;cls&gt;<span style=\"color:#f06;\">(class2)</span>.n2&lt;fun&gt;<span style=\"color:#f06;\">(function1)</span>","htmlrelpath"]
				],
				[
					["[",[
						[
							["[",[
								[
									["s","$3 = <span style=\"color:#075;\">1</span>","statement"]
								]
							]]
						],
						[
							["s","<span style=\"color:#369;\">if3</span> $3","if"]
						],
						[
							null,
							["[",[
								[
									["s","$4 = <span style=\"color:#075;\">1</span>","statement"]
								]
							]]
						],
						[
							null,
							["s","$4","if"]
						],
						[
							null,
							null,
							["[",[
								[
									["s","$5 = <span style=\"color:#075;\">1</span>","statement"]
								]
							]]
						],
						[
							null,
							null,
							["s","$5","if"]
						],
						[
							null,
							["s","case <span style=\"color:#369;\">cas4</span>","control"],
							["s","case <span style=\"color:#369;\">cas4</span>","control"],
							null
						],
						[
							["[",[
								[
									["s","log(<span style=\"color:#075;\">&quot;first&quot;</span>)","system"]
								]
							]],
							["[",[
								[
									["s","<span style=\"color:#369;\">sco5</span><br /><span style=\"color:#369;\">sco5.a</span> = <span style=\"color:#075;\">1</span><br /><span style=\"color:#369;\">sco5.b</span> = <span style=\"color:#075;\">1</span><br /><span style=\"color:#369;\">sco5.c</span> = <span style=\"color:#075;\">1</span>","var"]
								],
								[
									["s","log(<span style=\"color:#075;\">&quot;second&quot;</span>)","system"]
								],
								[
									["s","","statement"]
								],
								[
									["s","break <span style=\"color:#369;\">if3</span>","control"]
								]
							]],
							null,
							["[",[
								[
									["s","log(<span style=\"color:#075;\">&quot;third&quot;</span>)","system"]
								],
								[
									["s","break <span style=\"color:#369;\">if3</span>","control"]
								]
							]]
						]
					]]
				],
				[
					["s","break <span style=\"color:#369;\">if3</span>","control"]
				]
			]];
			
			edges.push([[table["if"][1][2][0],1],[table["switch"][1][0][0],0]]);
			edges.push([[table["switch"][1][0][0],1],[table["switch"][1][1][0][1][0][0][1][0][0],0]]);
			edges.push([[table["switch"][1][1][0][1][0][0][1][0][0],1],[table["switch"][1][1][0][1][1][0],0]]);
			
			edges.push([[table["switch"][1][1][0][1][1][0],1],[table["switch"][1][1][0][1][7][0][1][0][0],0]]);
			edges.push([[table["switch"][1][1][0][1][7][0][1][0][0],1],[table["switch"][1][2][0],0]]);
			
			edges.push([[table["switch"][1][1][0][1][1][0],3],[table["switch"][1][1][0][1][2][1][1][0][0],0]]);
			edges.push([[table["switch"][1][1][0][1][2][1][1][0][0],1],[table["switch"][1][1][0][1][3][1],0]]);
			
			edges.push([[table["switch"][1][1][0][1][3][1],1],[table["switch"][1][1][0][1][6][1],0]]);
			edges.push([[table["switch"][1][1][0][1][6][1],1],[table["switch"][1][1][0][1][7][1][1][0][0],0]]);
			edges.push([[table["switch"][1][1][0][1][7][1][1][0][0],1],[table["switch"][1][1][0][1][7][1][1][1][0],0]]);
			edges.push([[table["switch"][1][1][0][1][7][1][1][1][0],1],[table["switch"][1][1][0][1][7][1][1][2][0],0]]);
			edges.push([[table["switch"][1][1][0][1][7][1][1][2][0],1],[table["switch"][1][1][0][1][7][1][1][3][0],0]]);
			
			edges.push([[table["switch"][1][1][0][1][3][1],3],[table["switch"][1][1][0][1][4][2][1][0][0],0]]);
			edges.push([[table["switch"][1][1][0][1][4][2][1][0][0],1],[table["switch"][1][1][0][1][5][2],0]]);
			
			edges.push([[table["switch"][1][1][0][1][5][2],1],[table["switch"][1][1][0][1][6][2],0]]);
			
			edges.push([[table["switch"][1][1][0][1][5][2],3],[table["switch"][1][1][0][1][7][3][1][0][0],0]]);
			edges.push([[table["switch"][1][1][0][1][7][3][1][0][0],0],[table["switch"][1][1][0][1][7][3][1][1][0],0]]);
			
			//edges.push([[table["switch"][1][1][0][1][6][2],4],[table["switch"][1][1][0][1][6][1],4],{bg: true}]);
			
			//edges.push([[table["switch"][1][1][0][1][7][1][1][3][0],4],[table["switch"][1][2][0],4],{bg: true}]);
			//edges.push([[table["switch"][1][1][0][1][7][3][1][1][0],4],[table["switch"][1][2][0],4],{bg: true}]);
			
			table["while"] = ["[",[
				[
					["s","n0&lt;pk&gt;<span style=\"color:#f06;\">(package1)</span>.n3&lt;cls&gt;<span style=\"color:#f06;\">(class2)</span>.n2&lt;fun&gt;<span style=\"color:#f06;\">(function1)</span>","htmlrelpath"]
				],
				[
					["[",[
						[
							["s","<span style=\"color:#369;\">sco7</span><br /><span style=\"color:#369;\">sco7.a</span> = <span style=\"color:#075;\">1</span><br /><span style=\"color:#369;\">sco7.b</span> = <span style=\"color:#075;\">1</span><br /><span style=\"color:#369;\">sco7.c</span> = <span style=\"color:#075;\">1</span>","var"]
						]
					]]
				],
				[
					["s","<span style=\"color:#369;\">whl6</span> $6","while"]
				],
				[
					["[",[
						[
							["s","log(<span style=\"color:#075;\">&quot;statement&quot;</span>)","system"]
						],
						[
							["[",[
								[
									["[",[
										[
											["s","$7 = <span style=\"color:#075;\">1</span>","statement"]
										]
									]]
								],
								[
									["s","$7","if"]
								],
								[
									["[",[
										[
											["s","continue <span style=\"color:#369;\">whl6</span>","control"] //// same col -> no bg edge !
										]
									]],
									["[",[
										[
											["s","<span style=\"color:#369;\">sco7</span><br /><span style=\"color:#369;\">sco7.a</span> = <span style=\"color:#075;\">1</span><br /><span style=\"color:#369;\">sco7.b</span> = <span style=\"color:#075;\">1</span><br /><span style=\"color:#369;\">sco7.c</span> = <span style=\"color:#075;\">1</span>","var"]
										],
										[
											["s","","statement"]
										],
										[
											["s","break <span style=\"color:#369;\">whl6</span>","control"]
										]
									]]
								]
							]]
						]
					]],
					["[",[
						[
							["s","log(<span style=\"color:#075;\">&quot;condition&quot;</span>)","system"]
						],
						[
							["s","$6 = <span style=\"color:#075;\">1</span>","statement"]
						]
					]],
					["[",[
						[
							["s","log(<span style=\"color:#075;\">&quot;step&quot;</span>)","system"]
						]
					]]
				],
				[
					["s","break <span style=\"color:#369;\">whl6</span>","control"] //// no fg edge here !
				]
			]];
			
			edges.push([[table["switch"][1][2][0],1],[table["while"][1][0][0],0]]);
			edges.push([[table["while"][1][0][0],1],[table["while"][1][1][0][1][0][0],0]]);
			edges.push([[table["while"][1][1][0][1][0][0],1],[table["while"][1][2][0],0]]);
			
			edges.push([[table["while"][1][2][0],1],[table["while"][1][3][0][1][0][0],0]]);
			edges.push([[table["while"][1][3][0][1][0][0],1],[table["while"][1][3][0][1][1][0][1][0][0][1][0][0],0]]);
			edges.push([[table["while"][1][3][0][1][1][0][1][0][0][1][0][0],1],[table["while"][1][3][0][1][1][0][1][1][0],0]]);
			
			edges.push([[table["while"][1][3][0][1][1][0][1][1][0],1],[table["while"][1][3][0][1][1][0][1][2][0][1][0][0],0]]);
			
			edges.push([[table["while"][1][3][0][1][1][0][1][1][0],3],[table["while"][1][3][0][1][1][0][1][2][1][1][0][0],0]]);
			edges.push([[table["while"][1][3][0][1][1][0][1][2][1][1][0][0],1],[table["while"][1][3][0][1][1][0][1][2][1][1][1][0],0]]);
			edges.push([[table["while"][1][3][0][1][1][0][1][2][1][1][1][0],1],[table["while"][1][3][0][1][1][0][1][2][1][1][2][0],0]]);
			
			edges.push([[table["while"][1][2][0],5],[table["while"][1][3][1][1][0][0],0]]);
			edges.push([[table["while"][1][3][1][1][0][0],1],[table["while"][1][3][1][1][1][0],0]]);
			
			edges.push([[table["while"][1][2][0],6],[table["while"][1][3][2][1][0][0],0]]);
			
			//edges.push([[table["while"][1][3][0][1][1][0][1][2][1][1][2][0],4],[table["while"][1][4][0],4],{bg: true}]);
			
			table["for in"] = ["[",[
				[
					["s","n0&lt;pk&gt;<span style=\"color:#f06;\">(package1)</span>.n3&lt;cls&gt;<span style=\"color:#f06;\">(class2)</span>.n2&lt;fun&gt;<span style=\"color:#f06;\">(function1)</span>","htmlrelpath"]
				],
				[
					["[",[
						[
							["s","$8 = <span style=\"color:#075;\">[]</span>","statement"]
						]
					]]
				],
				[
					["s","<span style=\"color:#369;\">whl8</span> $8","while"]
				],
				[
					["[",[
						[
							["s","log(<span style=\"color:#075;\">&quot;statement&quot;</span>)","system"]
						],
						[
							["[",[
								[
									["[",[
										[
											["s","$9 = <span style=\"color:#075;\">1</span>","statement"]
										]
									]]
								],
								[
									["s","$9","if"]
								],
								[
									["[",[
										[
											["s","continue <span style=\"color:#369;\">whl8</span>","control"] //// same col -> no bg edge !
										]
									]],
									["[",[
										[
											["s","<span style=\"color:#369;\">sco9</span><br /><span style=\"color:#369;\">sco9.a</span> = <span style=\"color:#075;\">1</span><br /><span style=\"color:#369;\">sco9.b</span> = <span style=\"color:#075;\">1</span><br /><span style=\"color:#369;\">sco9.c</span> = <span style=\"color:#075;\">1</span>","var"]
										],
										[
											["s","","statement"]
										],
										[
											["s","break <span style=\"color:#369;\">whl8</span>","control"]
										]
									]]
								]
							]]
						]
					]],
					["[",[
						[
							["s","<span style=\"color:#369;\">sco9</span><br /><span style=\"color:#369;\">sco9.a</span> = <span style=\"color:#075;\">1</span><br /><span style=\"color:#369;\">sco9.b</span> = <span style=\"color:#075;\">1</span><br /><span style=\"color:#369;\">sco9.c</span> = <span style=\"color:#075;\">1</span>","var"]
						]
					]]
				],
				[
					["s","break <span style=\"color:#369;\">whl8</span>","control"] //// no fg edge here !
				]
			]];
			
			edges.push([[table["while"][1][4][0],1],[table["for in"][1][0][0],0]]);
			edges.push([[table["for in"][1][0][0],1],[table["for in"][1][1][0][1][0][0],0]]);
			edges.push([[table["for in"][1][1][0][1][0][0],1],[table["for in"][1][2][0],0]]);
			
			edges.push([[table["for in"][1][2][0],1],[table["for in"][1][3][0][1][0][0],0]]);
			edges.push([[table["for in"][1][3][0][1][0][0],1],[table["for in"][1][3][0][1][1][0][1][0][0][1][0][0],0]]);
			edges.push([[table["for in"][1][3][0][1][1][0][1][0][0][1][0][0],1],[table["for in"][1][3][0][1][1][0][1][1][0],0]]);
			
			edges.push([[table["for in"][1][3][0][1][1][0][1][1][0],1],[table["for in"][1][3][0][1][1][0][1][2][0][1][0][0],0]]);
			
			edges.push([[table["for in"][1][3][0][1][1][0][1][1][0],3],[table["for in"][1][3][0][1][1][0][1][2][1][1][0][0],0]]);
			edges.push([[table["for in"][1][3][0][1][1][0][1][2][1][1][0][0],1],[table["for in"][1][3][0][1][1][0][1][2][1][1][1][0],0]]);
			edges.push([[table["for in"][1][3][0][1][1][0][1][2][1][1][1][0],1],[table["for in"][1][3][0][1][1][0][1][2][1][1][2][0],0]]);
			
			edges.push([[table["for in"][1][2][0],3],[table["for in"][1][3][1][1][0][0],0]]);
			
			//edges.push([[table["for in"][1][3][0][1][1][0][1][2][1][1][2][0],4],[table["for in"][1][4][0],4],{bg: true}]);
			
			
			
			
			table["try"] = ["[",[
				//// try catch normal: break
				//// try catch throw: catch break/throw
				//// try finally normal: finally break
				//// try finally throw: finally throw (draw duplicate code in parallel cols)
				//// try catch finally normal: finally break
				//// try catch finally throw: catch finally break/throw (draw duplicate code in parallel cols)
			]];
			
			table["blk"] = ["[",[
			]];
			
			table["layout"] = ["[",[
				[
					["s","enter n0&lt;pk&gt;<span style=\"color:#f06;\">(package1)</span>.n3&lt;cls&gt;<span style=\"color:#f06;\">(class2)</span>.n2&lt;fun&gt;<span style=\"color:#f06;\">(function1)</span>","control"]
				],
				[],
				[],
				[
					table["parameter"]
				],
				[],
				[],
				[
					table["if"]
				],
				[],
				[],
				[
					table["switch"]
				],
				[],
				[],
				[
					table["while"]
				],
				[],
				[],
				[
					table["for in"]
				],
				[],
				[],
				[
					table["try"]
				],
				[],
				[],
				[
					table["blk"]
				],
				[],
				[
					["s","return <span style=\"color:#f06;\">function1</span>","control"]
				]
			]];
			
			sampleproject.gen = main.session.analyze.sampleproject || sampleproject.gen;
			
			table["flowchart"] = ["[",[
				[
					table["size"]
				],
				[
					table["layout"]
				],
				[
					sampleproject.gen[0]
				]
			]];
			
			edges.push.apply(edges,sampleproject.gen[1]);
			
			main.session.analyze.sampleproject = null; //// UPDATE !!!
			
			
			return {table: table["flowchart"],edges: edges};
		},
		test2: ["project \"&<u>\\\"\\\'\\\\\" {",
"	package package1 {",
"		package package2 {",
"		}",
"		",
"		package package3 {",
"		}",
"		",
"		class class1 {",
"		}",
"		",
"		class class2 {",
"			var a, b = 1;",
"			",
"			var x, y = 1;",
"			",
"			var map = {",
"				x: 1,",
"				\"&<u>\\\"\\\'\\\\\": 2,",
"				1: 3,",
"			};",
"			",
"			var list = [",
"				1,",
"				2",
"			];",
"			",
"			function function1: (parameter1, parameter2) {",
"			};",
"			",
"			function function2: (parameter1, parameter2) {",
"				{",
"					1;",
"					2;",
"				}",
"				if(x==1) {",
"					x=1;",
"					varName1=2;",
"				}",
"				else if(2) {",
"					1;",
"					2;",
"				}",
"				else if(x==3) {",
"					1;",
"					2;",
"				}",
"				else {",
"					if(4) {",
"					}",
"					else if(5) {",
"					}",
"				}",
"				switch(1) {",
"				case 1:",
"					1;",
"					2;",
"					break;",
"				case 2:",
"					1;",
"					2;",
"					break;",
"				default:",
"					1;",
"					2;",
"					break;",
"				}",
"				while(1) {",
"					1;",
"					2;",
"				}",
"				for(var x = 1; x; ++x, ++x) {",
"					1;",
"					2;",
"				}",
"				for(var x in y) {",
"					1;",
"					2;",
"				}",
"				try {",
"					1;",
"					2;",
"				}",
"				catch {",
"					1;",
"					2;",
"				}",
"				finally {",
"					1;",
"					2;",
"				}",
"				var x, y = 1, t;",
"				continue;",
"				break;",
"				return;",
"				throw;",
"				t = ((1) ? 1 : 1);",
"				t = (x = 1);",
"				t = (x *= 1);",
"				t = (x += 1);",
"				t = x || y;",
"				t = x && y;",
"				t = x + y;",
"				t = x * y;",
"				x = y;",
"				t = (x = y);",
"				++x;",
"				--x;",
"				x++;",
"				x--;",
"				t = (a = ++x) / 3;",
"				t = (a = --x) / 3;",
"				t = (a = x++) / 3;",
"				t = (a = x--) / 3;",
"				t = x.k;",
"				x[y(1)];",
"				function1(x + 1,y + 1);",
"				t = function1(x + 1,y + 1);",
"				system.log(\"string\" + (x + 1));",
"			};",
"			",
"		}",
"		",
"	}",
"	",
"}"].join("\n"),
	};
}