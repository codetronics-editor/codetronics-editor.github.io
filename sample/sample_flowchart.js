project "&<u>\"\'\\" {
	package package1 {
		package package2 {
		}
		
		package package3 {
		}
		
		class class1 {
		}
		
		class class2 {
			var a, b = 1;
			
			var x, y = 1;
			
			var map = {
				x: 1,
				"&<u>\"\'\\": 2,
				1: 3,
			};
			
			var list = [
				1,
				2
			];
			
			function function1: (parameter1, parameter2) {
			};
			
			function function2: (parameter1, parameter2) {
				{
					1;
					2;
				}
				if(x==1) {
					x=1;
					varName1=2;
				}
				else if(2) {
					1;
					2;
				}
				else if(x==3) {
					1;
					2;
				}
				else {
					if(4) {
					}
					else if(5) {
					}
				}
				switch(1) {
				case 1:
					1;
					2;
					break;
				case 2:
					1;
					2;
					break;
				default:
					1;
					2;
					break;
				}
				while(1) {
					1;
					2;
				}
				for(var x = 1; x; ++x, ++x) {
					1;
					2;
				}
				for(var x in y) {
					1;
					2;
				}
				try {
					1;
					2;
				}
				catch {
					1;
					2;
				}
				finally {
					1;
					2;
				}
				var x, y = 1, t;
				continue;
				break;
				return;
				throw;
				t = ((1) ? 1 : 1);
				t = (x = 1);
				t = (x *= 1);
				t = (x += 1);
				t = x || y;
				t = x && y;
				t = x + y;
				t = x * y;
				x = y;
				t = (x = y);
				++x;
				--x;
				x++;
				x--;
				t = (a = ++x) / 3;
				t = (a = --x) / 3;
				t = (a = x++) / 3;
				t = (a = x--) / 3;
				t = x.k;
				x[y(1)];
				function1(x + 1,y + 1);
				t = function1(x + 1,y + 1);
				system.log("string" + (x + 1));
			};
			
		}
		
	}
	
}