@{"name": "overwrite"}project Project1 {
	@{"name": "overwrite"}package Package1 {
	}
	@{"name": "overwrite"}package Package2 {
		@{"name": "overwrite"}package Package3 {
		}
		@{"name": "overwrite"}class Class1 {
			var property1 = null;
			var property2 = true;
			var property3 = false;
			var property4 = "";
			var property5 = '';
			var property6 = "string1";
			var property7 = 'string2';
			var property8 = "\"";
			var property9 = '\'';
			var property10 = 0;
			var property11 = 1;
			var property12 = 1234567890;
			var property13 = 0.123456789;
			var property14 = 1.123456789;
			var property15 = 1234567890.123456789;
			var property16 = 0x0;
			var property17 = 0x1;
			var property18 = 0x1234567890ABCDEF;
			var property19 = [];
			var property20 = [
				null,
				true,
				false,
				"",
				'',
				"string1",
				'string2',
				"\"",
				'\'',
				0,
				1,
				1234567890,
				0.123456789,
				1.123456789,
				1234567890.123456789,
				0x0,
				0x1,
				0x1234567890ABCDEF,
				[],
				[
					null,
					true,
					false,
					"",
					'',
					"string1",
					'string2',
					"\"",
					'\'',
					0,
					1,
					1234567890,
					0.123456789,
					1.123456789,
					1234567890.123456789,
					0x0,
					0x1,
					0x1234567890ABCDEF,
				],
				{},
				{
					property1: null,
					property2: true,
					property3: false,
					property4: "",
					property5: '',
					property6: "string1",
					property7: 'string2',
					property8: "\"",
					property9: '\'',
					property10: 0,
					property11: 1,
					property12: 1234567890,
					property13: 0.123456789,
					property14: 1.123456789,
					property15: 1234567890.123456789,
					property16: 0x0,
					property17: 0x1,
					property18: 0x1234567890ABCDEF,
				}
			];
			var property21 = {};
			var property22 = {
				property1: null,
				property2: true,
				property3: false,
				property4: "",
				property5: '',
				property6: "string1",
				property7: 'string2',
				property8: "\"",
				property9: '\'',
				property10: 0,
				property11: 1,
				property12: 1234567890,
				property13: 0.123456789,
				property14: 1.123456789,
				property15: 1234567890.123456789,
				property16: 0x0,
				property17: 0x1,
				property18: 0x1234567890ABCDEF,
				property19: [],
				property20: [
					null,
					true,
					false,
					"",
					'',
					"string1",
					'string2',
					"\"",
					'\'',
					0,
					1,
					1234567890,
					0.123456789,
					1.123456789,
					1234567890.123456789,
					0x0,
					0x1,
					0x1234567890ABCDEF,
				],
				property21: {},
				property22: {
					property1: null,
					property2: true,
					property3: false,
					property4: "",
					property5: '',
					property6: "string1",
					property7: 'string2',
					property8: "\"",
					property9: '\'',
					property10: 0,
					property11: 1,
					property12: 1234567890,
					property13: 0.123456789,
					property14: 1.123456789,
					property15: 1234567890.123456789,
					property16: 0x0,
					property17: 0x1,
					property18: 0x1234567890ABCDEF,
				},
			};
			var property23 = [
				true || true,
				false || false,
				true && true,
				false && false,
				3 | 6,
				3 ^ 6,
				3 & 6,
				true == true,
				true == false,
				true === true,
				true === false,
				true != true,
				true != false,
				true !== true,
				true !== false,
				2 < 2,
				2 < 3,
				3 <= 2,
				2 <= 2,
				2 > 2,
				3 > 2,
				2 >= 3,
				2 >= 2,
				3 << 1,
				7 >> 1,
				(0 - 7) >> 1,
				7 >>> 1,
				(0 - 7) >>> 1,
				3 + 5,
				3 - 5,
				3 * 5,
				7 / 3,
				7 % 3,
				!true,
				!false,
				~0,
				~1
			];
			function function1() {
			};
			function function2(parameter1) {
				for(;false;) {
					if(false)
						continue;
					else if(false)
						break;
					else if(false)
						return;
					else if(false)
						throw;
				}
			};
			function function3(parameter1,parameter2) {
				var a;
				a = ((((3))));
				var b = ((((5))));
				var c,d;
				c = 7;
				d = 11;
				var e = 13,f = 17,x = "property12",y,z;
				y = "property13";
				z = "property14";
				
				{}
				{
					if(a + b * c / d) {
					}
					if(property22[x]) {
					}
					switch(Package1.Package2.Class1.property13) {
					}
					switch(property22.property22.property14) {
					}
				}
				
				if(true) {
				}
				else {
				}
				if(true) {
				}
				else if(true) {
				}
				if(true) {
				}
				else if(true) {
				}
				else {
				}
				if("string1") {
				}
				else if('string2') {
				}
				if(1) {
				}
				else if(0x1) {
				}
				if(property12) {
				}
				else if(property13) {
				}
				if(Package1.Package2.Class1.property14) {
				}
				else if(Package1.Package2.Class1.property15) {
				}
				if(property22.property22.property16) {
				}
				else if(property22.property22.property17) {
				}
				if(a + b * c / d) {
				}
				if(property22[x]) {
				}
				if(true) {
					a + b * c / d;
					property22[x];
				}
				
				
				switch(true) {
				}
				switch("string1") {
				}
				switch(1) {
				}
				switch(property12) {
				}
				switch(Package1.Package2.Class1.property13) {
				}
				switch(property22.property22.property14) {
				}
				switch(1) {
				case null:
					break;
				case true:
					break;
				case false:
					break;
				case "":
					break;
				case '':
					break;
				case "string1":
					break;
				case 'string2':
					break;
				case "\"":
					break;
				case '\'':
					break;
				case 0:
					break;
				case 1:
					break;
				case 1234567890:
					break;
				case 0.123456789:
					break;
				case 1.123456789:
					break;
				case 1234567890.123456789:
					break;
				case 0x0:
					break;
				case 0x1:
					break;
				case 0x1234567890ABCDEF:
					break;
				default:
					break;
				}
				switch(1) {
				case null:
				case true:
				case false:
				case "":
				case '':
				case "string1":
				case 'string2':
				case "\"":
				case '\'':
				case 0:
				case 1:
				case 1234567890:
				case 0.123456789:
				case 1.123456789:
				case 1234567890.123456789:
				case 0x0:
				case 0x1:
				case 0x1234567890ABCDEF:
					break;
				default:
					break;
				}
				
				for(var i = 0; i < 1234567890; ++i) {
				}
				for(;;) {
				}
				for(var i = 0;;) {
				}
				for(; i < 1234567890;) {
				}
				for(;; ++i) {
				}
				for(var i,j = 0; i && j; ++i, --j) {
				}
				
				for(var key in property22) {
					system.log(key + ": " + property22[key]);
				}
				{
					for(var key = 1 in property22) {
					}
					for(var key,key2 in property22) {
					}
				}
				
				while(true) {
				}
				while("string1") {
				}
				while(1) {
				}
				while(property12) {
				}
				while(Package1.Package2.Class1.property13) {
				}
				while(property22.property22.property14) {
				}
				while(true) {
					continue;
				}
				while(true) {
					break;
				}
				while(true) {
					return;
				}
				while(true) {
					throw;
				}
				while(true) {
					a + b * c / d;
					property22[x];
				}
				
				try {
				}
				catch {
				}
				try {
				}
				finally {
				}
				try {
				}
				catch {
				}
				finally {
				}
				
				null;
				true;
				false;
				"";
				'';
				"string1";
				'string2';
				"\"";
				'\'';
				0;
				1;
				1234567890;
				0.123456789;
				1.123456789;
				1234567890.123456789;
				0x0;
				0x1;
				0x1234567890ABCDEF;
			};
		}
	}
}