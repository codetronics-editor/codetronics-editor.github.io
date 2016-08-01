project ControlFlow {
	package ControlFlow {
		class A {
			function main(x) {
				if(x < 5) {
					console.log("x < 5");
				}
			}
		}
		class B {
			function main(x,y) {
				var z = (x < 5) ? proc1(x) : y;
				
				console.log(z);
			}
			
			function proc1(x) {
				return 2 * x;
			}
		}
		class C {
			function main(x,y) {
				for(var i = 0; i < y; i++) {
					if() {
						x += 2;
					}
				}
				
				console.log(x);
			}
		}
		class G {
			function main(x,y) {
				try {
					proc1(x,y);
				}
				catch(ex) {
					console.log("div by 0");
				}
				
				proc1(x,y);
			}
			
			function proc1(x,y) {
				return x / y;
			}
		}
	}
}